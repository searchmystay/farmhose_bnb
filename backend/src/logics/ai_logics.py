import os
from datetime import datetime
import pytz
from openai import OpenAI
from ..utils.exception_handler import handle_exceptions, AppException
from ..utils.logger import logger
from ..database.db_common_operations import db_find_one, db_update_one, db_insert_one
from src.utils.exception_handler import AppException

@handle_exceptions
def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise Exception("OpenAI API key not configured", 500)
    
    client = OpenAI(api_key=api_key)
    return client


@handle_exceptions
def add_file_to_vector_store(vector_store_id, file_id):
    client = get_openai_client()
    response = client.vector_stores.files.create(
        vector_store_id=vector_store_id,
        file_id=file_id,
    )
    return response


@handle_exceptions
def get_vector_store_id():
    admin_analysis = db_find_one("admin_analysis", {"_id": "admin_analysis_singleton"}, {"vector_store_id": 1})
    
    if admin_analysis and admin_analysis.get("vector_store_id"):
        return admin_analysis["vector_store_id"]
    
    return None


@handle_exceptions
def create_vector_store(file_ids):
    client = get_openai_client()
    vector_store = client.beta.vector_stores.create(file_ids=file_ids)
    return vector_store.id


@handle_exceptions
def create_global_vector_store(first_file_id):
    vector_store_id = create_vector_store(file_ids=[first_file_id])
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone).replace(tzinfo=None)
    
    db_update_one(
        "admin_analysis", 
        {"_id": "admin_analysis_singleton"},
        {"$set": {"vector_store_id": vector_store_id, "updated_at": current_time}}
    )
    
    return vector_store_id


@handle_exceptions
def upload_file_in_openai(file_path):
    client = get_openai_client()
    with open(file_path, "rb") as file:
        response = client.files.create(file=file, purpose="assistants")
    
    file_id = response.id
    return file_id


@handle_exceptions
def search_vector_store(query_string, top_k=5, rewrite_query=True):
    vector_store_id = get_vector_store_id()
    
    if not vector_store_id:
        raise Exception("vector store id not found")
    
    client = get_openai_client()
    response = client.vector_stores.search(
        vector_store_id=vector_store_id,
        query=query_string,
        max_num_results=top_k,
        rewrite_query=rewrite_query,
    )

    text_chunks = ""
    for match in response.data:
        content = getattr(match, 'content', None)
        if content:
            for chunk in content:
                chunk_type = getattr(chunk, 'type', None)
                chunk_text = getattr(chunk, 'text', None)
                if chunk_type == "text":
                    text_chunks += f"\n\n{chunk_text}"

    return text_chunks


@handle_exceptions
def train_data(text_data):
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone)
    timestamp = current_time.strftime("%Y%m%d_%H%M%S")
    temp_file_path = f"temp_training_{timestamp}.txt"

    with open(temp_file_path, "w", encoding="utf-8") as f:
        f.write(text_data)
    
    file_id = upload_file_in_openai(temp_file_path)
    os.remove(temp_file_path)

    existing_vector_store_id = get_vector_store_id()
    
    if existing_vector_store_id:
        add_file_to_vector_store(existing_vector_store_id, file_id)
    else:
        create_global_vector_store(file_id)
    
    return True



def build_property_type_text(property_type):
    property_text = f"User is looking for {property_type} properties"
    return property_text


def build_location_text(location):
    if location:
        location_text = f"in {location}"
    else:
        location_text = "in any location"
    return location_text


def build_date_text(check_in_date, check_out_date):
    if check_in_date and check_out_date:
        date_text = f"Check-in: {check_in_date}, Check-out: {check_out_date}"
        return date_text
    return ""


def build_guest_info_list(number_of_adults, number_of_children, number_of_pets):
    guest_info = []
    if number_of_adults > 0:
        guest_info.append(f"{number_of_adults} adults")
    if number_of_children > 0:
        guest_info.append(f"{number_of_children} children")
    if number_of_pets > 0:
        guest_info.append(f"{number_of_pets} pets")
    return guest_info


def build_guest_text(guest_info):
    if guest_info:
        guest_text = f"Guests: {', '.join(guest_info)}"
        return guest_text
    return ""


def create_ai_prompt(location, check_in_date, check_out_date, number_of_adults, number_of_children, number_of_pets, property_type):
    prompt_parts = []
    
    property_text = build_property_type_text(property_type)
    prompt_parts.append(property_text)
    
    location_text = build_location_text(location)
    prompt_parts.append(location_text)
    
    date_text = build_date_text(check_in_date, check_out_date)
    if date_text:
        prompt_parts.append(date_text)
    
    guest_info = build_guest_info_list(number_of_adults, number_of_children, number_of_pets)
    guest_text = build_guest_text(guest_info)
    if guest_text:
        prompt_parts.append(guest_text)
    
    prompt_parts.append("Please suggest the best properties based on these criteria.")
    
    final_prompt = ". ".join(prompt_parts)
    return final_prompt


def create_farmhouse_property(property_id, title, image_url, price, rating, description):
    property_data = {
        "_id": property_id,
        "title": title,
        "image": image_url,
        "price": price,
        "rating": rating,
        "description": description
    }
    return property_data


def build_farmhouse_list():
    farmhouse_list = []
    
    property_1 = create_farmhouse_property(
        "ai_suggestion_1", 
        "Serene Valley Farmhouse",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        3500, 4.8, "Perfect peaceful retreat surrounded by lush greenery"
    )
    farmhouse_list.append(property_1)
    
    property_2 = create_farmhouse_property(
        "ai_suggestion_2",
        "Sunset Hills Farmhouse", 
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
        4200, 4.9, "Luxury farmhouse with stunning sunset views"
    )
    farmhouse_list.append(property_2)
    
    return farmhouse_list


def build_additional_farmhouses():
    additional_list = []
    
    property_3 = create_farmhouse_property(
        "ai_suggestion_3",
        "Riverside Farm Paradise",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        2800, 4.6, "Charming farmhouse by the riverside with modern amenities"
    )
    additional_list.append(property_3)
    
    property_4 = create_farmhouse_property(
        "ai_suggestion_4",
        "Mountain View Retreat",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        3800, 4.7, "Stunning mountain views with luxury amenities"
    )
    additional_list.append(property_4)
    
    property_5 = create_farmhouse_property(
        "ai_suggestion_5",
        "Garden Oasis Farmhouse",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
        3200, 4.5, "Beautiful garden setting with peaceful ambiance"
    )
    additional_list.append(property_5)
    
    return additional_list


def get_farmhouse_suggestions():
    base_farmhouses = build_farmhouse_list()
    additional_farmhouses = build_additional_farmhouses()
    
    all_farmhouses = base_farmhouses + additional_farmhouses
    return all_farmhouses


def build_bnb_list():
    bnb_list = []
    
    property_1 = create_farmhouse_property(
        "ai_suggestion_1",
        "Cozy Heritage BnB",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        2200, 4.7, "Charming bed & breakfast in historic building"
    )
    bnb_list.append(property_1)
    
    property_2 = create_farmhouse_property(
        "ai_suggestion_2",
        "Garden View BnB",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
        1800, 4.6, "Peaceful BnB with beautiful garden views"
    )
    bnb_list.append(property_2)
    
    return bnb_list


def build_additional_bnbs():
    additional_list = []
    
    property_3 = create_farmhouse_property(
        "ai_suggestion_3",
        "Royal Palace BnB",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
        3200, 4.9, "Luxurious bed & breakfast with royal ambiance"
    )
    additional_list.append(property_3)
    
    property_4 = create_farmhouse_property(
        "ai_suggestion_4",
        "Boutique City BnB",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
        2600, 4.8, "Modern boutique BnB in city center"
    )
    additional_list.append(property_4)
    
    property_5 = create_farmhouse_property(
        "ai_suggestion_5",
        "Countryside Manor BnB",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop",
        2900, 4.4, "Elegant manor house with countryside charm"
    )
    additional_list.append(property_5)
    
    return additional_list


def get_bnb_suggestions():
    base_bnbs = build_bnb_list()
    additional_bnbs = build_additional_bnbs()
    
    all_bnbs = base_bnbs + additional_bnbs
    return all_bnbs


def build_mixed_property_list():
    mixed_list = []
    
    farmhouse_property = create_farmhouse_property(
        "ai_suggestion_1",
        "Serene Valley Farmhouse",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        3500, 4.8, "Perfect peaceful retreat surrounded by lush greenery"
    )
    mixed_list.append(farmhouse_property)
    
    bnb_property = create_farmhouse_property(
        "ai_suggestion_2",
        "Cozy Heritage BnB",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        2200, 4.7, "Charming bed & breakfast in historic building"
    )
    mixed_list.append(bnb_property)
    
    return mixed_list


def build_additional_mixed_properties():
    additional_list = []
    
    property_3 = create_farmhouse_property(
        "ai_suggestion_3",
        "Riverside Paradise",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        2800, 4.6, "Charming property by the riverside with modern amenities"
    )
    additional_list.append(property_3)
    
    property_4 = create_farmhouse_property(
        "ai_suggestion_4",
        "Mountain View Retreat",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        3800, 4.7, "Stunning mountain views with luxury amenities"
    )
    additional_list.append(property_4)
    
    property_5 = create_farmhouse_property(
        "ai_suggestion_5",
        "Garden View BnB",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
        1800, 4.6, "Peaceful BnB with beautiful garden views"
    )
    additional_list.append(property_5)
    
    return additional_list


def get_mixed_suggestions():
    base_mixed = build_mixed_property_list()
    additional_mixed = build_additional_mixed_properties()
    
    all_mixed = base_mixed + additional_mixed
    return all_mixed


def get_ai_suggestions_by_type(property_type):
    if property_type == 'farmhouse':
        suggestions = get_farmhouse_suggestions()
        return suggestions
    elif property_type == 'bnb':
        suggestions = get_bnb_suggestions()
        return suggestions
    else:
        suggestions = get_mixed_suggestions()
        return suggestions


def build_response_data(suggestions, prompt):
    result = {
        "suggestions": suggestions,
        "prompt": prompt,
        "message": "AI suggestions generated successfully"
    }
    return result


def extract_details_from_query(user_query):
    extraction_prompt = f"""
    Extract the following details from this user query: "{user_query}"
    
    Return JSON format:
    {{
        "location": "extracted location or empty",
        "guests": "total number of guests or 0", 
        "dates": "check-in and check-out dates or empty",
        "property_type": "farmhouse, bnb, or both",
        "budget": "price range or empty",
        "amenities": "specific requirements"
    }}
    """
    return extraction_prompt

def process_ai_suggestion_request(user_query, property_type):
    if user_query:
        prompt = f"User request: {user_query}"
        
        extraction_prompt = extract_details_from_query(user_query)
        suggestions = get_ai_suggestions_by_type(property_type)
    else:
        prompt = "No specific request provided"
        suggestions = get_ai_suggestions_by_type(property_type)
    
    result = build_response_data(suggestions, prompt)
    return result
