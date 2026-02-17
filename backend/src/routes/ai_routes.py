from flask import Blueprint, jsonify, request
from src.logics.ai_logics import search_properties
from src.utils.exception_handler import handle_route_exceptions, AppException

ai_bp = Blueprint('ai', __name__)


def build_search_query(query_text, property_type):
    trimmed_query = query_text.strip()
    if property_type and property_type != 'both':
        enriched_query = f"{trimmed_query} {property_type} property"
        return enriched_query
    return trimmed_query


@ai_bp.route('/ai-search', methods=['POST'])
@handle_route_exceptions
def ai_search():
    request_data = request.get_json() or {}
    query_text = request_data.get('query', '')
    property_type = request_data.get('propertyType', '')
    number_of_people = request_data.get('numberOfAdults', 0) or 0
    number_of_children = request_data.get('numberOfChildren', 0) or 0
    number_of_pets = request_data.get('numberOfPets', 0) or 0
    
    final_query = build_search_query(query_text, property_type)
    if not final_query:
        raise AppException('Search query is required')
    search_result = search_properties(final_query, number_of_people, number_of_children, number_of_pets)
    properties = search_result.get('properties', [])
    response_data = {
        'success': True,
        'properties': properties,
        'query': final_query
    }
    return jsonify(response_data), 200
