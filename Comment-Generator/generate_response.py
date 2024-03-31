import logging

import google.generativeai as genai
from config import GOOGLE_API_KEY

# Generates a response for a tweet using the GEMINI AI.  considers the context of Israel's recent history and the response types to create a relevant comment.
def generate_response(tweet, response_types):
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

    prompt = f""" "Imagine you’re a casual Twitter user who loves and defends Israel passionately. You’re responding 
    to a tweet with the knowledge of a significant event in Israel’s recent history, October 7, 2023. On this day, 
    several organizations launched coordinated incursions into Israeli territory. This marked a major event since the 
    1948 Arab–Israeli War. The attack resulted in a significant loss of life and more than 240 people were taken 
    hostage. 

    In the aftermath of the attacks, Israel has been working on recovery and justice. The Israeli Defense Forces have 
    been preparing to implement a wide range of offensive plans. The government is also working on diplomatic fronts. 

    Despite these challenges, Israel remains resilient. The country is united in its determination to overcome these 
    adversities and ensure the safety and security of its citizens. 

    Your response should reflect a pro-Israel perspective and should not endorse or support any anti-Israel 
    sentiments. Avoid agreeing with the premise of the tweet if it portrays Israel negatively or pro-Palestine. Your 
    response should focus on Israel’s commitment to peace and security, and the complexities of the conflict. 

    Respond to the following post as a tweeter user and generate a comment Your response should be concise and to the point., tweet: ‘{tweet}’ . this is the end of the 
    tweet #TwitterComment. Note: The output should start immediately with the comment, without any preceding titles or formatting. This is crucial for maintaining the intended flow and readability of the response.
    Important! your response most be according to the next instructions:  Please provide the comment in the same language as the provided tweet above no longer to 20 words. 
    
     """

    instructions = generate_instructions_for_response_type(response_types)
    prompt += instructions
    try:
        response = model.generate_content(prompt)
        return response.text
    except ValueError:
        return "No response generated."

# Checks if a given post is relevant to the conflict between Israel and Palestine, using Gemini to determine relevance.
def check_relevance(post):
    genai.configure(api_key=GOOGLE_API_KEY)

    model = genai.GenerativeModel('gemini-pro')

    prompt = f""" "Given the following post, please determine if it is relevant to the conflict between Israel and 
    Palestine. Respond only with 'True' if it is relevant, or 'False' if it is not: ‘{post}’ #RelevanceCheck" 
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except ValueError:
        return False

# Generates specific instructions for AI to create social media comments based on different response types, ensuring the tone and style match the intention.
def generate_instructions_for_response_type(response_types):
    genai.configure(api_key=GOOGLE_API_KEY)
    instruction_model = genai.GenerativeModel('gemini-pro')

    instruction_prompt = "Create clear and concise instructions for generating social media comments. " \
                         "Each response type listed below requires specific guidance to ensure the comments match the intended tone and style:"

    for i, rt in enumerate(response_types, start=1):
        instruction_prompt += f"\n{i}. {rt} - provide instructions for a comment that embodies this response type."

    instruction_prompt += "\n\nFormat the output as a numbered list of instructions. " \
                          "Focus each instruction on how to craft the comment to align with its response type's tone and objectives."

    try:
        instruction_response = instruction_model.generate_content(instruction_prompt)
        instruction_response_text = instruction_response.text.strip()
        logging.info(f'response_types: {response_types}')
        logging.info(f'Generated instructions from response_types: {instruction_response_text}')
        return instruction_response_text
    except ValueError as e:
        logging.error(f'Failed to generate instructions: {str(e)}')
        return "Failed to generate instructions."
