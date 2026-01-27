from bson import ObjectId
from . import db
from ..utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def db_insert_one(collection_name, data):
    collection = db[collection_name]
    result = collection.insert_one(data)
    return result


@handle_exceptions
def db_insert_many(collection_name, data_list):
    collection = db[collection_name]
    result = collection.insert_many(data_list)
    return [str(id) for id in result.inserted_ids]


@handle_exceptions
def db_find_one(collection_name, filter_dict, projection=None):
    collection = db[collection_name]
    return collection.find_one(filter_dict, projection)


@handle_exceptions
def db_find_many(collection_name, filter_dict, projection=None, sort_field=None, sort_order=-1, limit=None):
    collection = db[collection_name]
    cursor = collection.find(filter_dict, projection)
    
    if sort_field:
        cursor = cursor.sort(sort_field, sort_order)
    
    if limit:
        cursor = cursor.limit(limit)
    
    return list(cursor)


@handle_exceptions
def db_find_by_id(collection_name, id, projection=None):
    collection = db[collection_name]
    return collection.find_one({"_id": ObjectId(id)}, projection)


@handle_exceptions
def db_find_by_field(collection_name, field_name, field_value, projection=None):
    collection = db[collection_name]
    return collection.find_one({field_name: field_value}, projection)


@handle_exceptions
def db_find_all(collection_name, projection=None, sort_field=None, sort_order=-1):
    collection = db[collection_name]
    cursor = collection.find({}, projection)
    
    if sort_field:
        cursor = cursor.sort(sort_field, sort_order)
    
    return list(cursor)


@handle_exceptions
def db_update_one(collection_name, filter_dict, update_dict, upsert=False):
    collection = db[collection_name]
    result = collection.update_one(filter_dict, update_dict, upsert=upsert)
    return result


@handle_exceptions
def db_update_many(collection_name, filter_dict, update_dict):
    collection = db[collection_name]
    result = collection.update_many(filter_dict, update_dict)
    return result.modified_count


@handle_exceptions
def db_update_by_id(collection_name, id, update_dict):
    collection = db[collection_name]
    result = collection.update_one({"_id": ObjectId(id)}, update_dict)
    return result


@handle_exceptions
def db_delete_one(collection_name, filter_dict):
    collection = db[collection_name]
    result = collection.delete_one(filter_dict)
    return result.deleted_count > 0


@handle_exceptions
def db_delete_many(collection_name, filter_dict):
    collection = db[collection_name]
    result = collection.delete_many(filter_dict)
    return result.deleted_count


@handle_exceptions
def db_delete_by_id(collection_name, id):
    collection = db[collection_name]
    result = collection.delete_one({"_id": ObjectId(id)})
    return result.deleted_count > 0


@handle_exceptions
def db_exists(collection_name, filter_dict):
    collection = db[collection_name]
    return collection.count_documents(filter_dict, limit=1) > 0


@handle_exceptions
def db_count_documents(collection_name, filter_dict=None):
    collection = db[collection_name]
    if filter_dict is None:
        filter_dict = {}
    return collection.count_documents(filter_dict)


@handle_exceptions
def db_find_field_by_id(collection_name, id, field_name):
    collection = db[collection_name]
    result = collection.find_one({"_id": ObjectId(id)}, {field_name: 1})
    return result.get(field_name) if result else None


@handle_exceptions
def db_append_to_array(collection_name, filter_dict, field_name, value):
    collection = db[collection_name]
    result = collection.update_one(filter_dict, {"$push": {field_name: value}})
    return result.modified_count > 0


@handle_exceptions
def db_append_to_array_by_id(collection_name, id, field_name, value):
    collection = db[collection_name]
    result = collection.update_one({"_id": ObjectId(id)}, {"$push": {field_name: value}})
    return result.modified_count > 0


@handle_exceptions
def db_remove_from_array(collection_name, filter_dict, field_name, value):
    collection = db[collection_name]
    result = collection.update_one(filter_dict, {"$pull": {field_name: value}})
    return result.modified_count > 0


@handle_exceptions
def db_increment_field(collection_name, filter_dict, field_name, increment_value=1):
    collection = db[collection_name]
    result = collection.update_one(filter_dict, {"$inc": {field_name: increment_value}})
    return result.modified_count > 0


@handle_exceptions
def db_increment_field_by_id(collection_name, id, field_name, increment_value=1):
    collection = db[collection_name]
    result = collection.update_one({"_id": ObjectId(id)}, {"$inc": {field_name: increment_value}})
    return result.modified_count > 0


@handle_exceptions
def db_set_field(collection_name, filter_dict, field_name, value):
    collection = db[collection_name]
    result = collection.update_one(filter_dict, {"$set": {field_name: value}})
    return result.modified_count > 0


@handle_exceptions
def db_set_field_by_id(collection_name, id, field_name, value):
    collection = db[collection_name]
    result = collection.update_one({"_id": ObjectId(id)}, {"$set": {field_name: value}})
    return result.modified_count > 0


@handle_exceptions
def db_aggregate(collection_name, pipeline):
    collection = db[collection_name]
    return list(collection.aggregate(pipeline))


@handle_exceptions
def add_admin_image_to_property(property_id, image_url):
    filter_dict = {"_id": ObjectId(property_id)}
    
    property_doc = db_find_one("farmhouses", filter_dict)
    if not property_doc:
        raise AppException("Property not found", 404)
    
    # Add to main images array instead of documents_images
    if "images" not in property_doc or not isinstance(property_doc.get("images"), list):
        update_dict = {"$set": {"images": [image_url]}}
    else:
        update_dict = {"$push": {"images": image_url}}
    
    result = db_update_one("farmhouses", filter_dict, update_dict)
    
    if result.matched_count == 0:
        raise AppException("Failed to update property", 500)
    
    return True


@handle_exceptions
def remove_admin_image_from_property(property_id, image_url):
    filter_dict = {"_id": ObjectId(property_id)}
    update_dict = {"$pull": {"images": image_url}}
    result = db_update_one("farmhouses", filter_dict, update_dict)
    
    if result.matched_count == 0:
        raise AppException("Property not found", 404)
    
    return True