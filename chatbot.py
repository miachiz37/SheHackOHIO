from OpenSourceFood import OpenFoodFactsClient
from recipesData import retrieve_recipes
from OllamaManager import ask_ollama

chat_history = []

def handle_user_message(message):
    client = OpenFoodFactsClient()

    # Try to enrich the user's question with relevant recipe examples
    retrieved_recipes = retrieve_recipes([message], sensitivities=[], max_results=5)


    # Try to enrich with nutrition info if the message mentions a food
    products = client.search(message)
    nutrition_info = ""
    if products:
        summary = client.summarize_product(products[0])
        nutrition_info = f"\nNutrition info for {summary['name']}:\n{summary['nutrients']}"

    # Build a context-rich prompt for Ollama
    prompt = f"User asked: {message}\n\n"

    if retrieved_recipes:
        prompt += "Here are some relevant recipes:\n"
        for r in retrieved_recipes:
            prompt += f"- {r['query']}: {r['answer']}\n"

    if nutrition_info:
        prompt += nutrition_info

    prompt += "\nAnswer the user's question clearly and helpfully."

    # Ask Ollama
    response = ask_ollama(prompt)
    chat_history.append({"user": message, "bot": response})
    return response
