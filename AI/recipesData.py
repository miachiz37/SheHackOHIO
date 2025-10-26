from datasets import load_dataset
from AI.OpenSourceFood import OpenFoodFactsClient

# Load the full dataset
recipes = load_dataset("racineai/OGC_Cooking_Recipes")["train"]
english_recipes = recipes.filter(lambda x: x["language"] == "en")

# Format for retrieval
recipe_docs = [
    {
        "id": i,
        "query": r["query"],
        "answer": r["answer"]
    }
    for i, r in enumerate(english_recipes)
]
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")
texts = [r["query"] for r in recipe_docs]
embeddings = model.encode(texts)

index = faiss.IndexFlatL2(len(embeddings[0]))
index.add(np.array(embeddings))


# finds a set of recipes that match the given ingredients while respecting sensitivities
# orders the recipes based from most matching ingredients to least.
def retrieve_recipes(ingredient_list, sensitivities, max_results=15):
    matches = []
    client = OpenFoodFactsClient()

    for recipe in recipe_docs:
        text = (recipe["query"] + " " + recipe["answer"]).lower()
        match_count = sum(1 for ingredient in ingredient_list if ingredient.lower() in text)

        if match_count == 0:
            continue

        # Check for sensitivity conflicts
        conflict_found = False
        for ingredient in ingredient_list:
            products = client.search(ingredient)
            if not products:
                continue

            categories = client.extract_categories(products[0])
            food_type = client.classify_food_type(categories)

            if food_type in sensitivities:
                conflict_found = True
                break

        if not conflict_found:
            matches.append((match_count, recipe))

    # Sort by number of matching ingredients (descending)
    matches.sort(reverse=True, key=lambda x: x[0])

    # Return recipes ranked 4 through max_results
    return [r for _, r in matches[3:max_results]]

