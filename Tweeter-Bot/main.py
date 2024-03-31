from flask import Flask, request, jsonify
import logging
from bot_manager import BotManager
from twitter_bot import bots, delete_tweet_bot, update_bots

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bot_manager = BotManager()
bot_manager.start()

# @app.route('/add_task', methods=['POST'])
# def add_task():
#     data = request.json
#     required_fields = ['post_id', 'bot_indices']
#     if not all(field in data for field in required_fields):
#         return jsonify({"status": "error", "message": "Missing required fields."}), 400
#     try:
#         bot_manager.add_task(**data)
#         logger.info(f"Task added: {data}")
#         return jsonify({"status": "success", "message": "Task added successfully!"}), 200
#     except Exception as e:
#         logger.error(f"Failed to add task: {e}")
#         return jsonify({"status": "error", "message": "Failed to add task."}), 500
#
# @app.route('/delete-tweet', methods=['POST'])
# def delete_tweet():
#     data = request.json
#     if 'bot_index' not in data or 'tweet_id' not in data:
#         return jsonify({"status": "error", "message": "Missing required fields."}), 400
#     try:
#         success = delete_tweet_bot(data['bot_index'], data['tweet_id'])
#         if success:
#             logger.info(f"Tweet deleted: {data['tweet_id']}")
#             return jsonify({"status": "success", "message": "Tweet deleted successfully!"}), 200
#         else:
#             return jsonify({"status": "error", "message": "Failed to delete tweet."}), 500
#     except Exception as e:
#         logger.error(f"Failed to delete tweet: {e}")
#         return jsonify({"status": "error", "message": "Failed to delete tweet."}), 500

@app.route('/get-bots', methods=['GET'])
def get_bots_info():
    try:
        bots_info = [{"index": i, "username": bot["username"]} for i, bot in enumerate(bots)]
        return jsonify(bots_info), 200
    except Exception as e:
        logger.error(f"Failed to get bots info: {e}")
        return jsonify({"status": "error", "message": "Failed to get bots info."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
