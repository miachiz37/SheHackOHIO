from recipeData import retrieve_recipes 
def ask_ollama(prompt, model="mistral"):
    import subprocess
    result = subprocess.run(["ollama", "run", model, prompt], capture_output=True, text=True)
    return result.stdout

# AI orders the recipes generated from retrieve recipes and orders them based on user preferences
# and past recipe history
def build_ranking_prompt(ingredient_list, sensitivities, user_preferences, max_results=15):
    # Get recipes that match ingredients and avoid sensitivities
    recipes = retrieve_recipes(ingredient_list, sensitivities, max_results)

    preferences_text = ", ".join(user_preferences)

    prompt = f"""The user has the following food preferences: {preferences_text}

Below are {len(recipes)} recipe options. Please rank them from best to worst based on how well they
match the user's preferences and how similar they are to past recipes they have made.

Format your response as a numbered list from 1 (best match) to {len(recipes)} (least match).
"""

    for i, r in enumerate(recipes, start=1):
        prompt += f"{i}. {r['query']} ({r['answer']})\n"

    return prompt

# uses the prompt from build_ranking_prompt to make actuallt ask Ollama
def ask_ollama_for_recipes(recipes, user_preferences, model="mistral"):

    prompt = build_ranking_prompt(recipes, user_preferences)
    response = ask_ollama(prompt, model=model)
    return response
