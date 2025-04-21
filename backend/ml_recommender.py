import sys, json, random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

def load_input():
    raw = sys.stdin.read()
    return json.loads(raw)

def vectorize_and_match(user_profile, wardrobe_items, trend_items):
    # Build user text
    user_text = f"{user_profile['style']} {user_profile['colorPalette']} {user_profile['pattern']}".lower()

    # Ensure tags list exists
    for itm in wardrobe_items + trend_items:
        if not isinstance(itm.get('tags', []), list):
            itm['tags'] = []

    # Prepare TF-IDF corpora
    wardrobe_texts = [" ".join(itm['tags']).lower() for itm in wardrobe_items]
    trend_texts    = [" ".join(itm['tags']).lower() for itm in trend_items]

    if not wardrobe_items or not trend_items:
        return { "error": "Not enough items or trends." }
    if all(len(itm['tags']) == 0 for itm in wardrobe_items + trend_items):
        return { "error": "All tags are empty." }

    all_texts = [user_text] + wardrobe_texts + trend_texts
    vec = TfidfVectorizer()
    mats = vec.fit_transform(all_texts)

    user_vec     = mats[0]
    ward_vecs    = mats[1:1+len(wardrobe_items)]
    trend_vecs   = mats[1+len(wardrobe_items):]

    w_scores = cosine_similarity(user_vec, ward_vecs).flatten()
    t_scores = cosine_similarity(user_vec, trend_vecs).flatten()

    for i, itm in enumerate(wardrobe_items):
        itm["score"] = float(w_scores[i])
    for i, itm in enumerate(trend_items):
        itm["score"] = float(t_scores[i])

    # Boost for matching trend tags
    trend_tag_set = {tag.lower() for tr in trend_items for tag in tr.get("tags", [])}
    for itm in wardrobe_items:
        overlap = sum(1 for tag in itm['tags'] if tag.lower() in trend_tag_set)
        itm["score"] += 0.05 * overlap

    # Categorize
    is_top    = lambda c: c in ['top','tshirt','hoodie','jacket','sweater','crop-top','tank-top','dress']
    is_bot    = lambda c: c in ['pants','jeans','shorts','skirt','trousers','leggings','sweatpants']
    is_foot   = lambda c: c in ['foot','shoes','sneakers','heels','boots']

    tops    = [i for i in wardrobe_items if is_top(i.get("category","").lower())]
    bottoms = [i for i in wardrobe_items if is_bot(i.get("category","").lower())]
    foots   = [i for i in wardrobe_items if is_foot(i.get("category","").lower())]

    pick = lambda arr: random.choice(sorted(arr, key=lambda x: x["score"], reverse=True)[:3]) if arr else None
    top    = pick(tops)
    bottom = pick(bottoms)
    foot   = pick(foots)

    if not (top and bottom and foot):
        return { "error": "Could not pick full outfit; try adding more variety." }

    # Debug logs
    print("🧥 TOPS:", file=sys.stderr)
    for t in tops: print(f"  {t['category']} | {t['score']}", file=sys.stderr)
    print("👖 BOTTOMS:", file=sys.stderr)
    for b in bottoms: print(f"  {b['category']} | {b['score']}", file=sys.stderr)
    print("👟 SHOES:", file=sys.stderr)
    for f in foots: print(f"  {f['category']} | {f['score']}", file=sys.stderr)

    # Attach reasoning
    def item_with_reason(item):
        if not item:
            return None
        return {
            "_id": item.get("_id"),
            "category": item.get("category"),
            "image": item.get("image"),
            "color": item.get("color"),
            "score": item.get("score"),
            "tags": item.get("tags"),
            "reason": f"Matched with your preference for {user_profile['style']}, {user_profile['colorPalette']}, {user_profile['pattern']} and trend overlap ({item.get('score'):.2f})"
        }

    return {
        "recommended_wardrobe": list(filter(None, [
            item_with_reason(top),
            item_with_reason(bottom),
            item_with_reason(foot)
        ])),
        "recommended_trends": sorted(trend_items, key=lambda x: x["score"], reverse=True)[:3]
    }

if __name__ == "__main__":
    try:
        inp = load_input()
        res = vectorize_and_match(inp["userStyle"], inp["items"], inp["trends"])
        print(json.dumps(res, ensure_ascii=False), flush=True)
    except Exception as e:
        print(json.dumps({ "error": str(e) }, ensure_ascii=False), flush=True)
