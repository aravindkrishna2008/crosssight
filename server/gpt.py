"""This model supports using images as inputs. To run a chat completion using
a local image file, use the following sample."""

import os
import base64
# import urllib.request
from openai import OpenAI

# import cv2
# import urllib
# import numpy as np

# load dotenv
from dotenv import load_dotenv
load_dotenv()


token = os.environ["OPENAI_API_KEY"]
endpoint = "https://models.inference.ai.azure.com"

# Pick one of the Azure OpenAI models from the GitHub Models service
model_name = "gpt-4o-mini"

# Create a client
client = OpenAI(
    base_url=endpoint,
    api_key=token,
)


def get_image_data_url(image_file: str, image_format: str) -> str:
    """
    Helper function to converts an image file to a data URL string.
    Args:
        image_file (str): The path to the image file.
        image_format (str): The format of the image file.
    Returns:
        str: The data URL of the image.
    """
    try:
        with open(image_file, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
    except FileNotFoundError:
        print(f"Could not read '{image_file}'.")
        exit()
    return f"data:image/{image_format};base64,{image_data}"

# req = urllib.request.urlopen("http://")

# Call the chat completion API
def chat_completion(message: str) -> str:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": message,
            }
        ],
        model=model_name,
    )
    return response.choices[0].message.content


def home_obj_det():
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an object detection model. You will identify all objects in the image and print them sequentially, separated by commas and a space. The objects you are capable of detecting are: puppy, bowl, can, jar, bread, fridge, oven",
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What objects are present in this image?",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            # using a file located in this directory
                            "url": get_image_data_url(
                                os.path.join(os.path.dirname(__file__), "food.jpg"), "jpg"
                            )
                        },
                    },
                ],
            },
        ],
        model=model_name,
    )

    print(response.choices[0].message.content)



if __name__ == "__main__":
    # home_obj_det()
    print(chat_completion("Hello, how are you today?"))
    # chat_completion("Hello, how are you today?")
    # chat_completion("What is the weather like today?")
    # chat_completion("What is the meaning of life