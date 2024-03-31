import os
import requests
import tweepy
import logging

from config import CONSUMER_KEY, CONSUMER_SECRET
from get_post_text import get_post_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

server_port = os.getenv('SERVER_PORT', '5433')
server_url = f'http://server:{server_port}/'
bots_endpoint = f'{server_url}bots/'
actions_endpoint = f'{server_url}actions/'
posts_endpoint = f'{server_url}posts/'
RESPONSE_SERVICE_URL = 'http://comment-generator-service:5000/generate_response'
RELEVANCE_CHECK_URL = 'http://comment-generator-service:5000/is_relevant'

bots = []
clients = []
#update the action new information like content and the new tweet after the bot have done it. 
def update_action_details(action_id, status, content=None, tweet_url=None):
    try:
        update_url = f"{actions_endpoint}{action_id}"
        data = {
            "status": status,
            "comment": content,
            "twitterPostId": tweet_url
        }
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}
        response = requests.put(update_url, json=data)
        if response.status_code == 200:
            logger.info(f"Successfully updated action {action_id} with status: {status}, content, and tweet URL.")
        else:
            logger.error(f"Failed to update action {action_id}. Server responded with status code: {response.status_code}, {response.text}")
    except Exception as e:
        logger.error(f"Exception occurred while updating action {action_id}: {e}")

#try to login with the bot and check if it valid.
def verify_bot_auth(access_token, access_token_secret):
    try:
        auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
        auth.set_access_token(access_token, access_token_secret)
        api = tweepy.API(auth)
        api.verify_credentials()
        return True
    except Exception as e:
        logger.error("Credential verification failed: %s", e)
        return False

#calls the comment-generator-service, get a comment and publish it.
def generate_ai_comment(post_text, response_types):
    try:
        response = requests.post(RESPONSE_SERVICE_URL, json={'tweet': post_text, 'response_types': response_types})
        if response.status_code == 200 and "response" in response.json():
            return response.json()['response'].strip('"')
    except Exception as e:
        logger.error(f"Failed to generate AI comment: {e}")
    return ""


import requests

def mark_action_failed(action_id):
    url = f"{actions_endpoint}{action_id}"
    response = requests.put(url, json={"status": "FAILED"})
    if response.status_code == 200:
        logger.info(f"Action {action_id} marked as FAILED.")
    else:
        logger.error(f"Failed to mark action {action_id} as FAILED. Response: {response.text}")


def update_post_on_server(post_link, retweet_content, action_id):
    post_data = {
        'link': post_link,
        'content': retweet_content,
        'type': 'RETWEET',
    }
    response = requests.post(posts_endpoint, json=post_data)
    if response.status_code in [200, 201]:
        logger.info(f"Post for action {action_id} successfully updated on server.")
    else:
        logger.error(f"Failed to update post for action {action_id} on server. Status code: {response.status_code}, Response: {response.text}")

#call the comment-generator-service, get a retweet text and publish it as a retweet.
def handle_retweet(post_id, post_text, post_link, bot_index, action_id):
    response_types = bots[bot_index].get('personalityTraits', [])

    if len(post_text) < 3 :
        post_text = get_post_text(post_id)
    generated_comment = generate_ai_comment(post_text, response_types)
    retweet_content = f"{post_link}\n\n{generated_comment}"
    tweet_post_response = post_tweet(bot_index, retweet_content, action_id)

    if tweet_post_response.get("status") == "success":
        logger.info(f"Retweet action {action_id} posted successfully.")
        mark_action_complete(action_id)
        retweet_url = tweet_post_response.get("url")
        update_post_on_server(retweet_url, retweet_content, action_id)
        tweet_url = tweet_post_response.get("url")  # URL of the posted tweet
        update_action_details(action_id, "COMPLETED", retweet_content, tweet_url)
    else:
        mark_action_failed(action_id)
        error_message = tweet_post_response.get("message", "Failed to post retweet.")
        logger.error(f"Error in retweet action {action_id}: {error_message}")


def update_bot_status_in_db(bot_id, status):
    response = requests.put(f'{bots_endpoint}{bot_id}', json={'status': status})
    if response.status_code == 200:
        logger.info("Bot ID %s status updated to %s", bot_id, status)
    else:
        logger.error("Failed to update status for bot ID %s", bot_id)


def mark_bot_inactive(bot_id):
    url = f"{server_url}bots/{bot_id}"
    response = requests.put(url, json={"status": "INACTIVE"})
    if response.status_code == 200:
        logger.info(f"Bot ID {bot_id} marked as INACTIVE.")
    else:
        logger.error(f"Failed to mark bot ID {bot_id} as INACTIVE. Status code: {response.status_code}")

#go over all the bots in the server and update them in the bot manager.
def update_bots():
    response = requests.get(bots_endpoint)
    if response.status_code == 200:
        bots_data = response.json().get('data', [])
        bots.clear()
        clients.clear()
        for bot in bots_data:
            try:
                if verify_bot_auth(bot['accessToken'], bot['accessTokenSecret']):
                    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
                    auth.set_access_token(bot['accessToken'], bot['accessTokenSecret'])
                    api = tweepy.API(auth)
                    client = tweepy.Client(consumer_key=CONSUMER_KEY, consumer_secret=CONSUMER_SECRET,
                                           access_token=bot['accessToken'],
                                           access_token_secret=bot['accessTokenSecret'])
                    bots.append({
                        "id": bot["id"],
                        "api": api,
                        "client": client,
                        "username": api.verify_credentials().screen_name,
                        "personalityTraits": bot.get("personalityTraits", [])
                    })
                    clients.append(client)
                else:
                    mark_bot_inactive(bot['id'])
            except Exception as e:
                logger.error(f"Error during bot setup for bot ID {bot['id']}: {e}")
                mark_bot_inactive(bot['id'])
    else:
        logger.error("Failed to fetch bots from the database.")




update_bots()

#not used - deletes posts using the tweepy api
def delete_tweet_bot(bot_index, tweet_id):
    if bot_index >= len(bots) or bot_index < 0:
        logger.error("Invalid bot index: %s", bot_index)
        return False
    try:
        client = bots[bot_index]['client']
        response = client.delete_tweet(id=tweet_id)
        if response:
            logger.info("Tweet ID %s deleted successfully.", tweet_id)
            return True
    except Exception as e:
        logger.error("Error deleting tweet: %s", e)
    return False


def comment_with_ai(post_id, post_text, bot_index, action_id):
    if bot_index >= len(bots) or bot_index < 0:
        logger.error("Invalid bot index: %s", bot_index)
        return {"status": "error", "message": "Invalid bot index."}, 400
    if len(post_text) < 3:
        post_text = get_post_text(post_id)
    relevance_response = requests.post(RELEVANCE_CHECK_URL, json={'post': post_text})
    relevance = relevance_response.json().get('is_relevant', False)
    if not relevance:
        logger.warning("Post is not relevant: %s", post_text)
    response_types = bots[bot_index].get('personalityTraits', [])
    response = requests.post(RESPONSE_SERVICE_URL, json={'tweet': post_text, 'response_types': response_types})
    if response.status_code != 200:
        return {"status": "error", "message": "External service error"}, 500
    reply_text = response.json().get('response', '').strip('"')
    if reply_text == "No comment was generated.":
        return {"status": "error", "message": "No comment generated"}, 500
    try:
        client = bots[bot_index]['client']
        response = client.create_tweet(text=reply_text, in_reply_to_tweet_id=post_id)
        if response:
            tweet_id = response.data['id']
            bot_username = bots[bot_index]['username']
            tweet_url = f"https://twitter.com/{bot_username}/status/{tweet_id}"
            logger.info(f"Reply posted successfully: {tweet_url}")
            update_action_details(action_id, "COMPLETED", content=reply_text, tweet_url=tweet_url)
            return {"status": "success", "message": "Reply posted successfully", "url": tweet_url}
    except Exception as e:
        mark_action_failed(action_id)
        logger.error("Failed to post comment: %s", e)
    return {"status": "error", "message": "Failed to post comment"}, 500

def mark_action_complete(action_id):
    url = f"{actions_endpoint}{action_id}"
    response = requests.put(url, json={"status": "COMPLETED"})
    if response.status_code == 200:
        logger.info("Action %s marked as completed.", action_id)
    else:
        logger.error("Failed to mark action %s as completed.", action_id)

#post a tweet (not a retweet)

def post_tweet(bot_index, post_text, action_id=None):
    if bot_index >= len(bots) or bot_index < 0:
        logger.error("Invalid bot index: %s", bot_index)
        return {"status": "error", "message": "Invalid bot index."}

    try:
        client = bots[bot_index]['client']
        response = client.create_tweet(text=post_text)
        if response:
            tweet_id = response.data['id']
            tweet_url = f"https://twitter.com/user/status/{tweet_id}"
            logger.info(f"Tweet posted successfully: {tweet_url}")
            if action_id:
                mark_action_complete(action_id)
            return {"status": "success", "url": tweet_url}
    except Exception as e:
        mark_action_failed(action_id)
        logger.error(f"Failed to post tweet: {e}")
        return {"status": "error", "message": str(e)}
