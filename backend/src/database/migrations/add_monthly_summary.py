from .. import db
from ...utils.exception_handler import handle_exceptions


@handle_exceptions
def check_field_exists(doc):
    has_field = "monthly_summary" in doc
    return has_field


@handle_exceptions
def count_documents_without_field():
    count = db["farmhouse_analysis"].count_documents(
        {"monthly_summary": {"$exists": False}}
    )
    return count


@handle_exceptions
def add_monthly_summary_field():
    result = db["farmhouse_analysis"].update_many(
        {"monthly_summary": {"$exists": False}},
        {"$set": {"monthly_summary": None}}
    )
    return result.modified_count


@handle_exceptions
def run_migration():
    count = count_documents_without_field()
    
    if count == 0:
        return True
    
    modified = add_monthly_summary_field()
    return modified > 0
