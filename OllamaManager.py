from recipesData import retrieve_recipes
from sentence_transformers import SentenceTransformer
import subprocess


# 🧠 Call Ollama locally
def ask_ollama(prompt, model="mistral"):
    import subprocess
    try:
        result = subprocess.run(
            ["ollama", "run", model, prompt],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=180
        )
        return result.stdout.strip() or "⚠️ Ollama produced no output."
    except subprocess.TimeoutExpired:
        return "⚠️ Ollama timed out."
    except Exception as e:
        return f"❌ Ollama error: {e}"



# 💬 Build an AI prompt based on recipes & preferences
def build_ranking_prompt(ingredient_list, sensitivities, user_preferences, max_results=15):
    recipes = retrieve_recipes(ingredient_list, sensitivities, max_results)

    if not recipes:
        return "No recipes found for the given ingredients."

    preferences_text = ", ".join(user_preferences)

    prompt = f"""The user has the following food preferences: {preferences_text}

Below are {len(recipes)} recipe options. Please rank the recipes from best to worst based on how well they
match the user's preferences and how similar they are to past recipes they have made.

Format your response as a numbered list from 1 (best match) to {len(recipes)} (least match).
Format:
1. Best recipe name and best recipe instructions
2. Second best recipe name and second best recipe instructions
...
"""

    for i, r in enumerate(recipes, start=1):
        # handle both versions of recipe_docs (with or without 'query')
        text_part = r.get("query") or ""
        recipe_part = r.get("answer") or r.get("text") or ""
        prompt += f"{i}. {text_part.strip()} ({recipe_part.strip()})\n"

    return prompt


# 🔄 Ask Ollama to rank recipes based on preferences
def ask_ollama_for_recipes(ingredient_list, sensitivities, user_preferences, model="mistral"):
    prompt = build_ranking_prompt(ingredient_list, sensitivities, user_preferences)
    response = ask_ollama(prompt, model=model)
    return response



