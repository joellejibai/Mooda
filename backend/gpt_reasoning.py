import os
import sys
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file variables
load_dotenv()

# ✅ Setup OpenAI client (new SDK format)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_reason(profile, outfit_items):
    messages = [
        {
            "role": "system",
            "content": "You're a fashion stylist. Given a user's preferences and outfit, explain why this outfit suits them in 2-3 sentences. Be detailed and warm."
        },
        {
            "role": "user",
            "content": f"""
User prefers: style={profile['style']}, color palette={profile['colorPalette']}, patterns={profile['pattern']}
Outfit includes:
- Top: {outfit_items['top']}
- Bottom: {outfit_items['bottom']}
- Shoes: {outfit_items['foot']}
            """.strip()
        }
    ]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7
    )

    return response.choices[0].message.content.strip()

def load_input():
    return json.loads(sys.stdin.read())

if __name__ == "__main__":
    try:
        data = load_input()
        profile = data["userStyle"]
        outfit = data["outfit"]
        explanation = generate_reason(profile, outfit)
        print(json.dumps({ "reason": explanation }), flush=True)
    except Exception as e:
        print(json.dumps({ "error": str(e) }), flush=True)
