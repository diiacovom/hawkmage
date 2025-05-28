import os
import json
import uuid
import boto3
import openai


table_name = os.environ.get("TABLE_NAME")
openai_api_key = os.environ.get("OPENAI_API_KEY")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)

openai.api_key = openai_api_key


def handler(event, context):
    """Lambda handler to process form data, store results, and query OpenAI."""
    body = event.get("body")
    if isinstance(body, str):
        data = json.loads(body)
    elif body is None:
        data = event
    else:
        data = body

    prompt = generate_prompt(data)

    try:
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=500,
        )
        response_text = completion.choices[0].text.strip()

        item_id = str(uuid.uuid4())
        table.put_item(Item={"id": item_id, "form": data, "response": response_text})

        return {
            "statusCode": 200,
            "body": json.dumps({"id": item_id, "response": response_text}),
        }
    except Exception as exc:
        return {"statusCode": 500, "body": json.dumps({"error": str(exc)})}


def generate_prompt(data):
    entries = "\n".join(f"{k}: {v}" for k, v in data.items())
    return f"Given the following inputs, generate a StackHawk YAML config file:\n{entries}"
