import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def load_input():
    raw_input = sys.stdin.read()
    return json.loads(raw_input)

def vectorize(user_style, items):
    user_text = f"{user_style['style']} {user_style['colorPalette']} {user_style['pattern']}".lower()
    
    item_texts = [' '.join(item['tags']).lower() for item in items]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_text] + item_texts)

    user_vector = vectors[0]
    item_vectors = vectors[1:]

    scores = cosine_similarity(user_vector, item_vectors).flatten()
    return scores

if __name__ == "__main__":
    try:
        data = load_input()
        user_style = data["userStyle"]
        items = data["items"]

        scores = vectorize(user_style, items)

        # Attach score to items
        for i in range(len(items)):
            items[i]["score"] = float(scores[i])  # make sure it’s serializable

        # Sort and return top 3
        top_items = sorted(items, key=lambda x: x["score"], reverse=True)[:3]
        print(json.dumps(top_items))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
