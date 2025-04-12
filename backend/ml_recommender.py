import sys
import json
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8') 

def load_input():
    raw_input = sys.stdin.read()
    return json.loads(raw_input)

def vectorize_and_match(user_profile, wardrobe_items, trend_items):
    user_text = f"{user_profile['style']} {user_profile['colorPalette']} {user_profile['pattern']}".lower()

    for item in wardrobe_items + trend_items:
        if 'tags' not in item or not isinstance(item['tags'], list):
            item['tags'] = []

    wardrobe_texts = [' '.join(item['tags']).lower() for item in wardrobe_items]
    trend_texts = [' '.join(item['tags']).lower() for item in trend_items]

    if not wardrobe_items or not trend_items:
        return { "error": "Not enough wardrobe or trend items." }

    if all(len(item["tags"]) == 0 for item in wardrobe_items + trend_items):
        return { "error": "All tags are empty." }

    all_texts = [user_text] + wardrobe_texts + trend_texts
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(all_texts)

    user_vec = vectors[0]
    wardrobe_vecs = vectors[1:1+len(wardrobe_items)]
    trend_vecs = vectors[1+len(wardrobe_items):]

    wardrobe_scores = cosine_similarity(user_vec, wardrobe_vecs).flatten()
    trend_scores = cosine_similarity(user_vec, trend_vecs).flatten()

    for i in range(len(wardrobe_items)):
        wardrobe_items[i]["score"] = float(wardrobe_scores[i])

    for i in range(len(trend_items)):
        trend_items[i]["score"] = float(trend_scores[i])

    trend_tag_set = set(tag.lower() for trend in trend_items for tag in trend.get("tags", []))
    for item in wardrobe_items:
        match_count = sum(1 for tag in item['tags'] if tag.lower() in trend_tag_set)
        item['score'] += 0.05 * match_count

    def is_top(c): return c in ['top', 'tshirt', 'hoodie', 'jacket', 'sweater', 'crop-top', 'tank-top', 'dress']
    def is_bottom(c): return c in ['pants', 'jeans', 'shorts', 'skirt', 'trousers', 'leggings', 'sweatpants']
    def is_foot(c): return c in ['foot', 'shoes', 'sneakers', 'heels', 'boots']

    tops = [item for item in wardrobe_items if is_top(item.get("category", "").lower())]
    bottoms = [item for item in wardrobe_items if is_bottom(item.get("category", "").lower())]
    foots = [item for item in wardrobe_items if is_foot(item.get("category", "").lower())]

    # Pick randomly from top 3 highest scoring items
    def pick_random_top(items):
        sorted_items = sorted(items, key=lambda x: x["score"], reverse=True)[:3]
        return random.choice(sorted_items) if sorted_items else None

    top = pick_random_top(tops)
    bottom = pick_random_top(bottoms)
    foot = pick_random_top(foots)

    # print scores
    print("🧥 TOPS:", file=sys.stderr)
    for t in tops:
        print(f"  {t.get('category')} | {t.get('color')} | score: {t['score']}", file=sys.stderr)

    print("👖 BOTTOMS:", file=sys.stderr)
    for b in bottoms:
        print(f"  {b.get('category')} | {b.get('color')} | score: {b['score']}", file=sys.stderr)

    print("👟 SHOES:", file=sys.stderr)
    for f in foots:
        print(f"  {f.get('category')} | {f.get('color')} | score: {f['score']}", file=sys.stderr)

    top_wardrobe = [item for item in [top, bottom, foot] if item]
    top_trends = sorted(trend_items, key=lambda x: x["score"], reverse=True)[:3]

    return {
        "recommended_wardrobe": top_wardrobe,
        "recommended_trends": top_trends
    }

if __name__ == "__main__":
    try:
        data = load_input()
        user_profile = data["userStyle"]
        wardrobe = data["items"]
        trends = data["trends"]

        result = vectorize_and_match(user_profile, wardrobe, trends)
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({ "error": str(e) }, ensure_ascii=False))
