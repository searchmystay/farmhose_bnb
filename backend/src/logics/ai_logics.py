import os
import re
import logging
from datetime import datetime
import pytz
import requests
from bson import ObjectId
from tempfile import NamedTemporaryFile
from src.config import OPENAI_API_KEY, VECTOR_STORE_ID
from src.utils.exception_handler import handle_exceptions, AppException
from src.database.db_common_operations import db_find_one, db_find_many, db_update_one


@handle_exceptions
def get_openai_headers(extra_headers=None):
    if not OPENAI_API_KEY:
        raise Exception("OpenAI API key not configured", 500)
    
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "OpenAI-Beta": "assistants=v2"
    }
    if extra_headers:
        headers.update(extra_headers)
    return headers


logger = logging.getLogger(__name__)

@handle_exceptions
def add_file_to_vector_store(vector_store_id, file_id):
    url = "https://api.openai.com/v1/vector_stores/{}/files".format(vector_store_id)
    headers = get_openai_headers({"Content-Type": "application/json"})
    payload = {
        "file_id": file_id,
        "chunking_strategy": {
            "type": "static",
            "static": {
                "max_chunk_size_tokens": 4096,
                "chunk_overlap_tokens": 0
            }
        }
    }
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if response.status_code >= 400:
        logger.error("attach error %s: %s", response.status_code, response.text)
        raise AppException(f"attach error {response.status_code}: {response.text}")
    attach_resp = response.json()
    logger.info("File %s attached successfully with static chunking (single chunk)", file_id)
    return attach_resp


@handle_exceptions
def get_vector_store_id():
    result = ensure_valid_vector_store()
    return result


@handle_exceptions
def create_vector_store(file_ids):
    url = "https://api.openai.com/v1/vector_stores"
    headers = get_openai_headers({"Content-Type": "application/json"})
    payload = {}
    if file_ids:
        payload["file_ids"] = file_ids
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if response.status_code >= 400:
        raise AppException("Failed to create vector store")
    vector_store = response.json()
    return vector_store.get("id")


@handle_exceptions
def upload_file_in_openai(file_path):
    url = "https://api.openai.com/v1/files"
    headers = get_openai_headers()
    data = {"purpose": "assistants"}
    with open(file_path, "rb") as file_handle:
        files = {"file": (os.path.basename(file_path), file_handle)}
        response = requests.post(url, headers=headers, data=data, files=files, timeout=60)
    if response.status_code >= 400:
        raise AppException("Failed to upload file to OpenAI")
    file_data = response.json()
    return file_data.get("id")


@handle_exceptions
def ensure_vector_store_with_file(file_id):
    existing_vector_store_id = get_vector_store_id()
    add_file_to_vector_store(existing_vector_store_id, file_id)
    result = existing_vector_store_id
    return result


@handle_exceptions
def fetch_property_for_vector(property_id):
    query_filter = {"_id": ObjectId(property_id)}
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "type": 1,
        "location": 1,
        "amenities": 1,
        "status": 1,
        "per_day_price": 1,
        "images": 1,
        "review_average": 1
    }
    property_data = db_find_one("farmhouses", query_filter, projection)
    if not property_data:
        raise AppException("Property not found")
    
    property_status = property_data.get("status")
    if property_status != "active":
        raise AppException("Property is not active")
    
    return property_data

@handle_exceptions
def build_location_summary(location_data):
    parts = []
    for key in ["address", "area", "city", "state", "country", "pincode"]:
        value = location_data.get(key) if location_data else None
        if value:
            parts.append(str(value))
    if not parts:
        parts.append("Not specified")
    summary = ", ".join(parts)
    return summary

@handle_exceptions
def build_amenities_summary(amenities_data):
    names = []
    if amenities_data:
        for category in amenities_data.values():
            for amenity_name, available in category.items():
                if available:
                    names.append(amenity_name.replace("_", " "))
    if not names:
        names.append("No specific amenities")
    summary = ", ".join(sorted(names))
    return summary

@handle_exceptions
def build_property_vector_text(property_data):
    property_id = str(property_data.get("_id"))
    name = property_data.get("name", "")
    description = property_data.get("description", "")
    property_type = property_data.get("type", "")
    location_text = build_location_summary(property_data.get("location", {}))
    amenities_text = build_amenities_summary(property_data.get("amenities", {}))
    price = property_data.get("per_day_price", 0)
    text_parts = [
        f"Property ID: {property_id}",
        f"Name: {name}",
        f"Type: {property_type}",
        f"Location: {location_text}",
        f"Price: {price}",
        f"Description: {description}",
        f"Amenities: {amenities_text}"
    ]
    consolidated_text = "\n".join(text_parts)
    return consolidated_text


@handle_exceptions
def upload_text_to_openai(text_data):
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone).strftime("%Y%m%d_%H%M%S")
    with NamedTemporaryFile("w", delete=False, encoding="utf-8", prefix=f"property_{current_time}_", suffix=".txt") as temp_file:
        temp_file.write(text_data)
        temp_path = temp_file.name
    file_id = upload_file_in_openai(temp_path)
    os.remove(temp_path)
    return file_id


@handle_exceptions
def save_ai_file_metadata(property_id, file_id, vector_store_id):
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone).replace(tzinfo=None)
    existing_doc = db_find_one("farmhouses", {"_id": ObjectId(property_id)}, {"ai": 1})
    if not existing_doc:
        raise AppException("Property not found for AI metadata")
    existing_ai = existing_doc.get("ai", {}) or {}
    created_at = existing_ai.get("created_at", current_time)
    update_payload = {
        "file_id": file_id,
        "vector_store_id": vector_store_id,
        "updated_at": current_time,
        "created_at": created_at
    }
    db_update_one(
        "farmhouses",
        {"_id": ObjectId(property_id)},
        {"$set": {"ai": update_payload}}
    )
    result = True
    return result


@handle_exceptions
def add_property_to_vector_store(property_id):
    property_data = fetch_property_for_vector(property_id)
    consolidated_text = build_property_vector_text(property_data)
    file_id = upload_text_to_openai(consolidated_text)
    vector_store_id = ensure_vector_store_with_file(file_id)
    save_ai_file_metadata(property_id, file_id, vector_store_id)
    result = True
    return result


@handle_exceptions
def search_vector_store_for_files(query_string, top_k=20, rewrite_query=True):
    vector_store_id = get_vector_store_id()
    
    url = "https://api.openai.com/v1/vector_stores/{}/search".format(vector_store_id)
    headers = get_openai_headers({"Content-Type": "application/json"})
    payload = {
        "query": query_string,
        "max_num_results": top_k,
        "rewrite_query": rewrite_query
    }
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if response.status_code >= 400:
        raise AppException("Vector store search failed")
    search_data = response.json()
    matches = search_data.get("data", [])
    cleaned_matches = []
    for match in matches:
        file_id = match.get("file_id")
        if not file_id:
            continue
        score = match.get("score") or 0.0
        cleaned_matches.append({"file_id": file_id, "score": score})
    return cleaned_matches


@handle_exceptions
def map_files_to_property_ids(file_ids):
    if not file_ids:
        ordered_property_ids = []
        file_to_property = {}
        return ordered_property_ids, file_to_property
    records = db_find_many(
        "farmhouses",
        {"ai.file_id": {"$in": file_ids}},
        {"ai.file_id": 1}
    )
    mapping = {}
    for record in records:
        ai_data = record.get("ai") or {}
        file_id = ai_data.get("file_id")
        property_ref = record.get("_id")
        if file_id and property_ref:
            mapping[file_id] = str(property_ref)
    ordered_property_ids = []
    file_to_property = {}
    seen_properties = set()
    for file_id in file_ids:
        property_id = mapping.get(file_id)
        if not property_id:
            continue
        file_to_property[file_id] = property_id
        if property_id not in seen_properties:
            ordered_property_ids.append(property_id)
            seen_properties.add(property_id)
    return ordered_property_ids, file_to_property


@handle_exceptions
def format_search_property(property_data):
    property_id = str(property_data.get("_id"))
    name = property_data.get("name", "")
    description = property_data.get("description", "")
    property_type = property_data.get("type", "")
    price = property_data.get("per_day_price", 0)
    location_text = build_location_summary(property_data.get("location", {}))
    images = property_data.get("images") or []
    image_url = images[0] if images else ""
    rating = property_data.get("review_average", 0)
    result = {
        "_id": property_id,
        "title": name,
        "description": description,
        "type": property_type,
        "price": price,
        "location": location_text,
        "image": image_url,
        "rating": rating
    }
    return result


@handle_exceptions
def build_active_properties_filter(property_ids):
    object_ids = [ObjectId(pid) for pid in property_ids]
    filter_data = {"_id": {"$in": object_ids}, "status": "active"}
    return filter_data


@handle_exceptions
def build_active_properties_projection():
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "type": 1,
        "per_day_price": 1,
        "location": 1,
        "images": 1,
        "review_average": 1,
        "amenities": 1,
        "tags": 1
    }
    return projection


@handle_exceptions
def build_property_map(properties):
    property_map = {}
    for property_data in properties:
        property_id = str(property_data.get("_id"))
        property_map[property_id] = property_data
    return property_map


@handle_exceptions
def order_properties_by_ids(property_map, property_ids):
    ordered_list = []
    for property_id in property_ids:
        property_item = property_map.get(property_id)
        if property_item:
            ordered_list.append(property_item)
    return ordered_list


@handle_exceptions
def fetch_active_property_docs(property_ids):
    if not property_ids:
        result = []
        return result
    query_filter = build_active_properties_filter(property_ids)
    projection = build_active_properties_projection()
    properties = db_find_many("farmhouses", query_filter, projection)
    property_map = build_property_map(properties)
    ordered_properties = order_properties_by_ids(property_map, property_ids)
    return ordered_properties

@handle_exceptions
def tokenize_query(query_string):
    tokens = re.findall(r"\w+", query_string.lower())
    meaningful_tokens = [token for token in tokens if len(token) > 2]
    return meaningful_tokens


@handle_exceptions
def extract_property_text(property_data):
    parts = [
        property_data.get("name", ""),
        property_data.get("description", ""),
        property_data.get("type", ""),
        str(property_data.get("per_day_price", ""))
    ]
    location = property_data.get("location") or {}
    location_parts = [
        location.get("address", ""),
        location.get("area", ""),
        location.get("city", ""),
        location.get("state", "")
    ]
    parts.extend(location_parts)
    amenities = property_data.get("amenities") or {}
    for category in amenities.values():
        if isinstance(category, dict):
            for amenity_name, enabled in category.items():
                if enabled:
                    parts.append(amenity_name)
    tags = property_data.get("tags") or []
    if isinstance(tags, list):
        parts.extend(tags)
    aggregated_text = " ".join(filter(None, parts)).lower()
    return aggregated_text


@handle_exceptions
def compute_property_score(property_id, vector_score_map):
    score = vector_score_map.get(property_id)
    if score is None:
        return 0.0
    return score


@handle_exceptions
def search_properties(query_string):
    if not query_string:
        raise AppException("Search query is required")
    matches = search_vector_store_for_files(query_string)
    file_ids = [match["file_id"] for match in matches]
    property_ids, file_to_property = map_files_to_property_ids(file_ids)
    if not property_ids:
        return {"properties": []}

    vector_rank_map = {property_id: index for index, property_id in enumerate(property_ids)}
    vector_score_map = {}
    for match in matches:
        file_id = match.get("file_id")
        score = match.get("score") or 0.0
        property_id = file_to_property.get(file_id)
        if property_id:
            vector_score_map[property_id] = max(score, vector_score_map.get(property_id, 0.0))

    property_docs = fetch_active_property_docs(property_ids)
    if not property_docs:
        return {"properties": []}

    scored_results = []
    for property_data in property_docs:
        property_id = str(property_data.get("_id"))
        score = compute_property_score(property_id, vector_score_map)
        formatted = format_search_property(property_data)
        formatted["score"] = round(score, 4)
        scored_results.append((score, formatted))

    scored_results.sort(key=lambda item: item[0], reverse=True)
    top_properties = [item[1] for item in scored_results[:5]]

    result = {
        "properties": top_properties
    }
    return result


