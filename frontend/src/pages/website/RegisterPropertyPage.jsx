import React, { useState } from 'react';

const RegisterPropertyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    type: 'farmhouse',
    phone_number: '',
    address: '',
    pin_code: ''
  });
  const [essentialAmenities, setEssentialAmenities] = useState({
    air_conditioning: false,
    wifi_internet: false,
    power_backup: false,
    parking: false,
    refrigerator: false,
    microwave: false,
    cooking_basics: false,
    drinking_water: false,
    washing_machine: false,
    iron: false,
    geyser_hot_water: false,
    television: false,
    smart_tv_ott: false,
    wardrobe: false,
    extra_mattress_bedding: false,
    cleaning_supplies: false,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    bed_linens: false,
    towels: false,
    toiletries: false,
    mirror: false,
    hair_dryer: false,
    attached_bathrooms: false,
    bathtub: false
  });

  const [experienceAmenities, setExperienceAmenities] = useState({
    private_lawn_garden: false,
    swimming_pool: false,
    outdoor_seating_area: false,
    bonfire_setup: false,
    barbecue_setup: false,
    terrace_balcony: false,
    kitchen_access_self_cooking: false,
    in_house_meals_available: false,
    dining_table: false,
    indoor_games: false,
    outdoor_games: false,
    pool_table: false,
    music_system: false,
    board_games: false,
    bicycle_access: false,
    movie_projector: false,
    jacuzzi: false,
    private_bar_setup: false,
    farm_view_nature_view: false,
    open_shower_outdoor_bath: false,
    gazebo_cabana_seating: false,
    hammock: false,
    high_tea_setup: false,
    event_space_small_gatherings: false,
    private_chef_on_request: false
  });

  const [additionalAmenities, setAdditionalAmenities] = useState({
    pet_friendly: false,
    child_friendly: false,
    kids_play_area: false,
    fenced_property: false,
    cctv_cameras: false,
    first_aid_kit: false,
    fire_extinguisher: false,
    security_guard: false,
    private_gate_compound_wall: false,
    daily_cleaning_available: false,
    long_stays_allowed: false,
    early_check_in_late_check_out: false,
    staff_quarters_available: false,
    caretaker_on_site: false
  });

  // Handle input changes for basic info
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle boolean toggle changes for amenities
  const handleEssentialToggleChange = (name) => {
    setEssentialAmenities(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleExperienceToggleChange = (name) => {
    setExperienceAmenities(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleAdditionalToggleChange = (name) => {
    setAdditionalAmenities(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Handle number input changes for amenities
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setEssentialAmenities(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  // Handle step 1 next button
  const handleStep1Next = (e) => {
    e.preventDefault();
    console.log('Basic Info:', basicInfo);
    setCurrentStep(2);
  };

  // Handle step 2 next button
  const handleStep2Next = (e) => {
    e.preventDefault();
    console.log('Essential Amenities:', essentialAmenities);
    setCurrentStep(3);
  };

  const handleStep3Next = (e) => {
    e.preventDefault();
    console.log('Experience Amenities:', experienceAmenities);
    setCurrentStep(4);
  };

  const handleStep4Submit = (e) => {
    e.preventDefault();
    console.log('Additional Amenities:', additionalAmenities);
    console.log('All Form Data:', {
      basicInfo,
      essentialAmenities,
      experienceAmenities,
      additionalAmenities
    });
  };

  // Handle previous button
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render the process explanation section
  const renderProcessExplanation = () => (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        How Registration Works
      </h2>
      <p className="text-gray-600 leading-relaxed">
        Fill in your property details correctly. Our team will verify the information 
        and approve your listing. Once verified, your property will be live on our platform.
      </p>
    </div>
  );

  // Render the progress indicator
  const renderProgressIndicator = () => {
    const progressPercent = (currentStep / 4) * 100;
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep} of 4</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-300" 
               style={{width: `${progressPercent}%`}}></div>
        </div>
      </div>
    );
  };

  // Render number input field for amenities
  const renderNumberInput = (name, label, min = 0, max = 20) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={essentialAmenities[name]}
        onChange={handleNumberChange}
        min={min}
        max={max}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-lg font-medium"
      />
    </div>
  );

  // Render toggle switch for amenities
  const renderToggleSwitch = (name, label, description) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => handleEssentialToggleChange(name)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          essentialAmenities[name] ? 'bg-green-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            essentialAmenities[name] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Render step 1: basic information form
  const renderStep1BasicInfo = () => (
    <form onSubmit={handleStep1Next} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Name
        </label>
        <input
          type="text"
          name="name"
          value={basicInfo.name}
          onChange={handleBasicInfoChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="Enter your property name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={basicInfo.description}
          onChange={handleBasicInfoChange}
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
          placeholder="Describe your property in detail..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          name="type"
          value={basicInfo.type}
          onChange={handleBasicInfoChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        >
          <option value="farmhouse">Farmhouse</option>
          <option value="bnb">Bed and breakfast (BnB)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <p className="text-sm text-gray-500 mb-2">WhatsApp should be available on this number</p>
        <div className="flex">
          <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
            +91
          </span>
          <input
            type="tel"
            name="phone_number"
            value={basicInfo.phone_number}
            onChange={handleBasicInfoChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Enter your phone number"
            maxLength="10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={basicInfo.address}
          onChange={handleBasicInfoChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="Enter your property address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pin Code
        </label>
        <input
          type="text"
          name="pin_code"
          value={basicInfo.pin_code}
          onChange={handleBasicInfoChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="Enter pin code"
          maxLength="6"
          pattern="[0-9]{6}"
        />
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
        >
          Next Step
        </button>
      </div>
    </form>
  );

  // Render step 2: essential amenities
  const renderStep2EssentialAmenities = () => (
    <form onSubmit={handleStep2Next} className="space-y-12">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Core Amenities</h2>
          <p className="text-gray-600">Essential facilities and services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggleSwitch('air_conditioning', 'Air Conditioning', 'Temperature control system')}
          {renderToggleSwitch('wifi_internet', 'Wi-Fi Internet', 'Internet connection for guests')}
          {renderToggleSwitch('power_backup', 'Power Backup', 'Inverter or generator during outages')}
          {renderToggleSwitch('parking', 'Parking', 'Free or private parking space')}
          {renderToggleSwitch('refrigerator', 'Refrigerator', 'For storing food and beverages')}
          {renderToggleSwitch('microwave', 'Microwave', 'For heating and cooking food')}
          {renderToggleSwitch('cooking_basics', 'Cooking Basics', 'Utensils, oil, salt and spices')}
          {renderToggleSwitch('drinking_water', 'Drinking Water', 'Clean water supply')}
          {renderToggleSwitch('washing_machine', 'Washing Machine', 'For laundry needs')}
          {renderToggleSwitch('iron', 'Iron & Board', 'For clothing care')}
          {renderToggleSwitch('geyser_hot_water', 'Hot Water', 'Geyser for bathing and washing')}
          {renderToggleSwitch('television', 'Television', 'For entertainment')}
          {renderToggleSwitch('smart_tv_ott', 'Smart TV with OTT', 'Netflix, Prime, etc.')}
          {renderToggleSwitch('wardrobe', 'Wardrobe', 'Closet space for clothes')}
          {renderToggleSwitch('extra_mattress_bedding', 'Extra Bedding', 'Additional mattress and bedding')}
          {renderToggleSwitch('cleaning_supplies', 'Cleaning Supplies', 'Cleaning materials provided')}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bedroom & Bathroom</h2>
          <p className="text-gray-600">Room details and bathroom amenities</p>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          {renderNumberInput('bedrooms', 'Bedrooms', 1, 10)}
          {renderNumberInput('bathrooms', 'Bathrooms', 1, 10)}
          {renderNumberInput('beds', 'Beds', 1, 20)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggleSwitch('bed_linens', 'Bed Linens', 'Fresh sheets, pillowcases and blankets')}
          {renderToggleSwitch('towels', 'Towels', 'Clean towels for bathing')}
          {renderToggleSwitch('toiletries', 'Toiletries', 'Soap, shampoo, toothpaste')}
          {renderToggleSwitch('mirror', 'Mirror', 'For grooming in bathroom/bedroom')}
          {renderToggleSwitch('hair_dryer', 'Hair Dryer', 'For drying hair after bath')}
          {renderToggleSwitch('attached_bathrooms', 'Attached Bathrooms', 'Private bathrooms with bedrooms')}
          {renderToggleSwitch('bathtub', 'Bathtub', 'For relaxing baths')}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={handlePrevious}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
        >
          Next Step
        </button>
      </div>
    </form>
  );

  const renderExperienceToggleSwitch = (name, label, description) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => handleExperienceToggleChange(name)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          experienceAmenities[name] ? 'bg-green-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            experienceAmenities[name] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderStep3ExperienceAmenities = () => (
    <form onSubmit={handleStep3Next} className="space-y-12">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Outdoor & Garden</h2>
          <p className="text-gray-600">Outdoor spaces and garden facilities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderExperienceToggleSwitch('private_lawn_garden', 'Private Lawn/Garden', 'Private outdoor space for relaxation')}
          {renderExperienceToggleSwitch('swimming_pool', 'Swimming Pool', 'Pool for recreation and exercise')}
          {renderExperienceToggleSwitch('outdoor_seating_area', 'Outdoor Seating', 'Chairs and tables for outdoor relaxation')}
          {renderExperienceToggleSwitch('bonfire_setup', 'Bonfire Setup', 'Area for evening gatherings and warmth')}
          {renderExperienceToggleSwitch('barbecue_setup', 'Barbecue Setup', 'Outdoor cooking and grilling area')}
          {renderExperienceToggleSwitch('terrace_balcony', 'Terrace/Balcony', 'Outdoor views and fresh air space')}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Food & Dining</h2>
          <p className="text-gray-600">Cooking and dining facilities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderExperienceToggleSwitch('kitchen_access_self_cooking', 'Kitchen Access', 'Self-cooking facilities available')}
          {renderExperienceToggleSwitch('in_house_meals_available', 'In-house Meals', 'Meals provided by the property')}
          {renderExperienceToggleSwitch('dining_table', 'Dining Table', 'Comfortable eating space')}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Entertainment & Activities</h2>
          <p className="text-gray-600">Games and recreational activities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderExperienceToggleSwitch('indoor_games', 'Indoor Games', 'Carrom, chess, ludo for entertainment')}
          {renderExperienceToggleSwitch('outdoor_games', 'Outdoor Games', 'Cricket, badminton, football available')}
          {renderExperienceToggleSwitch('pool_table', 'Pool Table', 'Billiards for recreational gaming')}
          {renderExperienceToggleSwitch('music_system', 'Music System', 'Speakers for playing music')}
          {renderExperienceToggleSwitch('board_games', 'Board Games', 'Group entertainment and fun')}
          {renderExperienceToggleSwitch('bicycle_access', 'Bicycle Access', 'Bikes for exploring and exercise')}
          {renderExperienceToggleSwitch('movie_projector', 'Movie Projector', 'Watching films and entertainment')}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Experience & Luxury Add-ons</h2>
          <p className="text-gray-600">Premium experiences and luxury amenities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderExperienceToggleSwitch('jacuzzi', 'Jacuzzi', 'Luxury relaxation and therapeutic bathing')}
          {renderExperienceToggleSwitch('private_bar_setup', 'Private Bar Setup', 'Drinks and cocktail preparation area')}
          {renderExperienceToggleSwitch('farm_view_nature_view', 'Farm/Nature View', 'Scenic and peaceful surroundings')}
          {renderExperienceToggleSwitch('open_shower_outdoor_bath', 'Open Shower/Outdoor Bath', 'Unique bathing experience')}
          {renderExperienceToggleSwitch('gazebo_cabana_seating', 'Gazebo/Cabana Seating', 'Comfortable outdoor relaxation')}
          {renderExperienceToggleSwitch('hammock', 'Hammock', 'Leisurely swinging and relaxation')}
          {renderExperienceToggleSwitch('high_tea_setup', 'High-tea Setup', 'Elegant tea time experience')}
          {renderExperienceToggleSwitch('event_space_small_gatherings', 'Event Space', 'Small gatherings and celebrations')}
          {renderExperienceToggleSwitch('private_chef_on_request', 'Private Chef', 'Personalized dining on request')}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={handlePrevious}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
        >
          Next Step
        </button>
      </div>
    </form>
  );

  const renderAdditionalToggleSwitch = (name, label, description) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => handleAdditionalToggleChange(name)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          additionalAmenities[name] ? 'bg-green-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            additionalAmenities[name] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderStep4AdditionalAmenities = () => (
    <form onSubmit={handleStep4Submit} className="space-y-12">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pet & Family Friendly</h2>
          <p className="text-gray-600">Family and pet accommodation features</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAdditionalToggleSwitch('pet_friendly', 'Pet-friendly', 'Welcoming dogs, cats and other pets')}
          {renderAdditionalToggleSwitch('child_friendly', 'Child-friendly', 'Environment suitable for families with kids')}
          {renderAdditionalToggleSwitch('kids_play_area', 'Kids Play Area', 'Games and activities for children')}
          {renderAdditionalToggleSwitch('fenced_property', 'Fenced Property', 'Security and safety for pets and children')}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Safety & Security</h2>
          <p className="text-gray-600">Security measures and safety equipment</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAdditionalToggleSwitch('cctv_cameras', 'CCTV Cameras', 'Common areas security monitoring')}
          {renderAdditionalToggleSwitch('first_aid_kit', 'First Aid Kit', 'Medical emergencies and basic treatment')}
          {renderAdditionalToggleSwitch('fire_extinguisher', 'Fire Extinguisher', 'Fire safety and emergency protection')}
          {renderAdditionalToggleSwitch('security_guard', 'Security Guard', 'Property protection and guest safety')}
          {renderAdditionalToggleSwitch('private_gate_compound_wall', 'Private Gate/Wall', 'Privacy and security boundary')}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">House Rules & Services</h2>
          <p className="text-gray-600">Property services and accommodation policies</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAdditionalToggleSwitch('daily_cleaning_available', 'Daily Cleaning', 'Maintain property hygiene')}
          {renderAdditionalToggleSwitch('long_stays_allowed', 'Long Stays Allowed', 'Extended vacation or work purposes')}
          {renderAdditionalToggleSwitch('early_check_in_late_check_out', 'Flexible Check-in/out', 'Early check-in or late check-out on request')}
          {renderAdditionalToggleSwitch('staff_quarters_available', 'Staff Quarters', 'Property maintenance and guest services')}
          {renderAdditionalToggleSwitch('caretaker_on_site', 'Caretaker On-site', 'Property assistance and guest support')}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={handlePrevious}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
        >
          Submit Registration
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register Your Property
            </h1>
            <p className="text-gray-600">
              Basic Information
            </p>
          </div>

          {renderProcessExplanation()}
          {renderProgressIndicator()}
          {currentStep === 1 && renderStep1BasicInfo()}
          {currentStep === 2 && renderStep2EssentialAmenities()}
          {currentStep === 3 && renderStep3ExperienceAmenities()}
          {currentStep === 4 && renderStep4AdditionalAmenities()}
        </div>
      </div>
    </div>
  );
};

export default RegisterPropertyPage;