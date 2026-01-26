import boto3
from werkzeug.utils import secure_filename
from src.config import R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL
from src.utils.exception_handler import handle_exceptions, AppException
import base64
from io import BytesIO

@handle_exceptions
def get_file_extension(filename):
    extension_index = 1
    file_extension = filename.rsplit('.', extension_index)[extension_index].lower()
    return file_extension


@handle_exceptions
def create_s3_client():
    s3_client = boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT_URL,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY
    )
    return s3_client


@handle_exceptions
def upload_file_to_r2(file_storage, file_key):
    s3_client = create_s3_client()
    
    s3_client.upload_fileobj(
        file_storage,
        R2_BUCKET_NAME,
        file_key,
        ExtraArgs={"ContentType": file_storage.mimetype}
    )
    
    public_url = f"{R2_PUBLIC_URL}/{file_key}"
    return public_url


@handle_exceptions
def upload_farmhouse_image_to_r2(file_storage, farmhouse_id, image_index):
    filename = secure_filename(file_storage.filename)
    file_extension = get_file_extension(filename)
    file_key = f"farmhouse/{farmhouse_id}/images/image_{image_index}.{file_extension}"
    
    public_url = upload_file_to_r2(file_storage, file_key)
    return public_url


@handle_exceptions
def upload_farmhouse_document_to_r2(file_storage, farmhouse_id, doc_type):
    filename = secure_filename(file_storage.filename)
    file_extension = get_file_extension(filename)
    file_key = f"farmhouse/{farmhouse_id}/documents/{doc_type}.{file_extension}"
    public_url = upload_file_to_r2(file_storage, file_key)
    return public_url


@handle_exceptions
def extract_key_from_r2_url(url):
    if not url or not isinstance(url, str):
        raise AppException("Invalid URL provided", 400)
    
    url_without_domain = url.replace(R2_PUBLIC_URL + "/", "")
    return url_without_domain


@handle_exceptions
def overwrite_image_in_r2(base64_string, existing_url):
    file_key = extract_key_from_r2_url(existing_url)
    header_and_data = base64_string.split(',')
    base64_data = header_and_data[1] if len(header_and_data) > 1 else header_and_data[0]
    
    image_bytes = base64.b64decode(base64_data)
    image_file = BytesIO(image_bytes)
    
    s3_client = create_s3_client()
    s3_client.upload_fileobj(
        image_file,
        R2_BUCKET_NAME,
        file_key,
        ExtraArgs={"ContentType": "image/jpeg"}
    )
    
    return existing_url


@handle_exceptions
def delete_farmhouse_folder_from_r2(farmhouse_id):
    s3_client = create_s3_client()
    folder_prefix = f"farmhouse/{farmhouse_id}/"
    
    objects_to_delete = s3_client.list_objects_v2(
        Bucket=R2_BUCKET_NAME,
        Prefix=folder_prefix
    )
    
    if 'Contents' in objects_to_delete:
        delete_keys = [{'Key': obj['Key']} for obj in objects_to_delete['Contents']]
        
        s3_client.delete_objects(
            Bucket=R2_BUCKET_NAME,
            Delete={'Objects': delete_keys}
        )
    
    return True