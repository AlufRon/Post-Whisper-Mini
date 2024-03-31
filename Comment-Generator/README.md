# Comment-Generator


# AI comment genarator service

This service uses Google Generative AI to generate responses to tweets and check their relevance to the Israel-Palestine conflict.

## Prerquisites

- Docker installed on your machine.
- Python 3.9 or higher.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


## API Endpoints

- **Generate Response**
    - Endpoint: `/generate_response`
    - Method: `POST`
    - JSON Body: `{ "tweet": "put tweet here" }`
    - Description: generates a response based on the tweet provided in the request.

- **Check Relevance**
    - Endpoint: `/check_relevance`
    - Method: `POST`
    - JSON Body: `{ "post": "put post here" }`
    - Description: checks if the post provided in the request is relevant to the conflict between Israel and Palestine.(used only for warnings, maybe later update on DB and client)
