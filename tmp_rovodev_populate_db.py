import random
import string
from datetime import datetime
from pymongo import MongoClient
MONGODB_URI = 'mongodb://localhost:27017/'
DATABASE_NAME = 'farmhouse_listing'

IMAGE_LINKS = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be", 
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
]

DOCUMENT_LINKS = [
    "https://www.orimi.com/pdf-test.pdf",                           # Sample PDF (test page)
    "https://example-files.online-convert.com/document/pdf/example.pdf",  # Example PDF content
    "https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf",     # Basic sample document
    "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf",      # Dummy PDF file from USDA
    "https://pdfobject.com/pdf/sample.pdf",                              # Simple sample PDF
    "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",  # 3-page sample document
    "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"  # Adobe sample
]


LOCATIONS = [
    {"address": "Village Bhiwadi, Near Highway", "pin_code": "301019"},
    {"address": "Sector 15, Gurgaon Hills", "pin_code": "122001"},
    {"address": "Manesar Industrial Area", "pin_code": "122051"},
    {"address": "Sohna Road, New Colony", "pin_code": "122103"},
    {"address": "Faridabad City Center", "pin_code": "121001"},
    {"address": "Village Kapashera, Border Road", "pin_code": "110037"},
    {"address": "Neemrana Fort City", "pin_code": "301705"},
    {"address": "Dharuhera Industrial Town", "pin_code": "123106"},
    {"address": "Rewari City, Main Road", "pin_code": "123401"},
    {"address": "Mahendragarh District", "pin_code": "123029"}
]

PROPERTY_WORDS = [
    "Cozy", "Luxury", "Peaceful", "Modern", "Traditional", "Scenic", "Private", 
    "Spacious", "Elegant", "Charming", "Beautiful", "Serene", "Comfortable", 
    "Premium", "Exclusive", "Heritage", "Contemporary", "Rustic", "Boutique", "Tranquil"
]

PROPERTY_TYPES_WORDS = [
    "Farmhouse", "Villa", "Cottage", "Retreat", "Haven", "Estate", "Manor", 
    "Lodge", "Resort", "Getaway", "Palace", "Mansion", "Bungalow", "Home"
]

DESCRIPTION_TEMPLATES = [
    "Experience the perfect blend of comfort and luxury at this stunning property. Nestled in a serene location, it offers breathtaking views and modern amenities for an unforgettable stay.",
    "Escape to this beautiful retreat where nature meets comfort. The property features spacious rooms, elegant interiors, and a peaceful environment perfect for relaxation.",
    "Discover your ideal getaway at this charming property. With its unique architecture and premium facilities, it provides the perfect setting for a memorable vacation.",
    "Immerse yourself in luxury at this exceptional property. From the moment you arrive, you'll be captivated by its beauty and the warm hospitality that awaits.",
    "Find your perfect sanctuary at this remarkable property. Offering a harmonious blend of traditional charm and modern conveniences for discerning guests."
]


def generate_random_string(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def generate_phone_number():
    return ''.join([str(random.randint(0, 9)) for _ in range(10)])


def generate_property_name():
    adjective = random.choice(PROPERTY_WORDS)
    property_type = random.choice(PROPERTY_TYPES_WORDS)
    number = random.randint(1, 999)
    return f"{adjective} {property_type} {number}"


def generate_description():
    base_description = random.choice(DESCRIPTION_TEMPLATES)
    additional_features = [
        "The property boasts modern amenities and traditional charm.",
        "Guests can enjoy outdoor activities and peaceful surroundings.",
        "Perfect for family gatherings and corporate retreats.",
        "Located in a prime area with easy access to local attractions.",
        "Featuring spacious rooms and beautiful garden areas."
    ]
    
    extra_feature = random.choice(additional_features)
    full_description = f"{base_description} {extra_feature}"
    
    word_count = random.randint(15, 40)
    words = full_description.split()
    if len(words) > word_count:
        full_description = ' '.join(words[:word_count])
    
    return full_description


def generate_random_amenities():
    amenities = {
        "core_amenities": {},
        "bedroom_bathroom": {},
        "outdoor_garden": {},
        "food_dining": {},
        "entertainment_activities": {},
        "pet_family_friendly": {},
        "safety_security": {},
        "experience_luxury_addons": {},
        "house_rules_services": {}
    }
    
    core_amenities_keys = [
        "air_conditioning", "wifi_internet", "power_backup", "parking", "refrigerator",
        "microwave", "cooking_basics", "drinking_water", "washing_machine", "iron",
        "geyser_hot_water", "television", "smart_tv_ott", "wardrobe", 
        "extra_mattress_bedding", "cleaning_supplies"
    ]
    
    bedroom_bathroom_keys = [
        "bed_linens", "towels", "toiletries", "mirror", "hair_dryer", 
        "attached_bathrooms", "bathtub"
    ]
    
    outdoor_garden_keys = [
        "private_lawn_garden", "swimming_pool", "outdoor_seating_area", 
        "bonfire_setup", "barbecue_setup", "terrace_balcony"
    ]
    
    food_dining_keys = [
        "kitchen_access_self_cooking", "in_house_meals_available", "dining_table"
    ]
    
    entertainment_activities_keys = [
        "indoor_games", "outdoor_games", "pool_table", "music_system", 
        "board_games", "bicycle_access", "movie_projector"
    ]
    
    pet_family_friendly_keys = [
        "pet_friendly", "child_friendly", "kids_play_area", "fenced_property"
    ]
    
    safety_security_keys = [
        "cctv_cameras", "first_aid_kit", "fire_extinguisher", "security_guard", 
        "private_gate_compound_wall"
    ]
    
    experience_luxury_addons_keys = [
        "jacuzzi", "private_bar_setup", "farm_view_nature_view", 
        "open_shower_outdoor_bath", "gazebo_cabana_seating", "hammock", 
        "high_tea_setup", "event_space_small_gatherings", "private_chef_on_request"
    ]
    
    house_rules_services_keys = [
        "daily_cleaning_available", "long_stays_allowed", 
        "early_check_in_late_check_out", "staff_quarters_available", "caretaker_on_site"
    ]
    
    for key in core_amenities_keys:
        amenities["core_amenities"][key] = random.choice([True, False])
    
    for key in bedroom_bathroom_keys:
        amenities["bedroom_bathroom"][key] = random.choice([True, False])
    
    amenities["bedroom_bathroom"]["bedrooms"] = random.randint(1, 6)
    amenities["bedroom_bathroom"]["bathrooms"] = random.randint(1, 4)
    amenities["bedroom_bathroom"]["beds"] = random.randint(1, 8)
    
    for key in outdoor_garden_keys:
        amenities["outdoor_garden"][key] = random.choice([True, False])
    
    for key in food_dining_keys:
        amenities["food_dining"][key] = random.choice([True, False])
    
    for key in entertainment_activities_keys:
        amenities["entertainment_activities"][key] = random.choice([True, False])
    
    for key in pet_family_friendly_keys:
        amenities["pet_family_friendly"][key] = random.choice([True, False])
    
    for key in safety_security_keys:
        amenities["safety_security"][key] = random.choice([True, False])
    
    for key in experience_luxury_addons_keys:
        amenities["experience_luxury_addons"][key] = random.choice([True, False])
    
    for key in house_rules_services_keys:
        amenities["house_rules_services"][key] = random.choice([True, False])
    
    return amenities


def generate_random_documents():
    aadhar_doc = random.choice(DOCUMENT_LINKS[:2])
    pan_doc = random.choice(DOCUMENT_LINKS[2:4])
    property_docs = random.sample(DOCUMENT_LINKS[4:], random.randint(1, 3))
    
    return {
        "aadhar_card": aadhar_doc,
        "pan_card": pan_doc,
        "property_docs": property_docs
    }


def generate_random_images():
    num_images = random.randint(3, 7)
    return random.sample(IMAGE_LINKS, num_images)


def generate_farmhouse_data():
    property_name = generate_property_name()
    property_description = generate_description()
    property_type = random.choice(["farmhouse", "bnb"])
    phone_number = generate_phone_number()
    location = random.choice(LOCATIONS)
    documents = generate_random_documents()
    images = generate_random_images()
    amenities = generate_random_amenities()
    credit_balance = random.randint(500, 5000)
    current_time = datetime.now()
    
    farmhouse_data = {
        "name": property_name,
        "description": property_description,
        "type": property_type,
        "phone_number": phone_number,
        "location": location,
        "documents": documents,
        "booked_dates": [],
        "images": images,
        "amenities": amenities,
        "credit_balance": credit_balance,
        "status": "active",
        "favourite": random.choice([True, False]),
        "created_at": current_time,
        "updated_at": current_time
    }
    
    return farmhouse_data


def populate_farmhouses_collection():
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    farmhouses_collection = db.farmhouses
    
    farmhouses_data = []
    for i in range(20):
        farmhouse_data = generate_farmhouse_data()
        farmhouses_data.append(farmhouse_data)
        print(f"Generated farmhouse {i+1}: {farmhouse_data['name']}")
    
    result = farmhouses_collection.insert_many(farmhouses_data)
    inserted_count = len(result.inserted_ids)
    
    print(f"\nSuccessfully inserted {inserted_count} farmhouses into the database!")
    return True


if __name__ == "__main__":
    success = populate_farmhouses_collection()
    if success:
        print("Database population completed successfully!")
    else:
        print("Failed to populate database!")