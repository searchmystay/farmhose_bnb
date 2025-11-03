from pymongo import MongoClient
from src.config import MONGODB_URI, DATABASE_NAME
from src.database.db_schema import get_farmhouse_schema, get_payment_schema, get_owner_analysis_schema, get_lead_schema
from src.utils.exception_handler import AppException, handle_exceptions

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]
farmhouses_collection = db.farmhouses
payments_collection = db.payments
owner_analysis_collection = db.owner_analysis
leads_collection = db.leads

@handle_exceptions
def setup_farmhouses_collection():
    farmhouse_schema = get_farmhouse_schema()
    existing_collections = db.list_collection_names()
    
    if 'farmhouses' not in existing_collections:
        validator = {"$jsonSchema": farmhouse_schema}
        collection_result = db.create_collection('farmhouses', validator=validator)
        creation_success = True
    else:
        validator = {"$jsonSchema": farmhouse_schema}
        update_result = db.command("collMod", "farmhouses", validator=validator)
        creation_success = True
    
    return creation_success


@handle_exceptions
def setup_payments_collection():
    payment_schema = get_payment_schema()
    existing_collections = db.list_collection_names()
    
    if 'payments' not in existing_collections:
        validator = {"$jsonSchema": payment_schema}
        collection_result = db.create_collection('payments', validator=validator)
        creation_success = True
    else:
        validator = {"$jsonSchema": payment_schema}
        update_result = db.command("collMod", "payments", validator=validator)
        creation_success = True
    
    return creation_success


@handle_exceptions
def setup_owner_analysis_collection():
    owner_analysis_schema = get_owner_analysis_schema()
    existing_collections = db.list_collection_names()
    
    if 'owner_analysis' not in existing_collections:
        validator = {"$jsonSchema": owner_analysis_schema}
        collection_result = db.create_collection('owner_analysis', validator=validator)
        creation_success = True
    else:
        validator = {"$jsonSchema": owner_analysis_schema}
        update_result = db.command("collMod", "owner_analysis", validator=validator)
        creation_success = True
    
    return creation_success


@handle_exceptions
def setup_leads_collection():
    lead_schema = get_lead_schema()
    existing_collections = db.list_collection_names()
    
    if 'leads' not in existing_collections:
        validator = {"$jsonSchema": lead_schema}
        collection_result = db.create_collection('leads', validator=validator)
        creation_success = True
    else:
        validator = {"$jsonSchema": lead_schema}
        update_result = db.command("collMod", "leads", validator=validator)
        creation_success = True
    
    return creation_success


@handle_exceptions
def initialize_database():
    farmhouses_setup = setup_farmhouses_collection()
    payments_setup = setup_payments_collection()
    owner_analysis_setup = setup_owner_analysis_collection()
    leads_setup = setup_leads_collection()
    
    if not farmhouses_setup:
        raise AppException("Failed to setup farmhouses collection")
    
    if not payments_setup:
        raise AppException("Failed to setup payments collection")
    
    if not owner_analysis_setup:
        raise AppException("Failed to setup owner_analysis collection")
    
    if not leads_setup:
        raise AppException("Failed to setup leads collection")
    
    initialization_complete = True
    return initialization_complete

database_initialized = initialize_database()