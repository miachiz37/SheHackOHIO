from datasets import load_dataset
from OpenSourceFood import OpenFoodFactsClient
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os


dataset = load_dataset("racineai/OGC_Cooking_Recipes", "train")["train"]
dataset = dataset.select(range(200))




# Filter English recipes

english_recipes = dataset.filter(lambda x: x["language"] == "en")


# Format for retrieval
recipe_docs = [
    {"id": i, "query": r["query"], "answer": r["answer"]}
   
    for i, r in enumerate(english_recipes)
]


model = SentenceTransformer("all-MiniLM-L6-v2")
texts = [r["query"] for r in recipe_docs]
embedding_dim = 384  # dimension for MiniLM-L6-v2

# Cache filenames
EMBED_FILE = "recipe_embeddings.npy"
INDEX_FILE = "recipe_index.faiss"

if os.path.exists(EMBED_FILE) and os.path.exists(INDEX_FILE):

    embeddings = np.load(EMBED_FILE)
    index = faiss.read_index(INDEX_FILE)
else:
   
    embeddings = model.encode(texts, batch_size=32, show_progress_bar=True)
    np.save(EMBED_FILE, embeddings)

    index = faiss.IndexFlatL2(embedding_dim)
    index.add(np.array(embeddings))
    faiss.write_index(index, INDEX_FILE)
   

from sentence_transformers import util
import torch

def retrieve_recipes(ingredient_list, sensitivities, max_results=15):
    matches = []
    client = OpenFoodFactsClient()

    # Encode all ingredients once
    ingredient_embeddings = model.encode(ingredient_list, convert_to_tensor=True)

    for recipe in recipe_docs:
        text = (recipe["query"] + " " + recipe["answer"]).lower()

        # Compute similarity between this recipe and the input ingredients
        recipe_embedding = model.encode(text, convert_to_tensor=True)
        similarities = util.cos_sim(ingredient_embeddings, recipe_embedding)
        avg_sim = float(torch.mean(similarities))  # average similarity score

        # Only consider recipes that meet the similarity threshold
        if avg_sim > 0.2:
         
            conflict_found = False

            for sensitivity in sensitivities:
                # Check if any sensitive word or category appears in recipe text
                if sensitivity.lower() in text:
                    conflict_found = True
                    break

                products = client.search(sensitivity)
                if products:
                    categories = client.extract_categories(products[0])
                    food_type = client.classify_food_type(categories)
                    if food_type and food_type.lower() in text:
                        conflict_found = True
                        break

           
            if not conflict_found:
                matches.append((avg_sim, recipe))

    # Sort by similarity (highest first)
    matches.sort(reverse=True, key=lambda x: x[0])

    # Return top matches
    return [r for _, r in matches[:max_results]]





