import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usePropertyRegistration } from '../../hooks/usePropertyData';

const RegisterPropertyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { submitRegistration, loading, success, resetState } = usePropertyRegistration();
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    type: 'farmhouse',
    per_day_price: '',
    max_people_allowed: '',
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

  const [uploadData, setUploadData] = useState({
    propertyImages: [],
    propertyDocuments: [],
    aadhaarCard: null,
    panCard: null
  });

  const [ownerDetails, setOwnerDetails] = useState({
    ownerName: '',
    ownerDescription: '',
    ownerPhoto: null
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
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

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setEssentialAmenities(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const validateBasicInfo = () => {
    const errors = {};
    
    if (!basicInfo.name.trim()) {
      errors.name = 'Property name is required';
    }
    
    if (!basicInfo.description.trim()) {
      errors.description = 'Description is required';
    } else if (basicInfo.description.trim().split(/\s+/).length < 10) {
      errors.description = 'Description must have at least 10 words';
    }
    
    if (!basicInfo.type) {
      errors.type = 'Property type is required';
    }
    
    if (!basicInfo.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(basicInfo.phone_number.trim())) {
      errors.phone_number = 'Phone number must contain only numbers and be exactly 10 digits';
    }
    
    if (!basicInfo.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!basicInfo.per_day_price.trim()) {
      errors.per_day_price = 'Per day price is required';
    } else if (!/^\d+$/.test(basicInfo.per_day_price.trim()) || parseInt(basicInfo.per_day_price) <= 0) {
      errors.per_day_price = 'Price must be a valid positive number';
    }
    
    if (!basicInfo.max_people_allowed.trim()) {
      errors.max_people_allowed = 'Maximum people allowed is required';
    } else if (!/^\d+$/.test(basicInfo.max_people_allowed.trim()) || parseInt(basicInfo.max_people_allowed) <= 0 || parseInt(basicInfo.max_people_allowed) > 50) {
      errors.max_people_allowed = 'Must be a number between 1 and 50';
    }
    
    if (!basicInfo.pin_code.trim()) {
      errors.pin_code = 'Pin code is required';
    } else if (!/^\d{6}$/.test(basicInfo.pin_code.trim())) {
      errors.pin_code = 'Pin code must contain only numbers and be exactly 6 digits';
    }
    
    return errors;
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    const errors = validateBasicInfo();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    console.log('Basic Info:', basicInfo);
    setCurrentStep(2);
  };

  const handleStep2Next = (e) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleStep3Next = (e) => {
    e.preventDefault();
    setCurrentStep(4);
  };

  const handleStep4Next = (e) => {
    e.preventDefault();
    setCurrentStep(5);
  };

  const handleStep5Next = (e) => {
    e.preventDefault();
    const errors = validateOwnerDetails();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setCurrentStep(6);
  };

  const handleOwnerDetailsChange = (e) => {
    const { name, value } = e.target;
    setOwnerDetails(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOwnerPhotoUpload = (e) => {
    const file = e.target.files[0];
    setOwnerDetails(prev => ({ ...prev, ownerPhoto: file }));
    
    if (validationErrors.ownerPhoto) {
      setValidationErrors(prev => ({ ...prev, ownerPhoto: '' }));
    }
  };

  const validateOwnerDetails = () => {
    const errors = {};
    
    if (!ownerDetails.ownerName.trim()) {
      errors.ownerName = 'Owner name is required';
    } else {
      const nameWordCount = ownerDetails.ownerName.trim().split(/\s+/).length;
      if (nameWordCount < 2) {
        errors.ownerName = 'Owner name must have at least 2 words (first and last name)';
      } else if (nameWordCount > 5) {
        errors.ownerName = 'Owner name cannot exceed 5 words';
      }
    }
    
    if (!ownerDetails.ownerDescription.trim()) {
      errors.ownerDescription = 'Owner description is required';
    } else {
      const wordCount = ownerDetails.ownerDescription.trim().split(/\s+/).length;
      if (wordCount < 10) {
        errors.ownerDescription = 'Description must have at least 10 words';
      } else if (wordCount > 200) {
        errors.ownerDescription = 'Description cannot exceed 200 words';
      }
    }
    
    if (!ownerDetails.ownerPhoto) {
      errors.ownerPhoto = 'Owner photo is required';
    }
    
    return errors;
  };

  const handleFileUpload = (e, fileType) => {
    const files = Array.from(e.target.files);
    setUploadData(prev => ({
      ...prev,
      [fileType]: fileType === 'propertyImages' || fileType === 'propertyDocuments' ? files : files[0]
    }));
    
    if (validationErrors[fileType]) {
      setValidationErrors(prev => ({ ...prev, [fileType]: '' }));
    }
  };

  const validateFileUploads = () => {
    const errors = {};
    
    if (!uploadData.propertyImages || uploadData.propertyImages.length === 0) {
      errors.propertyImages = 'Property images are required';
    }
    
    if (!uploadData.propertyDocuments || uploadData.propertyDocuments.length === 0) {
      errors.propertyDocuments = 'Property documents are required';
    }
    
    if (!uploadData.aadhaarCard) {
      errors.aadhaarCard = 'Aadhaar card is required';
    }
    
    if (!uploadData.panCard) {
      errors.panCard = 'Bank card is required';
    }
    
    return errors;
  };

  const clearAllStates = () => {
    setBasicInfo({
      name: '',
      description: '',
      type: 'farmhouse',
      per_day_price: '',
      max_people_allowed: '',
      phone_number: '',
      address: '',
      pin_code: ''
    });
    setEssentialAmenities({
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
    setExperienceAmenities({
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
    setAdditionalAmenities({
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
    setUploadData({
      propertyImages: [],
      propertyDocuments: [],
      aadhaarCard: null,
      panCard: null
    });
    setOwnerDetails({
      ownerName: '',
      ownerDescription: '',
      ownerPhoto: null
    });
    setValidationErrors({});
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateFileUploads();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    
    try {
      const registrationData = {
        basicInfo,
        essentialAmenities,
        experienceAmenities,
        additionalAmenities,
        ownerDetails,
        uploadData
      };
      
      await submitRegistration(registrationData);
      clearAllStates();
      setIsRegistrationComplete(true);
    } catch (error) {
      toast.error(error.message || 'Failed to register property. Please try again.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProcessExplanation = () => (
    <div className="bg-blue-50 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        How Registration Works
      </h2>
      <p className="text-gray-600 leading-relaxed">
        Fill in your property details correctly. Our team will verify the information 
        and approve your listing. Once verified, your property will be live on our platform.
      </p>
    </div>
  );

  const renderProgressIndicator = () => {
    const progressPercent = (currentStep / 6) * 100;
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep} of 6</span>
          <span>{Math.round(progressPercent)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-300" 
               style={{width: `${progressPercent}%`}}></div>
        </div>
      </div>
    );
  };

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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Enter your property name"
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
        )}
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
            validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Describe your property in detail (minimum 10 words)..."
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
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
          Per Day Price (₹)
        </label>
        <input
          type="number"
          name="per_day_price"
          value={basicInfo.per_day_price}
          onChange={handleBasicInfoChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            validationErrors.per_day_price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Enter price per day in rupees"
          min="1"
        />
        {validationErrors.per_day_price && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.per_day_price}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum People Allowed
        </label>
        <input
          type="number"
          name="max_people_allowed"
          value={basicInfo.max_people_allowed}
          onChange={handleBasicInfoChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            validationErrors.max_people_allowed ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Enter maximum number of guests (1-50)"
          min="1"
          max="50"
        />
        {validationErrors.max_people_allowed && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.max_people_allowed}</p>
        )}
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
            className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:border-transparent transition-all ${
              validationErrors.phone_number ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="Enter your 10-digit phone number"
            maxLength="10"
          />
        </div>
        {validationErrors.phone_number && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.phone_number}</p>
        )}
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            validationErrors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Enter your property address"
        />
        {validationErrors.address && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pin Code
        </label>
        <input
          type="tel"
          name="pin_code"
          value={basicInfo.pin_code}
          onChange={handleBasicInfoChange}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            validationErrors.pin_code ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Enter 6-digit pin code"
          maxLength="6"
          pattern="[0-9]{6}"
        />
        {validationErrors.pin_code && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.pin_code}</p>
        )}
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
    <form onSubmit={handleStep4Next} className="space-y-12">
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
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
        >
          Next Step
        </button>
      </div>
    </form>
  );

  const renderFileUploadSection = (fileType, label, accept, multiple = false) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
        validationErrors[fileType] 
          ? 'border-red-300 hover:border-red-400' 
          : 'border-gray-300 hover:border-green-400'
      }`}>
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500">
              <span>Upload files</span>
              <input
                type="file"
                className="sr-only"
                accept={accept}
                multiple={multiple}
                onChange={(e) => handleFileUpload(e, fileType)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {accept.includes('image') ? 'PNG, JPG, JPEG up to 2MB each' : 
             accept.includes('.pdf,.doc,.docx') ? 'PDF, DOC, DOCX up to 10MB each' : 
             'PDF up to 5MB (both sides with clear images)'}
          </p>
        </div>
      </div>
      {uploadData[fileType] && (
        <div className="mt-2">
          {Array.isArray(uploadData[fileType]) ? (
            <p className="text-sm text-green-600">{uploadData[fileType].length} files selected</p>
          ) : (
            <p className="text-sm text-green-600">{uploadData[fileType].name}</p>
          )}
        </div>
      )}
      {validationErrors[fileType] && (
        <p className="mt-1 text-sm text-red-600">{validationErrors[fileType]}</p>
      )}
    </div>
  );

  const renderStep5OwnerDetails = () => (
    <form onSubmit={handleStep5Next} className="space-y-6">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Owner Details</h2>
          <p className="text-gray-600">Provide information about the property owner</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ownerName"
            value={ownerDetails.ownerName}
            onChange={handleOwnerDetailsChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
              validationErrors.ownerName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="Enter owner's full name"
          />
          {validationErrors.ownerName && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.ownerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="ownerDescription"
            value={ownerDetails.ownerDescription}
            onChange={handleOwnerDetailsChange}
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
              validationErrors.ownerDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="Tell guests about yourself - your background, interests, and what makes you a great host..."
          />
          {validationErrors.ownerDescription && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.ownerDescription}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Photo <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">Upload a clear passport-size photo where your face is clearly visible</p>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
            validationErrors.ownerPhoto 
              ? 'border-red-300 hover:border-red-400' 
              : 'border-gray-300 hover:border-green-400'
          }`}>
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500">
                  <span>Upload photo</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleOwnerPhotoUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG up to 2MB (passport size preferred)
              </p>
            </div>
          </div>
          {ownerDetails.ownerPhoto && (
            <div className="mt-2">
              <p className="text-sm text-green-600">{ownerDetails.ownerPhoto.name}</p>
            </div>
          )}
          {validationErrors.ownerPhoto && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.ownerPhoto}</p>
          )}
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

  const renderStep6DocumentUpload = () => (
    <form onSubmit={handleFinalSubmit} className="space-y-8">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-green-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Registration Successful!</h3>
              <p className="mt-2 text-sm text-green-700">Your property has been submitted for review. We'll contact you soon!</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Images</h2>
          <p className="text-gray-600">Upload high-quality images of your property</p>
        </div>
        {renderFileUploadSection('propertyImages', 'Property Images (Multiple)', 'image/*', true)}
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Documents</h2>
          <p className="text-gray-600">Upload property-related legal documents</p>
        </div>
        {renderFileUploadSection('propertyDocuments', 'Property Documents (Multiple)', '.pdf,.doc,.docx', true)}
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Identity Documents</h2>
          <p className="text-gray-600">Upload your Aadhaar and Bank card for verification</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFileUploadSection('aadhaarCard', 'Aadhaar Card (PDF only)', '.pdf')}
          {renderFileUploadSection('panCard', 'PAN Card (PDF only)', '.pdf')}
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
          disabled={loading}
          className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
              : ''
          }`}
        >
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </div>
    </form>
  );

  const handleGoToHome = () => {
    window.location.href = '/';
  };

  const renderSuccessMessage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Registration Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for registering your property with us.
            </p>
            <p className="text-gray-600">
              We will review your property details and revert back to you regarding your property soon.
            </p>
            <p className="text-sm text-gray-500">
              Our team will contact you within 24-48 hours for verification and next steps.
            </p>
          </div>
          
          <div className="pt-6">
            <button
              onClick={handleGoToHome}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isRegistrationComplete ? (
        renderSuccessMessage()
      ) : (
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
              {currentStep === 5 && renderStep5OwnerDetails()}
              {currentStep === 6 && renderStep6DocumentUpload()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPropertyPage;