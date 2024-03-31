import requests
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import random
import re

from get_post_text import get_post_text
from twitter_bot import bots, comment_with_ai, post_tweet, update_bots, actions_endpoint, handle_retweet

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = 'http://server:5433'
ACTIONS = f'{BASE_URL}/actions'


class BotManager:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.handling_actions = set()
        self.update_bots_and_schedule_tasks()

    def update_bots_and_schedule_tasks(self):
        self.scheduler.add_job(update_bots, 'interval', minutes=1, next_run_time=datetime.now())
        self.scheduler.add_job(self.fetch_and_assign_actions, 'interval', minutes=1,
                               next_run_time=datetime.now() + timedelta(seconds=10))
        self.scheduler.add_job(self.print_bots_info, 'interval', minutes=2, next_run_time=datetime.now())
# Schedules a specific task (commenting or tweeting) for a bot to execute.
    def add_task(self, post_id, post_text, bot_indices, response_types, task_type, action_id):
        for bot_index in bot_indices:
            if bot_index >= len(bots):
                continue

            schedule_time = datetime.now() + timedelta(seconds=random.randint(10, 600))  # currently at most 10 minutes
            if task_type == 'comment':
                self.scheduler.add_job(comment_with_ai, args=(post_id, post_text, bot_index, action_id),
                                       next_run_time=schedule_time)
            elif task_type == 'tweet':
                self.scheduler.add_job(post_tweet, args=(bot_index, post_text, action_id), next_run_time=schedule_time)

            logger.info(f"Action {action_id}: Scheduled {task_type} task for bot {bot_index} on post {post_id}.")
# Retrieves pending actions from the server(that goes to DB) and assigns them to bots for execution.
    def fetch_and_assign_actions(self):
        if len(bots) < 1:
            return
        response = requests.get(f"{ACTIONS}?status=PENDING")
        if response.status_code == 200:
            actions = response.json().get('data', [])
            for action in actions:
                if action['status'] == "PENDING":
                    if action['id'] not in self.handling_actions:
                        self.handling_actions.add(action['id'])
                        post_response = requests.get(f"{BASE_URL}/posts/{action['postId']}")
                        if post_response.status_code == 200 and post_response.json().get('data'):
                            post_details = post_response.json().get('data')[0]
                            numeric_post_id = re.search(r'/status/(\d+)', post_details.get('link', '')).group(1)
                            post_text = post_details.get('content', '')
                            bot_index = next((index for (index, b) in enumerate(bots) if b['id'] == action['botId']), None)
                            if bot_index is not None:
                                if action['actionType'].upper() == "RETWEET":
                                    handle_retweet(numeric_post_id, post_text, post_details.get('link', ''), bot_index, action['id'])
                                elif action['actionType'].upper() == "REPLY":
                                    comment_with_ai(numeric_post_id, post_text, bot_index, action['id'])
                                elif action['actionType'].upper() == "TWEET":
                                    post_tweet(bot_index, post_text, action['id'])
                        else:
                            logger.info(f"Action {action['id']}: Failed to fetch post details or unsupported action type.")
        else:
            logger.error("Failed to fetch actions from server.")

    def print_bots_info(self):
        logger.info(f"Current active bots: {len(bots)}")

    def start(self):
        self.scheduler.start()
        logger.info("Bot manager started.")


if __name__ == "__main__":
    bot_manager = BotManager()
    bot_manager.start()
