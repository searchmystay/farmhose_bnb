from src.logics.admin_auth import authenticate_admin
from src.utils.exception_handler import handle_exceptions, AppException
from src.database.db_common_operations import db_find_many, db_find_one, db_update_one, db_delete_one, db_insert_one
from src.logics.website_logic import process_property_for_detail, extract_all_amenities, build_complete_address
from src.logics.cloudfare_bucket import delete_farmhouse_folder_from_r2
from bson import ObjectId
from datetime import datetime
import pytz
import hashlib
import re


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
    
    basic_details = {
        "id": property_id,
        "name": property_data.get("name", ""),
        "description": property_data.get("description", ""),
        "type": property_data.get("type", ""),
        "address": build_complete_address(property_data.get("location", {})),
        "opening_time": property_data.get("opening_time", ""),
        "closing_time": property_data.get("closing_time", ""),
        "per_day_price": property_data.get("per_day_price", 0),
        "max_people_allowed": property_data.get("max_people_allowed", 0),
        "amenities": property_data.get("amenities", {}),
        "credit_balance": property_data.get("credit_balance", 0)
    }
    
    owner_details_data = property_data.get("owner_details", {})
    owner_details = {
        "owner_name": owner_details_data.get("owner_name", ""),
        "owner_photo": owner_details_data.get("owner_photo", ""),
        "owner_description": owner_details_data.get("owner_description", ""),
        "owner_dashboard_id": owner_details_data.get("owner_dashboard_id", ""),
        "owner_dashboard_password": owner_details_data.get("owner_dashboard_password", "")
    }
    
    documents_data = property_data.get("documents", {})
    documents_list = []
    
    if documents_data.get("aadhar_card"):
        documents_list.append({
            "type": "aadhar_card",
            "url": documents_data.get("aadhar_card")
        })
    
    if documents_data.get("pan_card"):
        documents_list.append({
            "type": "pan_card", 
            "url": documents_data.get("pan_card")
        })
    
    property_docs = documents_data.get("property_docs", [])
    for doc_url in property_docs:
        if doc_url:
            documents_list.append({
                "type": "property_document",
                "url": doc_url
            })
    
    documents_images = {
        "documents": documents_list,
        "images": property_data.get("images", [])
    }
    
    processed_data = {
        "basic_details": basic_details,
        "owner_details": owner_details,
        "documents_images": documents_images
    }
    
    return processed_data


@handle_exceptions
def get_admin_property_details(property_id):
    query_filter = {"_id": ObjectId(property_id)}
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "type": 1,
        "location": 1,
        "opening_time": 1,
        "closing_time": 1,
        "per_day_price": 1,
        "max_people_allowed": 1,
        "amenities": 1,
        "owner_details": 1,
        "documents": 1,
        "images": 1,
        "credit_balance": 1
    }
    
    property_data = db_find_one("farmhouses", query_filter, projection)
    
    if not property_data:
        raise AppException("Property not found")
    
    processed_property = process_admin_property_details(property_data)
    return processed_property


@handle_exceptions
def check_analysis_document_exists(property_id):
    query_filter = {"farmhouse_id": ObjectId(property_id)}
    existing_analysis = db_find_one("farmhouse_analysis", query_filter, {"_id": 1})
    return existing_analysis is not None


@handle_exceptions
def create_initial_analysis_data(property_id):
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone)
    
    initial_data = {
        "farmhouse_id": ObjectId(property_id),
        "total_views": 0,
        "total_leads": 0,
        "daily_analytics": [],
        "review_average": 0.0,
        "created_at": current_time,
        "updated_at": current_time
    }
    
    return initial_data


@handle_exceptions
def initialize_farmhouse_analysis(property_id):
    analysis_exists = check_analysis_document_exists(property_id)
    
    if analysis_exists:
        return True
    
    initial_data = create_initial_analysis_data(property_id)
    db_insert_one("farmhouse_analysis", initial_data)
    
    return True


@handle_exceptions
def get_existing_property_ids():
    query_filter = {"owner_details.owner_dashboard_id": {"$regex": "^property_"}}
    projection = {"owner_details.owner_dashboard_id": 1}
    existing_properties = db_find_many("farmhouses", query_filter, projection)
    return existing_properties


@handle_exceptions
def extract_max_property_number(existing_properties):
    max_number = 0
    for property_data in existing_properties:
        owner_details = property_data.get("owner_details", {})
        dashboard_id = owner_details.get("owner_dashboard_id", "")
        
        if dashboard_id.startswith("property_"):
            try:
                number_part = dashboard_id.replace("property_", "")
                current_number = int(number_part)
                max_number = max(max_number, current_number)
            except ValueError:
                continue
    
    return max_number


@handle_exceptions
def generate_dashboard_id():
    existing_properties = get_existing_property_ids()
    max_number = extract_max_property_number(existing_properties)
    new_number = max_number + 1
    dashboard_id = f"property_{new_number}"
    return dashboard_id


@handle_exceptions
def generate_dashboard_password(farmhouse_id):
    if not farmhouse_id:
        raise AppException("Farmhouse ID is required to generate password")
    
    password_base = f"fh_{farmhouse_id}_owner"
    password_hash = hashlib.md5(password_base.encode()).hexdigest()
    dashboard_password = password_hash[:8]
    return dashboard_password


@handle_exceptions
def generate_owner_credentials(property_id, owner_name):
    dashboard_id = generate_dashboard_id()
    dashboard_password = generate_dashboard_password(property_id)
    return dashboard_id, dashboard_password
        

@handle_exceptions
def approve_pending_property(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    property_data = db_find_one("farmhouses", query_filter, {
        "_id": 1, 
        "owner_details": 1
    })
    
    if not property_data:
        raise AppException("Pending property not found")
    
    owner_details = property_data.get("owner_details", {})
    owner_name = owner_details.get("owner_name", "")
    
    if not owner_name:
        raise AppException("Owner name is required to generate dashboard credentials")
    
    dashboard_id, dashboard_password = generate_owner_credentials(property_id, owner_name)
    
    update_data = {
        "status": "active",
        "owner_details.owner_dashboard_id": dashboard_id,
        "owner_details.owner_dashboard_password": dashboard_password
    }
    
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    initialize_farmhouse_analysis(property_id)
    
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
def toggle_property_status(property_id, new_status):
    query_filter = {"_id": ObjectId(property_id)}
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1})
    
    if not property_exists:
        raise AppException("Property not found")
    
    update_data = {"status": new_status}
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


@handle_exceptions
def get_all_properties():
    query_filter = {"status": {"$ne": "pending_approval"}} 
    projection = {
        "_id": 1,
        "name": 1,
        "type": 1,
        "phone_number": 1,
        "status": 1,
        "favourite": 1,
        "credit_balance": 1
    }
    
    all_properties = db_find_many("farmhouses", query_filter, projection)
    
    processed_properties = []
    for property_data in all_properties:
        processed_property = {
            "id": str(property_data.get("_id")),
            "name": property_data.get("name", ""),
            "type": property_data.get("type", ""),
            "phone_number": property_data.get("phone_number", ""),
            "status": property_data.get("status", ""),
            "favourite": property_data.get("favourite", False),
            "credit_balance": property_data.get("credit_balance", 0)
        }
        processed_properties.append(processed_property)
    
    return processed_properties