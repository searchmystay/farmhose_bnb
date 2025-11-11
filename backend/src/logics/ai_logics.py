import os
from datetime import datetime
import pytz
from openai import OpenAI
from ..utils.exception_handler import handle_exceptions, AppException
from ..utils.logger import logger
from ..database.db_common_operations import db_find_one, db_update_one, db_insert_one


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