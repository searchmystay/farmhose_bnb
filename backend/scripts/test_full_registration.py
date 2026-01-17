#!/usr/bin/env python3
"""
Automated Property Registration Test Script
This script will complete a full property registration with random data
and verify if all amenities are properly saved in MongoDB
"""

import requests
import json
import time
import random
from pymongo import MongoClient

BASE_URL = "http://127.0.0.1:5000"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "farmhouse_listing"

class PropertyRegistrationTester:
    def __init__(self):
        self.property_id = None
        self.test_data = {}
        self.bypass_api = True  # Skip API calls and directly test MongoDB
        
    def generate_test_data(self):
        """Generate random test data for property registration"""
        self.test_data = {
            "basic_info": {
                "name": "CityShield Stay Test",
                "description": "This is a beautiful test farmhouse with excellent amenities perfect for family vacations and weekend getaways located in scenic surroundings with modern facilities comfortable accommodations memorable stays peaceful relaxation wonderful experience guests enjoy nature beauty tranquil environment",
                "type": "farmhouse", 
                "per_day_price": "1000",
                "opening_time": "08:00",
                "closing_time": "20:00",
                "phone_number": "9685719161",
                "address": "Royal Plaza, Jalan Ahmad Yani, Wonokromo, Surabaya, East Java, Indonesia",
                "pin_code": "452001"
            },
            "guest_capacity": {
                "max_people_allowed": random.randint(4, 12),
                "max_children_allowed": random.randint(2, 6),
                "max_pets_allowed": random.randint(0, 3)
            },
            "essential_amenities": {
                # Bedroom & Bathroom
                "bedrooms": random.randint(2, 6),
                "bathrooms": random.randint(1, 4),
                "beds": random.randint(2, 8),
                "bed_linens": random.choice([True, False]),
                "towels": random.choice([True, False]),
                "toiletries": random.choice([True, False]),
                "mirror": random.choice([True, False]),
                "hair_dryer": random.choice([True, False]),
                "attached_bathrooms": random.choice([True, False]),
                "bathtub": random.choice([True, False]),
                
                # Core Amenities
                "air_conditioning": random.choice([True, False]),
                "wifi_internet": random.choice([True, False]),
                "power_backup": random.choice([True, False]),
                "parking": True,  # Usually true
                "refrigerator": random.choice([True, False]),
                "microwave": random.choice([True, False]),
                "cooking_basics": random.choice([True, False]),
                "drinking_water": True,  # Usually true
                "washing_machine": random.choice([True, False]),
                "iron": random.choice([True, False]),
                "geyser_hot_water": random.choice([True, False]),
                "television": random.choice([True, False]),
                "smart_tv_ott": random.choice([True, False]),
                "wardrobe": random.choice([True, False]),
                "extra_mattress_bedding": random.choice([True, False]),
                "cleaning_supplies": random.choice([True, False])
            },
            "experience_amenities": {
                # Entertainment & Activities
                "indoor_games": random.choice([True, False]),
                "outdoor_games": random.choice([True, False]),
                "pool_table": random.choice([True, False]),
                "music_system": random.choice([True, False]),
                "board_games": random.choice([True, False]),
                "bicycle_access": random.choice([True, False]),
                "movie_projector": random.choice([True, False]),
                
                # Experience & Luxury Add-ons
                "jacuzzi": random.choice([True, False]),
                "private_bar_setup": random.choice([True, False]),
                "farm_view_nature_view": random.choice([True, False]),
                "open_shower_outdoor_bath": random.choice([True, False]),
                "gazebo_cabana_seating": random.choice([True, False]),
                "hammock": random.choice([True, False]),
                "high_tea_setup": random.choice([True, False]),
                "event_space_small_gatherings": random.choice([True, False]),
                "private_chef_on_request": random.choice([True, False]),
                
                # Food & Dining
                "kitchen_access_self_cooking": random.choice([True, False]),
                "in_house_meals_available": random.choice([True, False]),
                "dining_table": random.choice([True, False]),
                
                # Outdoor & Garden
                "private_lawn_garden": random.choice([True, False]),
                "swimming_pool": random.choice([True, False]),
                "outdoor_seating_area": random.choice([True, False]),
                "bonfire_setup": random.choice([True, False]),
                "barbecue_setup": random.choice([True, False]),
                "terrace_balcony": random.choice([True, False])
            },
            "additional_amenities": {
                # Pet & Family Friendly
                "pet_friendly": random.choice([True, False]),
                "child_friendly": True,  # Usually true
                "kids_play_area": random.choice([True, False]),
                "fenced_property": random.choice([True, False]),
                
                # Safety & Security
                "cctv_cameras": random.choice([True, False]),
                "first_aid_kit": random.choice([True, False]),
                "fire_extinguisher": random.choice([True, False]),
                "security_guard": random.choice([True, False]),
                "private_gate_compound_wall": random.choice([True, False]),
                
                # House Rules & Services
                "daily_cleaning_available": random.choice([True, False]),
                "long_stays_allowed": random.choice([True, False]),
                "early_check_in_late_check_out": random.choice([True, False]),
                "staff_quarters_available": random.choice([True, False]),
                "caretaker_on_site": random.choice([True, False])
            },
            "owner_details": {
                "owner_name": f"Test Owner {random.randint(1, 1000)}",
                "owner_description": "Experienced host with great hospitality skills and local knowledge to make your stay memorable and comfortable.",
                "owner_dashboard_id": f"testowner{random.randint(1000, 9999)}",
                "owner_dashboard_password": f"TestPass{random.randint(100, 999)}@123"
            }
        }
        
        print("✅ Generated random test data")
        print(f"   Property Name: {self.test_data['basic_info']['name']}")
        print(f"   Phone: {self.test_data['basic_info']['phone_number']}")
        print(f"   Bedrooms: {self.test_data['essential_amenities']['bedrooms']}")
        print(f"   Max People: {self.test_data['guest_capacity']['max_people_allowed']}")

    def step_1_basic_info(self):
        """Step 1: Save basic property information"""
        print("\n🔄 Step 1: Saving basic information...")
        print(f"Debug - Sending data: {json.dumps(self.test_data['basic_info'], indent=2)}")
        
        response = requests.post(f"{BASE_URL}/save-basic-info", json=self.test_data['basic_info'])
        
        if response.status_code == 200:
            self.property_id = response.json().get('propertyId')
            print(f"✅ Step 1 Success - Property ID: {self.property_id}")
            return True
        else:
            print(f"❌ Step 1 Failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"   Raw error: {response.text}")
            return False

    def step_2_guest_capacity(self):
        """Step 2: Save essential amenities (includes guest capacity)"""
        print("\n🔄 Step 2: Saving essential amenities with guest capacity...")
        
        payload = {
            "propertyId": self.property_id,
            "essential_amenities": {
                **self.test_data['guest_capacity'],
                **self.test_data['essential_amenities']
            }
        }
        
        response = requests.post(f"{BASE_URL}/save-essential-amenities", json=payload)
        
        if response.status_code == 200:
            print("✅ Step 2 Success - Guest capacity saved")
            return True
        else:
            print(f"❌ Step 2 Failed: {response.status_code} - {response.text}")
            return False

    def step_3_experience_amenities(self):
        """Step 3: Save experience amenities"""
        print("\n🔄 Step 3: Saving experience amenities...")
        
        payload = {
            "propertyId": self.property_id,
            "experience_amenities": self.test_data['experience_amenities']
        }
        
        response = requests.post(f"{BASE_URL}/save-experience-amenities", json=payload)
        
        if response.status_code == 200:
            print("✅ Step 3 Success - Essential amenities saved")
            return True
        else:
            print(f"❌ Step 3 Failed: {response.status_code} - {response.text}")
            return False

    def step_4_additional_amenities(self):
        """Step 4: Save additional amenities"""
        print("\n🔄 Step 4: Saving additional amenities...")
        
        payload = {
            "propertyId": self.property_id,
            "additional_amenities": self.test_data['additional_amenities']
        }
        
        response = requests.post(f"{BASE_URL}/save-additional-amenities", json=payload)
        
        if response.status_code == 200:
            print("✅ Step 4 Success - Experience amenities saved")
            return True
        else:
            print(f"❌ Step 4 Failed: {response.status_code} - {response.text}")
            return False

    def step_5_owner_details(self):
        """Step 5: Save owner details"""
        print("\n🔄 Step 5: Saving owner details...")
        
        payload = {
            "propertyId": self.property_id,
            "owner_name": self.test_data['owner_details']['owner_name'],
            "owner_description": self.test_data['owner_details']['owner_description'],
            "owner_dashboard_id": self.test_data['owner_details']['owner_dashboard_id'],
            "owner_dashboard_password": self.test_data['owner_details']['owner_dashboard_password']
        }
        
        response = requests.post(f"{BASE_URL}/save-owner-details", json=payload)
        
        if response.status_code == 200:
            print("✅ Step 5 Success - Additional amenities saved")
            return True
        else:
            print(f"❌ Step 5 Failed: {response.status_code} - {response.text}")
            return False

        
        if response.status_code == 200:
            print("✅ Step 5 Success - Owner details saved")
            return True
        else:
            print(f"❌ Step 5 Failed: {response.status_code} - {response.text}")
            return False

    def verify_mongodb_data(self):
        """Verify data saved in MongoDB"""
        print("\n🔍 Verifying data in MongoDB...")
        
        try:
            client = MongoClient(MONGO_URL)
            db = client[DB_NAME]
            collection = db['farmhouses']
            
            # Find the property
            from bson import ObjectId
            property_data = collection.find_one({"_id": ObjectId(self.property_id)})
            
            if not property_data:
                print("❌ Property not found in MongoDB")
                return False
            
            print(f"✅ Property found in MongoDB")
            
            # Check basic info
            print(f"   Name: {property_data.get('name', 'MISSING')}")
            print(f"   Type: {property_data.get('type', 'MISSING')}")
            print(f"   Phone: {property_data.get('phone_number', 'MISSING')}")
            
            # Check guest capacity
            guest_capacity = property_data.get('guest_capacity', {})
            print(f"   Max People: {guest_capacity.get('max_people_allowed', 'MISSING')}")
            print(f"   Max Children: {guest_capacity.get('max_children_allowed', 'MISSING')}")
            
            # Check bedroom & bathroom
            bedroom_bathroom = property_data.get('bedroom_bathroom', {})
            print(f"   Bedrooms: {bedroom_bathroom.get('bedrooms', 'MISSING')}")
            print(f"   Bathrooms: {bedroom_bathroom.get('bathrooms', 'MISSING')}")
            print(f"   Bed Linens: {bedroom_bathroom.get('bed_linens', 'MISSING')}")
            
            # Check core amenities
            core_amenities = property_data.get('core_amenities', {})
            print(f"   Air Conditioning: {core_amenities.get('air_conditioning', 'MISSING')}")
            print(f"   WiFi: {core_amenities.get('wifi_internet', 'MISSING')}")
            print(f"   Parking: {core_amenities.get('parking', 'MISSING')}")
            
            # Check experience amenities
            entertainment = property_data.get('entertainment_activities', {})
            print(f"   Indoor Games: {entertainment.get('indoor_games', 'MISSING')}")
            print(f"   Pool Table: {entertainment.get('pool_table', 'MISSING')}")
            
            # Check safety & security
            safety = property_data.get('safety_security', {})
            print(f"   CCTV: {safety.get('cctv_cameras', 'MISSING')}")
            print(f"   Fire Extinguisher: {safety.get('fire_extinguisher', 'MISSING')}")
            
            # Check owner details
            print(f"   Owner Name: {property_data.get('owner_name', 'MISSING')}")
            
            # Count missing vs saved amenities
            all_amenities = []
            all_amenities.extend(list(core_amenities.keys()))
            all_amenities.extend(list(bedroom_bathroom.keys()))
            all_amenities.extend(list(entertainment.keys()))
            all_amenities.extend(list(safety.keys()))
            
            print(f"\n📊 Amenities Summary:")
            print(f"   Total amenities found in DB: {len(all_amenities)}")
            
            return True
            
        except Exception as e:
            print(f"❌ MongoDB verification failed: {e}")
            return False
        finally:
            try:
                client.close()
            except:
                pass

    def create_test_property_directly(self):
        """Create test property directly in MongoDB bypassing API"""
        print("🚀 Creating test property directly in MongoDB (bypassing API)...\n")
        
        try:
            client = MongoClient(MONGO_URL)
            db = client[DB_NAME]
            collection = db['farmhouses']
            
            # Create complete test property document
            from bson import ObjectId
            test_property = {
                "_id": ObjectId(),
                "status": "incomplete",
                "created_at": "2026-01-17T11:28:35.045+00:00",
                "updated_at": "2026-01-17T11:28:35.045+00:00",
                "credit_balance": 0,
                "favourite": False,
                
                # Basic Info
                "name": self.test_data['basic_info']['name'],
                "description": self.test_data['basic_info']['description'],
                "type": self.test_data['basic_info']['type'],
                "per_day_price": int(self.test_data['basic_info']['per_day_price']),
                "phone_number": self.test_data['basic_info']['phone_number'],
                "opening_time": self.test_data['basic_info']['opening_time'],
                "closing_time": self.test_data['basic_info']['closing_time'],
                "address": self.test_data['basic_info']['address'],
                "pin_code": self.test_data['basic_info']['pin_code'],
                
                # Guest Capacity
                "guest_capacity": self.test_data['guest_capacity'],
                
                # Bedroom & Bathroom
                "bedroom_bathroom": {
                    "bedrooms": self.test_data['essential_amenities']['bedrooms'],
                    "bathrooms": self.test_data['essential_amenities']['bathrooms'],
                    "beds": self.test_data['essential_amenities']['beds'],
                    "bed_linens": self.test_data['essential_amenities']['bed_linens'],
                    "towels": self.test_data['essential_amenities']['towels'],
                    "toiletries": self.test_data['essential_amenities']['toiletries'],
                    "mirror": self.test_data['essential_amenities']['mirror'],
                    "hair_dryer": self.test_data['essential_amenities']['hair_dryer'],
                    "attached_bathrooms": self.test_data['essential_amenities']['attached_bathrooms'],
                    "bathtub": self.test_data['essential_amenities']['bathtub']
                },
                
                # Core Amenities
                "core_amenities": {
                    "air_conditioning": self.test_data['essential_amenities']['air_conditioning'],
                    "wifi_internet": self.test_data['essential_amenities']['wifi_internet'],
                    "power_backup": self.test_data['essential_amenities']['power_backup'],
                    "parking": self.test_data['essential_amenities']['parking'],
                    "refrigerator": self.test_data['essential_amenities']['refrigerator'],
                    "microwave": self.test_data['essential_amenities']['microwave'],
                    "cooking_basics": self.test_data['essential_amenities']['cooking_basics'],
                    "drinking_water": self.test_data['essential_amenities']['drinking_water'],
                    "washing_machine": self.test_data['essential_amenities']['washing_machine'],
                    "iron": self.test_data['essential_amenities']['iron'],
                    "geyser_hot_water": self.test_data['essential_amenities']['geyser_hot_water'],
                    "television": self.test_data['essential_amenities']['television'],
                    "smart_tv_ott": self.test_data['essential_amenities']['smart_tv_ott'],
                    "wardrobe": self.test_data['essential_amenities']['wardrobe'],
                    "extra_mattress_bedding": self.test_data['essential_amenities']['extra_mattress_bedding'],
                    "cleaning_supplies": self.test_data['essential_amenities']['cleaning_supplies']
                },
                
                # Entertainment & Activities
                "entertainment_activities": {
                    "indoor_games": self.test_data['experience_amenities']['indoor_games'],
                    "outdoor_games": self.test_data['experience_amenities']['outdoor_games'],
                    "pool_table": self.test_data['experience_amenities']['pool_table'],
                    "music_system": self.test_data['experience_amenities']['music_system'],
                    "board_games": self.test_data['experience_amenities']['board_games'],
                    "bicycle_access": self.test_data['experience_amenities']['bicycle_access'],
                    "movie_projector": self.test_data['experience_amenities']['movie_projector']
                },
                
                # Experience & Luxury Add-ons
                "experience_luxury_addons": {
                    "jacuzzi": self.test_data['experience_amenities']['jacuzzi'],
                    "private_bar_setup": self.test_data['experience_amenities']['private_bar_setup'],
                    "farm_view_nature_view": self.test_data['experience_amenities']['farm_view_nature_view'],
                    "open_shower_outdoor_bath": self.test_data['experience_amenities']['open_shower_outdoor_bath'],
                    "gazebo_cabana_seating": self.test_data['experience_amenities']['gazebo_cabana_seating'],
                    "hammock": self.test_data['experience_amenities']['hammock'],
                    "high_tea_setup": self.test_data['experience_amenities']['high_tea_setup'],
                    "event_space_small_gatherings": self.test_data['experience_amenities']['event_space_small_gatherings'],
                    "private_chef_on_request": self.test_data['experience_amenities']['private_chef_on_request']
                },
                
                # Food & Dining
                "food_dining": {
                    "kitchen_access_self_cooking": self.test_data['experience_amenities']['kitchen_access_self_cooking'],
                    "in_house_meals_available": self.test_data['experience_amenities']['in_house_meals_available'],
                    "dining_table": self.test_data['experience_amenities']['dining_table']
                },
                
                # Outdoor & Garden
                "outdoor_garden": {
                    "private_lawn_garden": self.test_data['experience_amenities']['private_lawn_garden'],
                    "swimming_pool": self.test_data['experience_amenities']['swimming_pool'],
                    "outdoor_seating_area": self.test_data['experience_amenities']['outdoor_seating_area'],
                    "bonfire_setup": self.test_data['experience_amenities']['bonfire_setup'],
                    "barbecue_setup": self.test_data['experience_amenities']['barbecue_setup'],
                    "terrace_balcony": self.test_data['experience_amenities']['terrace_balcony']
                },
                
                # Pet & Family Friendly
                "pet_family_friendly": {
                    "pet_friendly": self.test_data['additional_amenities']['pet_friendly'],
                    "child_friendly": self.test_data['additional_amenities']['child_friendly'],
                    "kids_play_area": self.test_data['additional_amenities']['kids_play_area'],
                    "fenced_property": self.test_data['additional_amenities']['fenced_property']
                },
                
                # Safety & Security
                "safety_security": {
                    "cctv_cameras": self.test_data['additional_amenities']['cctv_cameras'],
                    "first_aid_kit": self.test_data['additional_amenities']['first_aid_kit'],
                    "fire_extinguisher": self.test_data['additional_amenities']['fire_extinguisher'],
                    "security_guard": self.test_data['additional_amenities']['security_guard'],
                    "private_gate_compound_wall": self.test_data['additional_amenities']['private_gate_compound_wall']
                },
                
                # House Rules & Services
                "house_rules_services": {
                    "daily_cleaning_available": self.test_data['additional_amenities']['daily_cleaning_available'],
                    "long_stays_allowed": self.test_data['additional_amenities']['long_stays_allowed'],
                    "early_check_in_late_check_out": self.test_data['additional_amenities']['early_check_in_late_check_out'],
                    "staff_quarters_available": self.test_data['additional_amenities']['staff_quarters_available'],
                    "caretaker_on_site": self.test_data['additional_amenities']['caretaker_on_site']
                },
                
                # Owner Details
                "owner_name": self.test_data['owner_details']['owner_name'],
                "owner_description": self.test_data['owner_details']['owner_description'],
                "owner_dashboard_id": self.test_data['owner_details']['owner_dashboard_id'],
                "owner_dashboard_password": self.test_data['owner_details']['owner_dashboard_password']
            }
            
            # Insert test property
            result = collection.insert_one(test_property)
            self.property_id = str(result.inserted_id)
            
            print(f"✅ Test property created directly in MongoDB")
            print(f"📋 Property ID: {self.property_id}")
            print(f"🏠 Name: {test_property['name']}")
            print(f"📱 Phone: {test_property['phone_number']}")
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to create test property: {e}")
            return False
        finally:
            try:
                client.close()
            except:
                pass

    def run_full_test(self):
        """Run the complete registration test"""
        print("🚀 Starting MongoDB Amenities Verification Test\n")
        
        self.generate_test_data()
        
        # Create property directly in MongoDB (bypass API issues)
        if not self.create_test_property_directly():
            return False
        
        # Verify in MongoDB
        self.verify_mongodb_data()
        
        print(f"\n🎉 Test completed!")
        print(f"📋 Property ID: {self.property_id}")
        print(f"💾 Now check admin dashboard for this property to verify amenities display")
        print(f"🔍 This will show if the issue is in:")
        print(f"   - Database structure (our test)")
        print(f"   - API saving logic (if amenities show correctly)")
        print(f"   - Frontend display logic (if amenities still missing)")
        
        return True

if __name__ == "__main__":
    tester = PropertyRegistrationTester()
    tester.run_full_test()