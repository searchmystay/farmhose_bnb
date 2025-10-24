from typing import Dict

def get_farmhouse_schema() -> Dict:
    return {
        "bsonType": "object",
        "required": ["name", "description", "type", "whatsapp_link", "location", "documents", "credit_balance", "status", "created_at", "updated_at"],
        "properties": {
            "_id": {
                "bsonType": "objectId",
                "description": "Unique identifier for the farmhouse"
            },
            "name": {
                "bsonType": "string",
                "description": "Name/title of the farmhouse",
                "minLength": 3,
                "maxLength": 100
            },
            "description": {
                "bsonType": "string", 
                "description": "Detailed description of the farmhouse",
                "minLength": 10,
                "maxLength": 1000
            },
            "type": {
                "bsonType": "string",
                "description": "Type of property - farmhouse or bnb",
                "enum": ["farmhouse", "bnb"]
            },
            "whatsapp_link": {
                "bsonType": "string",
                "description": "WhatsApp contact link for property owner",
                "pattern": "^https://wa.me/[0-9]{10,15}$"
            },
            "location": {
                "bsonType": "object",
                "description": "Property location details",
                "required": ["address", "city", "state", "pincode"],
                "properties": {
                    "address": {
                        "bsonType": "string",
                        "description": "Full address of the property",
                        "minLength": 10,
                        "maxLength": 200
                    },
                    "city": {
                        "bsonType": "string",
                        "description": "City where property is located",
                        "minLength": 2,
                        "maxLength": 50
                    },
                    "state": {
                        "bsonType": "string",
                        "description": "State where property is located",
                        "minLength": 2,
                        "maxLength": 50
                    },
                    "pincode": {
                        "bsonType": "string",
                        "description": "Postal code of the property",
                        "pattern": "^[0-9]{6}$"
                    }
                }
            },
            "documents": {
                "bsonType": "object",
                "description": "Required legal documents for property verification",
                "required": ["aadhar_card", "pan_card"],
                "properties": {
                    "aadhar_card": {
                        "bsonType": "string",
                        "description": "File path/URL for Aadhar card document"
                    },
                    "pan_card": {
                        "bsonType": "string", 
                        "description": "File path/URL for PAN card document"
                    },
                    "property_docs": {
                        "bsonType": "array",
                        "description": "Array of property ownership documents",
                        "items": {
                            "bsonType": "string"
                        }
                    }
                }
            },
            "booked_dates": {
                "bsonType": "array",
                "description": "Array of all future booked dates",
                "items": {
                    "bsonType": "date"
                }
            },
            "images": {
                "bsonType": "array",
                "description": "Array of property image URLs",
                "items": {
                    "bsonType": "string"
                }
            },
            "amenities": {
                "bsonType": "array",
                "description": "List of available amenities",
                "items": {
                    "bsonType": "object",
                    "description": "Amenity object with dynamic keys",
                    "additionalProperties": {
                        "bsonType": "string",
                        "enum": ["true", "false"],
                        "description": "Availability status as string"
                    }
                }
            },
            "credit_balance": {
                "bsonType": "number",
                "description": "Available credit balance for lead charges (40 rupees per lead)",
            },
            "status": {
                "bsonType": "string",
                "description": "Status of the farmhouse listing",
                "enum": ["pending_approval", "active", "inactive"]
            },
            "created_at": {
                "bsonType": "date",
                "description": "Timestamp when farmhouse was first created"
            },
            "updated_at": {
                "bsonType": "date", 
                "description": "Timestamp when farmhouse was last updated"
            }
        }
    }

