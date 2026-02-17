from flask import Blueprint, jsonify, request
from src.logics.ai_logics import search_properties
from src.utils.exception_handler import handle_route_exceptions, AppException
import re

ai_bp = Blueprint('ai', __name__)


def build_search_query(query_text, property_type):
    trimmed_query = query_text.strip()
    people_match = re.search(r'(\d+)\s*people', trimmed_query.lower())
    if people_match:
        num_people = int(people_match.group(1))
        trimmed_query = f"{trimmed_query} accommodation for {num_people} or more people maximum capacity {num_people}+ guests"
    
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
    
    people_match = re.search(r'(\d+)\s*(?:people|person)', query_text.lower())
    children_match = re.search(r'(\d+)\s*(?:child|children|childrens)', query_text.lower())
    pets_match = re.search(r'(\d+)\s*(?:pet|pets)', query_text.lower())
    
    min_people = int(people_match.group(1)) if people_match else 0
    min_children = int(children_match.group(1)) if children_match else 0
    min_pets = int(pets_match.group(1)) if pets_match else 0
    
    final_query = build_search_query(query_text, property_type)
    if not final_query:
        raise AppException('Search query is required')
    search_result = search_properties(final_query)

    if (min_people > 0 or min_children > 0 or min_pets > 0) and 'properties' in search_result:
        for prop in search_result['properties']:
            print(f"  - {prop.get('title', 'Unknown')}: max_people={prop.get('max_people_allowed', 0)}, max_children={prop.get('max_children_allowed', 0)}, max_pets={prop.get('max_pets_allowed', 0)}")
        
        filtered_properties = []
        for prop in search_result['properties']:
            people_ok = min_people <= prop.get('max_people_allowed', 0) if min_people > 0 else True
            children_ok = min_children <= prop.get('max_children_allowed', 0) if min_children > 0 else True
            pets_ok = min_pets <= prop.get('max_pets_allowed', 0) if min_pets > 0 else True
            
            if people_ok and children_ok and pets_ok:
                filtered_properties.append(prop)
        
        search_result['properties'] = filtered_properties
    properties = search_result.get('properties', [])
    response_data = {
        'success': True,
        'properties': properties,
        'query': final_query
    }
    return jsonify(response_data), 200
