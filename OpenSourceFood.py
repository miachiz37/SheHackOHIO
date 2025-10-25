import requests

class OpenFoodFactsClient:

    def __init__(self, user_agent="LeftoverChef/1.0"):
        self.headers = {"User-Agent": user_agent}

    #  Search Open Food Facts for a given food name
    def search(self, query, page=1, page_size=10):
        url = "https://world.openfoodfacts.org/cgi/search.pl"
        params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page": page,
        "page_size": page_size
    }
        response = requests.get(url, params=params, headers=self.headers)
        if response.status_code == 200:
            return response.json().get("products", [])
        else:
            raise Exception(f"API error: {response.status_code}")

    #  Extract category tags from a product
    def extract_categories(self, product):
       
        return product.get("categories_tags", [])

    #Extract basic nutrient info from a product.
    def extract_nutrients(self, product):
       
        return product.get("nutriments", {})

    # get product name
    def extract_product_name(self, product):
       
        return product.get("product_name", "Unknown")


    # Classify food type based on catagories this is also based on sensitivities
    def classify_food_type(self, categories):
       
        if any("fruit" in tag for tag in categories):
            return "fruit"
        elif any("vegetable" in tag for tag in categories):
            return "vegetable"
        elif any("pork" in tag for tag in categories):
            return "pork"
        elif any("dairy" in tag or "cheese" in tag for tag in categories):
            return "dairy"
        elif any("nuts" in tag for tag in categories):
            return "nuts"
        else:
            return "other"
