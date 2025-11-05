from .. import db
from ...utils.exception_handler import handle_exceptions


@handle_exceptions
def count_documents_without_review_average():
    count = db["farmhouse_analysis"].count_documents(
        {"review_average": {"$exists": False}}
    )
    return count


@handle_exceptions
def add_review_average_field():
    result = db["farmhouse_analysis"].update_many(
        {"review_average": {"$exists": False}},
        {"$set": {"review_average": 0.0}}
    )
    return result.modified_count


@handle_exceptions
def run_migration():
    count = count_documents_without_review_average()
    
    if count == 0:
        return True
    
    modified = add_review_average_field()
    return modified > 0
