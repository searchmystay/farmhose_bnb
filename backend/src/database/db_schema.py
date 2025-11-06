from typing import Dict

def get_farmhouse_schema() -> Dict:
    return {
        "bsonType": "object",
        "required": ["name", "description", "type", "phone_number", "location", "credit_balance", "status", "created_at", "updated_at"],
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
                "maxLength": 2000
            },
            "type": {
                "bsonType": "string",
                "description": "Type of property - farmhouse or bnb",
                "enum": ["farmhouse", "bnb"]
            },
            "phone_number": {
                "bsonType": "string",
                "description": "Phone number for property owner",
                "pattern": "^[0-9]{10}$"
            },
            "max_people": {
                "bsonType": "int",
                "description": "Maximum number of people that can stay at the property",
                "minimum": 1,
                "maximum": 100
            },
            "location": {
                "bsonType": "object",
                "description": "Property location details",
                "required": ["address", "pin_code"],
                "properties": {
                    "address": {
                        "bsonType": "string",
                        "description": "Full address of the property",
                        "maxLength": 200
                    },
                    "pin_code": {
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
                "description": "Array of all future booked dates (YYYY-MM-DD format)",
                "items": {
                    "bsonType": "string",
                    "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
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
                "bsonType": "object",
                "description": "Categorized amenities with proper data types",
                "properties": {
                    "core_amenities": {
                        "bsonType": "object",
                        "description": "Core Amenities",
                        "properties": {
                            "air_conditioning": {
                                "bsonType": "bool",
                                "description": "Air conditioning system available for temperature control"
                            },
                            "wifi_internet": {
                                "bsonType": "bool",
                                "description": "Wi-Fi internet connection available for guests"
                            },
                            "power_backup": {
                                "bsonType": "bool",
                                "description": "Power backup system like inverter or generator during outages"
                            },
                            "parking": {
                                "bsonType": "bool",
                                "description": "Free or private parking space available for vehicles"
                            },
                            "refrigerator": {
                                "bsonType": "bool",
                                "description": "Refrigerator available for storing food and beverages"
                            },
                            "microwave": {
                                "bsonType": "bool",
                                "description": "Microwave oven available for heating and cooking food"
                            },
                            "cooking_basics": {
                                "bsonType": "bool",
                                "description": "Basic cooking essentials like utensils, oil, salt and spices provided"
                            },
                            "drinking_water": {
                                "bsonType": "bool",
                                "description": "Clean drinking water supply available for guests"
                            },
                            "washing_machine": {
                                "bsonType": "bool",
                                "description": "Washing machine available for laundry needs"
                            },
                            "iron": {
                                "bsonType": "bool",
                                "description": "Iron and ironing board available for clothing care"
                            },
                            "geyser_hot_water": {
                                "bsonType": "bool",
                                "description": "Hot water system or geyser available for bathing and washing"
                            },
                            "television": {
                                "bsonType": "bool",
                                "description": "Television available for entertainment"
                            },
                            "smart_tv_ott": {
                                "bsonType": "bool",
                                "description": "Smart TV with streaming apps like Netflix, Amazon Prime, etc."
                            },
                            "wardrobe": {
                                "bsonType": "bool",
                                "description": "Wardrobe or closet space available for storing clothes"
                            },
                            "extra_mattress_bedding": {
                                "bsonType": "bool",
                                "description": "Additional mattress and bedding available for extra guests"
                            },
                            "cleaning_supplies": {
                                "bsonType": "bool",
                                "description": "Cleaning supplies and materials provided for maintaining cleanliness"
                            }
                        }
                    },
                    
                    "bedroom_bathroom": {
                        "bsonType": "object",
                        "description": "Bedroom & Bathroom",
                        "properties": {
                            "bedrooms": {
                                "bsonType": "number",
                                "description": "Number of bedrooms available in the property",
                                "minimum": 0
                            },
                            "bathrooms": {
                                "bsonType": "number",
                                "description": "Number of bathrooms available in the property",
                                "minimum": 0
                            },
                            "beds": {
                                "bsonType": "number",
                                "description": "Number of beds available in the property",
                                "minimum": 0
                            },
                            "bed_linens": {
                                "bsonType": "bool",
                                "description": "Fresh bed linens including sheets, pillowcases and blankets provided"
                            },
                            "towels": {
                                "bsonType": "bool",
                                "description": "Clean towels provided for bathing and personal use"
                            },
                            "toiletries": {
                                "bsonType": "bool",
                                "description": "Basic toiletries like soap, shampoo, toothpaste provided"
                            },
                            "mirror": {
                                "bsonType": "bool",
                                "description": "Mirror available in bathroom or bedroom for grooming"
                            },
                            "hair_dryer": {
                                "bsonType": "bool",
                                "description": "Hair dryer available for drying hair after bath"
                            },
                            "attached_bathrooms": {
                                "bsonType": "bool",
                                "description": "Private attached bathrooms connected to bedrooms"
                            },
                            "bathtub": {
                                "bsonType": "bool",
                                "description": "Bathtub available for relaxing baths if provided"
                            }
                        }
                    },
                    
                    "outdoor_garden": {
                        "bsonType": "object",
                        "description": "Outdoor & Garden",
                        "properties": {
                            "private_lawn_garden": {
                                "bsonType": "bool",
                                "description": "Private lawn or garden area for relaxation and outdoor activities"
                            },
                            "swimming_pool": {
                                "bsonType": "bool",
                                "description": "Swimming pool available for recreation and exercise"
                            },
                            "outdoor_seating_area": {
                                "bsonType": "bool",
                                "description": "Outdoor seating area with chairs and tables for relaxing outside"
                            },
                            "bonfire_setup": {
                                "bsonType": "bool",
                                "description": "Bonfire setup area for evening gatherings and warmth"
                            },
                            "barbecue_setup": {
                                "bsonType": "bool",
                                "description": "Barbecue setup for outdoor cooking and grilling"
                            },
                            "terrace_balcony": {
                                "bsonType": "bool",
                                "description": "Terrace or balcony area for outdoor views and fresh air"
                            },
                        
                        }
                    },
                    
                    "food_dining": {
                        "bsonType": "object",
                        "description": "Food & Dining",
                        "properties": {
                            "kitchen_access_self_cooking": {
                                "bsonType": "bool",
                                "description": "Kitchen access available for guests to cook their own meals"
                            },
                            "in_house_meals_available": {
                                "bsonType": "bool",
                                "description": "In-house meals provided by the property for guests"
                            },
                            "dining_table": {
                                "bsonType": "bool",
                                "description": "Dining table available for comfortable eating experience"
                            }
                        }
                    },
                    
                    "entertainment_activities": {
                        "bsonType": "object",
                        "description": "Entertainment & Activities",
                        "properties": {
                            "indoor_games": {
                                "bsonType": "bool",
                                "description": "Indoor games like carrom, chess, ludo available for entertainment"
                            },
                            "outdoor_games": {
                                "bsonType": "bool",
                                "description": "Outdoor games like cricket, badminton, football available for recreation"
                            },
                            "pool_table": {
                                "bsonType": "bool",
                                "description": "Pool table available for billiards and recreational gaming"
                            },
                            "music_system": {
                                "bsonType": "bool",
                                "description": "Music system or speakers available for playing music"
                            },
                            "board_games": {
                                "bsonType": "bool",
                                "description": "Board games available for group entertainment and fun"
                            },
                            "bicycle_access": {
                                "bsonType": "bool",
                                "description": "Bicycle access available for exploring the area and exercise"
                            },
                            "movie_projector": {
                                "bsonType": "bool",
                                "description": "Movie projector available for watching films and entertainment"
                            }
                        }
                    },
                 
                    "pet_family_friendly": {
                        "bsonType": "object",
                        "description": "Pet & Family Friendly",
                        "properties": {
                            "pet_friendly": {
                                "bsonType": "bool",
                                "description": "Pet-friendly property welcoming dogs, cats and other pets"
                            },
                            "child_friendly": {
                                "bsonType": "bool",
                                "description": "Child-friendly environment suitable for families with kids"
                            },
                            "kids_play_area": {
                                "bsonType": "bool",
                                "description": "Kids play area with games and activities for children"
                            },
                            "fenced_property": {
                                "bsonType": "bool",
                                "description": "Fenced property providing security and safety for pets and children"
                            }
                        }
                    },
                 
                    "safety_security": {
                        "bsonType": "object",
                        "description": "Safety & Security",
                        "properties": {
                            "cctv_cameras": {
                                "bsonType": "bool",
                                "description": "CCTV cameras installed in common areas only for security monitoring"
                            },
                            "first_aid_kit": {
                                "bsonType": "bool",
                                "description": "First aid kit available for medical emergencies and basic treatment"
                            },
                            "fire_extinguisher": {
                                "bsonType": "bool",
                                "description": "Fire extinguisher available for fire safety and emergency protection"
                            },
                            "security_guard": {
                                "bsonType": "bool",
                                "description": "Security guard available for property protection and guest safety"
                            },
                            "private_gate_compound_wall": {
                                "bsonType": "bool",
                                "description": "Private gate and compound wall providing privacy and security"
                            }
                        }
                    },
                    
                    "experience_luxury_addons": {
                        "bsonType": "object",
                        "description": "Experience & Luxury Add-ons",
                        "properties": {
                            "jacuzzi": {
                                "bsonType": "bool",
                                "description": "Jacuzzi available for luxury relaxation and therapeutic bathing"
                            },
                            "private_bar_setup": {
                                "bsonType": "bool",
                                "description": "Private bar setup with drinks and cocktail preparation area"
                            },
                            "farm_view_nature_view": {
                                "bsonType": "bool",
                                "description": "Farm view or nature view providing scenic and peaceful surroundings"
                            },
                            "open_shower_outdoor_bath": {
                                "bsonType": "bool",
                                "description": "Open shower or outdoor bath for unique bathing experience"
                            },
                            "gazebo_cabana_seating": {
                                "bsonType": "bool",
                                "description": "Gazebo or cabana seating for comfortable outdoor relaxation"
                            },
                            "hammock": {
                                "bsonType": "bool",
                                "description": "Hammock available for leisurely swinging and relaxation"
                            },
                            "high_tea_setup": {
                                "bsonType": "bool",
                                "description": "High-tea setup for elegant tea time experience"
                            },
                            "event_space_small_gatherings": {
                                "bsonType": "bool",
                                "description": "Event space available for small gatherings and celebrations"
                            },
                            "private_chef_on_request": {
                                "bsonType": "bool",
                                "description": "Private chef service available on request for personalized dining"
                            }
                        }
                    },
                    
                    "house_rules_services": {
                        "bsonType": "object",
                        "description": "House Rules & Services",
                        "properties": {
                            "daily_cleaning_available": {
                                "bsonType": "bool",
                                "description": "Daily cleaning service available to maintain property hygiene"
                            },
                            "long_stays_allowed": {
                                "bsonType": "bool",
                                "description": "Long stays allowed for extended vacation or work purposes"
                            },
                            "early_check_in_late_check_out": {
                                "bsonType": "bool",
                                "description": "Early check-in or late check-out available on request for flexibility"
                            },
                            "staff_quarters_available": {
                                "bsonType": "bool",
                                "description": "Staff quarters available for property maintenance and guest services"
                            },
                            "caretaker_on_site": {
                                "bsonType": "bool",
                                "description": "Caretaker available on-site for property assistance and guest support"
                            }
                        }
                    }
                }
            },
            "reviews": {
                "bsonType": "array",
                "description": "Array of reviews for the farmhouse",
                "items": {
                    "bsonType": "object",
                    "required": ["reviewer_name", "review_comment"],
                    "properties": {
                        "reviewer_name": {
                            "bsonType": "string",
                            "description": "Name of the person who reviewed the farmhouse",
                            "minLength": 2,
                            "maxLength": 100
                        },
                        "review_comment": {
                            "bsonType": "string",
                            "description": "Review comment or feedback about the farmhouse",
                            "minLength": 10,
                        },
                        "rating": {
                            "bsonType": "number",
                            "description": "Rating given by the reviewer (1-5 stars)",
                            "minimum": 0,
                            "maximum": 5
                        }
                    }
                }
            },
            "owner_details": {
                "bsonType": "object",
                "description": "Details about the farmhouse owner",
                "properties": {
                    "owner_name": {
                        "bsonType": "string",
                        "description": "Name of the farmhouse owner",
                        "minLength": 3,
                        "maxLength": 100
                    },
                    "owner_photo": {
                        "bsonType": "string",
                        "description": "Photo URL of the farmhouse owner"
                    },
                    "owner_description": {
                        "bsonType": "string",
                        "description": "Description about the farmhouse owner",
                    },
                    "owner_dashboard_id": {
                        "bsonType": "string",
                        "description": "Unique owner dashboard login ID",
                        "minLength": 3,
                        "maxLength": 50
                    },
                    "owner_dashboard_password": {
                        "bsonType": "string",
                        "description": "Owner dashboard password for authentication",
                        "minLength": 6
                    }
                }
            },
            "opening_time": {
                "bsonType": "string",
                "description": "Opening time of the farmhouse (12-hour format with AM/PM)",
                "pattern": "^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$"
            },
            "closing_time": {
                "bsonType": "string",
                "description": "Closing time of the farmhouse (12-hour format with AM/PM)",
                "pattern": "^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$"
            },
            "per_day_cost": {
                "bsonType": "number",
                "description": "Cost per day for booking the farmhouse in rupees",
                "minimum": 0
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
            "favourite": {
                "bsonType": "bool",
                "description": "Mark farmhouse as favourite for popular listings",
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


def get_payment_schema() -> Dict:
    return {
        "bsonType": "object",
        "required": ["farmhouse_id", "amount", "status", "created_at"],
        "properties": {
            "_id": {
                "bsonType": "objectId",
                "description": "Unique identifier for the payment"
            },
            "farmhouse_id": {
                "bsonType": "objectId",
                "description": "Reference to farmhouse making the payment"
            },
            "amount": {
                "bsonType": "number",
                "description": "Payment amount in rupees",
                "minimum": 1
            },
            "order_id": {
                "bsonType": "string",
                "description": "Razorpay order ID"
            },
            "payment_id": {
                "bsonType": "string",
                "description": "Razorpay payment ID after successful payment"
            },
            "signature": {
                "bsonType": "string",
                "description": "Razorpay signature for verification"
            },
            "status": {
                "bsonType": "string",
                "description": "Payment status",
                "enum": ["initiated", "success", "failed"]
            },
            "created_at": {
                "bsonType": "date",
                "description": "Timestamp when payment was initiated"
            },
            "verified_at": {
                "bsonType": "date",
                "description": "Timestamp when payment was verified"
            }
        }
    }


def get_farmhouse_analysis_schema() -> Dict:
    return {
        "bsonType": "object",
        "required": ["farmhouse_id", "total_views", "total_leads", "daily_analytics", "created_at", "updated_at"],
        "properties": {
            "_id": {
                "bsonType": "objectId",
                "description": "Unique identifier for the analysis record"
            },
            "farmhouse_id": {
                "bsonType": "objectId",
                "description": "Reference to farmhouse (unique - one document per farmhouse)"
            },
            "total_views": {
                "bsonType": "int",
                "description": "Total views count"
            },
            "total_leads": {
                "bsonType": "int",
                "description": "Total leads count"
            },
            "daily_analytics": {
                "bsonType": "array",
                "description": "Daily analytics tracking views and leads",
                "items": {
                    "bsonType": "object",
                    "required": ["date", "views", "leads"],
                    "properties": {
                        "date": {
                            "bsonType": "string",
                            "description": "Date in YYYY-MM-DD format"
                        },
                        "views": {
                            "bsonType": "int",
                            "description": "Views on this date"
                        },
                        "leads": {
                            "bsonType": "int",
                            "description": "Leads on this date"
                        }
                    }
                }
            },
            "last_month_summary": {
                "bsonType": "object",
                "description": "Last month summary (last complete month only)",
                "required": ["month", "total_leads", "total_views", "created_at"],
                "properties": {
                    "month": {
                        "bsonType": "string",
                        "description": "Month in YYYY-MM format"
                    },
                    "total_leads": {
                        "bsonType": "int",
                        "description": "Total leads for the month"
                    },
                    "total_views": {
                        "bsonType": "int",
                        "description": "Total views for the month"
                    },
                    "created_at": {
                        "bsonType": "date",
                        "description": "Timestamp when summary was created"
                    }
                }
            },
            "review_average": {
                "bsonType": "double",
                "description": "Average review rating out of 5",
                "minimum": 0,
                "maximum": 5
            },
            "created_at": {
                "bsonType": "date",
                "description": "Timestamp when document was created"
            },
            "updated_at": {
                "bsonType": "date",
                "description": "Timestamp when document was last updated"
            }
        }
    }


def get_lead_schema() -> Dict:
    return {
        "bsonType": "object",
        "required": ["email"],
        "properties": {
            "_id": {
                "bsonType": "objectId",
                "description": "Unique identifier for the lead"
            },
            "name": {
                "bsonType": "string",
                "description": "Name of the lead"
            },
            "email": {
                "bsonType": "string",
                "description": "Email address of the lead"
            },
            "mobile_number": {
                "bsonType": "string",
                "description": "Mobile number of the lead"
            },
            "wishlist": {
                "bsonType": "array",
                "description": "Array of farmhouse IDs in the user's wishlist",
                "items": {
                    "bsonType": "objectId"
                }
            }
        }
    }


def get_pending_reviews_schema():
    return {
        "bsonType": "object",
        "required": ["farmhouse_id", "reviewer_name", "rating", "review_comment"],
        "properties": {
            "_id": {
                "bsonType": "objectId",
                "description": "Unique identifier for the review"
            },
            "farmhouse_id": {
                "bsonType": "objectId",
                "description": "Reference to the farmhouse/property _id"
            },
            "reviewer_name": {
                "bsonType": "string",
                "description": "Name of the person who reviewed the farmhouse",
                "minLength": 2,
                "maxLength": 100
            },
            "review_comment": {
                "bsonType": "string",
                "description": "Review comment or feedback about the farmhouse",
                "minLength": 10,
            },
            "rating": {
                "bsonType": "number",
                "description": "Rating given by the reviewer (1-5 stars)",
                "minimum": 0,
                "maximum": 5
            }
        }
    }


def get_admin_analysis_schema():
    schema = {
        "bsonType": "object",
        "required": ["_id", "monthly_data", "last_month_top_properties", "created_at", "updated_at"],
        "properties": {
            "_id": {
                "bsonType": "string",
                "description": "Fixed ID: admin_analysis_singleton"
            },
            "monthly_data": {
                "bsonType": "array",
                "description": "Array of monthly metrics",
                "items": {
                    "bsonType": "object",
                    "required": ["month", "total_platform_leads", "total_platform_views", "new_properties_added"],
                    "properties": {
                        "month": {
                            "bsonType": "string",
                            "pattern": "^[0-9]{4}-[0-9]{2}$",
                            "description": "Month in YYYY-MM format"
                        },
                        "total_platform_leads": {
                            "bsonType": "int",
                            "minimum": 0,
                            "description": "Total platform leads for the month"
                        },
                        "total_platform_views": {
                            "bsonType": "int",
                            "minimum": 0,
                            "description": "Total platform views for the month"
                        },
                        "new_properties_added": {
                            "bsonType": "int",
                            "minimum": 0,
                            "description": "Number of new properties added in the month"
                        }
                    }
                }
            },
            "last_month_top_properties": {
                "bsonType": "array",
                "description": "Top 5 properties from last completed month",
                "items": {
                    "bsonType": "object",
                    "required": ["farmhouse_id", "name", "total_leads", "total_views"],
                    "properties": {
                        "farmhouse_id": {
                            "bsonType": "string",
                            "description": "Property ID"
                        },
                        "name": {
                            "bsonType": "string",
                            "description": "Property name"
                        },
                        "total_leads": {
                            "bsonType": "int",
                            "minimum": 0,
                            "description": "Total leads for this property"
                        },
                        "total_views": {
                            "bsonType": "int",
                            "minimum": 0,
                            "description": "Total views for this property"
                        }
                    }
                }
            },
            "created_at": {
                "bsonType": "date",
                "description": "Document creation timestamp"
            },
            "updated_at": {
                "bsonType": "date",
                "description": "Last update timestamp"
            }
        }
    }
    return schema
