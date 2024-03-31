import requests
import logging
from flask import Flask, request, jsonify
from generate_response import generate_response, check_relevance

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

no_response_count = 0
response_count = 0
failed_exports = 0


@app.route('/generate_response', methods=['POST'])
def handle_generate_response():
    global no_response_count, response_count, failed_exports
    try:
        tweet = request.json['tweet']
        response_types = request.json['response_types']
        logging.info(f'received tweet: {tweet}')
        comment = generate_response(tweet, response_types)
        if comment is None or comment == "No response generated.":
            no_response_count += 1
            comment = "No comment was generated."
            logging.info('No comment was generated.')
        else:
            response_count += 1
            logging.info(f'Generated comment: {comment}')
        return jsonify({'response': comment})
    except Exception as e:
        failed_exports += 1
        logging.error(f'error while generating response: {str(e)}')
        return jsonify({'error': 'Something went wrong: {}'.format(str(e))})


@app.route('/get_statistics', methods=['GET'])
def get_statistics():
    global no_response_count, response_count, failed_exports
    logging.info('returning statistics...')
    return jsonify({
        'no_response_count': no_response_count,
        'response_count': response_count,
        'failed_exports': failed_exports
    })


@app.route('/is_relevant', methods=['POST'])
def handle_is_relevant():
    try:
        post = request.json['post']
        logging.info(f'received post with content: {post}')
        relevance = check_relevance(post)
        logging.info(f'relevance: {relevance}')

        relevance = str(relevance).lower() == "true"

        return jsonify({'is_relevant': relevance})
    except Exception as e:
        logging.error(f'error while checking relevance: {str(e)}')
        return jsonify({'error': 'Something went wrong: {}'.format(str(e))})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
