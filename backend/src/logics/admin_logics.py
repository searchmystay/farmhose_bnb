from src.logics.admin_auth import authenticate_admin
from src.utils.exception_handler import handle_exceptions, AppException
from src.database.db_common_operations import db_find_many, db_find_one, db_update_one, db_delete_one
from src.logics.website_logic import process_property_for_detail, extract_all_amenities, build_complete_address
from src.logics.cloudfare_bucket import delete_farmhouse_folder_from_r2
from bson import ObjectId


@handle_exceptions
def process_admin_login(login_data):
    password = login_data.get("password")
    
    if not password:
        raise AppException("Password is required")
    
    auth_result = authenticate_admin(password)
    
    login_response = {
        "message": "Login successful",
        "token": auth_result.get("token"),
        "expires_in": auth_result.get("expires_in"),
        "superadmin": auth_result.get("superadmin")
    }
    
    return login_response


@handle_exceptions
def get_pending_properties():
    query_filter = {"status": "pending_approval"}
    projection = {
        "_id": 1,
        "name": 1,
        "type": 1,
        "phone_number": 1
    }
    
    pending_properties = db_find_many("farmhouses", query_filter, projection)
    
    processed_properties = []
    for property_data in pending_properties:
        processed_property = {
            "id": str(property_data.get("_id")),
            "name": property_data.get("name", ""),
            "type": property_data.get("type", ""),
            "phone_number": property_data.get("phone_number", "")
        }
        processed_properties.append(processed_property)
    
    return processed_properties


@handle_exceptions
def process_admin_property_details(property_data):
    property_id = str(property_data.get("_id"))
    name = property_data.get("name", "")
    full_description = property_data.get("description", "")
    images = property_data.get("images", [])
    amenities_data = property_data.get("amenities", [])
    location_data = property_data.get("location", {})
    documents = property_data.get("documents", [])
    whatsapp_link = property_data.get("whatsapp_link", "")
    property_type = property_data.get("type", "")
    
    all_amenities = extract_all_amenities(amenities_data)
    complete_address = build_complete_address(location_data)
    
    processed_data = {
        "id": property_id,
        "name": name,
        "description": full_description,
        "type": property_type,
        "images": images,
        "amenities": all_amenities,
        "address": complete_address,
        "documents": documents,
        "whatsapp_link": whatsapp_link
    }
    
    return processed_data


@handle_exceptions
def get_pending_property_details(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "images": 1,
        "amenities": 1,
        "location": 1,
        "documents": 1,
        "whatsapp_link": 1,
        "type": 1
    }
    
    property_data = db_find_one("farmhouses", query_filter, projection)
    
    if not property_data:
        raise AppException("Pending property not found")
    
    processed_property = process_admin_property_details(property_data)
    return processed_property


@handle_exceptions
def approve_pending_property(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1})
    
    if not property_exists:
        raise AppException("Pending property not found")
    
    update_data = {"status": "active"}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    
    return True


@handle_exceptions
def reject_pending_property(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1})
    
    if not property_exists:
        raise AppException("Pending property not found")
    
    delete_farmhouse_folder_from_r2(property_id)
    db_delete_one("farmhouses", query_filter)
    return True


@handle_exceptions
def add_credit_balance(property_id, credit_amount):
    query_filter = {"_id": ObjectId(property_id)}
    
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1, "credit_balance": 1})
    
    if not property_exists:
        raise AppException("Property not found")
    
    current_balance = property_exists.get("credit_balance", 0)
    new_balance = current_balance + credit_amount
    
    update_data = {"credit_balance": new_balance}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    
    return True


@handle_exceptions
def mark_property_as_favourite(property_id, favourite_status):
    query_filter = {"_id": ObjectId(property_id)}
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1})
    
    if not property_exists:
        raise AppException("Property not found")
    
    update_data = {"favourite": favourite_status}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    return True


@handle_exceptions
def fetch_pending_reviews_data():
    projection = {
        "_id": 1,
        "farmhouse_id": 1,
        "reviewer_name": 1,
        "rating": 1,
        "review_comment": 1
    }
    pending_reviews = db_find_many("pending_reviews", {}, projection)
    return pending_reviews


@handle_exceptions
def group_reviews_by_farmhouse(pending_reviews):
    farmhouse_reviews = {}
    farmhouse_ids = set()
    
    for review in pending_reviews:
        farmhouse_id = review.get("farmhouse_id")
        farmhouse_ids.add(farmhouse_id)
        
        if farmhouse_id not in farmhouse_reviews:
            farmhouse_reviews[farmhouse_id] = []
        
        review_data = {
            "review_id": str(review.get("_id")),
            "reviewer_name": review.get("reviewer_name", ""),
            "rating": review.get("rating", 0),
            "review_comment": review.get("review_comment", "")
        }
        farmhouse_reviews[farmhouse_id].append(review_data)
    
    return farmhouse_reviews, farmhouse_ids


@handle_exceptions
def fetch_farmhouse_names(farmhouse_ids):
    farmhouse_ids_list = [ObjectId(fid) for fid in farmhouse_ids]
    query_filter = {"_id": {"$in": farmhouse_ids_list}}
    projection = {"_id": 1, "name": 1}
    farmhouses = db_find_many("farmhouses", query_filter, projection)
    
    farmhouse_names = {}
    for farmhouse in farmhouses:
        farmhouse_id = farmhouse.get("_id")
        farmhouse_name = farmhouse.get("name", "Unknown Property")
        farmhouse_names[farmhouse_id] = farmhouse_name
    
    return farmhouse_names


@handle_exceptions
def build_pending_reviews_response(farmhouse_reviews, farmhouse_names):
    result = []
    for farmhouse_id, reviews in farmhouse_reviews.items():
        farmhouse_name = farmhouse_names.get(farmhouse_id, "Unknown Property")
        
        for review in reviews:
            review_item = {
                "farmhouse_id": str(farmhouse_id),
                "farmhouse_name": farmhouse_name,
                "review_id": review["review_id"],
                "reviewer_name": review["reviewer_name"],
                "review_comment": review["review_comment"],
                "rating": review["rating"]
            }
            result.append(review_item)
    
    return result


@handle_exceptions
def get_pending_reviews():
    pending_reviews = fetch_pending_reviews_data()
    
    if not pending_reviews:
        empty_list = []
        return empty_list
    
    farmhouse_reviews, farmhouse_ids = group_reviews_by_farmhouse(pending_reviews)
    farmhouse_names = fetch_farmhouse_names(farmhouse_ids)
    final_result = build_pending_reviews_response(farmhouse_reviews, farmhouse_names)
    
    return final_result


@handle_exceptions
def get_pending_review_by_id(review_id):
    query_filter = {"_id": ObjectId(review_id)}
    review_data = db_find_one("pending_reviews", query_filter)
    
    if not review_data:
        raise AppException("Pending review not found")
    
    return review_data


@handle_exceptions
def calculate_review_average(farmhouse_id):
    farmhouse_filter = {"_id": ObjectId(farmhouse_id)}
    farmhouse_data = db_find_one("farmhouses", farmhouse_filter, {"reviews": 1})
    
    if not farmhouse_data:
        raise AppException("Farmhouse not found")
    
    reviews = farmhouse_data.get("reviews", [])
    
    if not reviews:
        new_average = 0.0
    else:
        total_rating = sum(review.get("rating", 0) for review in reviews)
        new_average = round(total_rating / len(reviews), 2)
    
    return new_average


@handle_exceptions
def update_farmhouse_analysis_review_average(farmhouse_id, new_average):
    analysis_filter = {"farmhouse_id": ObjectId(farmhouse_id)}
    update_data = {"$set": {"review_average": new_average}}
    db_update_one("farmhouse_analysis", analysis_filter, update_data)
    return True


@handle_exceptions
def accept_pending_review(review_id):
    review_data = get_pending_review_by_id(review_id)
    
    farmhouse_id = review_data.get("farmhouse_id")
    reviewer_name = review_data.get("reviewer_name")
    review_comment = review_data.get("review_comment")
    rating = review_data.get("rating")
    
    farmhouse_filter = {"_id": ObjectId(farmhouse_id)}
    farmhouse_exists = db_find_one("farmhouses", farmhouse_filter, {"_id": 1})
    
    if not farmhouse_exists:
        raise AppException("Farmhouse not found")
    
    review_object = {
        "reviewer_name": reviewer_name,
        "review_comment": review_comment,
        "rating": rating
    }
    
    update_data = {"$push": {"reviews": review_object}}
    db_update_one("farmhouses", farmhouse_filter, update_data)
    
    new_average = calculate_review_average(farmhouse_id)
    update_farmhouse_analysis_review_average(farmhouse_id, new_average)
    
    query_filter = {"_id": ObjectId(review_id)}
    db_delete_one("pending_reviews", query_filter)
    return True


@handle_exceptions
def reject_pending_review(review_id):
    get_pending_review_by_id(review_id)
    
    query_filter = {"_id": ObjectId(review_id)}
    db_delete_one("pending_reviews", query_filter)
    return True