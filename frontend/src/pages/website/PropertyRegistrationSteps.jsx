import React from 'react';
import { 
  TextInput, 
  TextArea, 
  NumberInput, 
  TimePickerInput, 
  ToggleSwitch, 
  FileUploadBox, 
  SectionHeader, 
  StepNavigation,
  PasswordInput
} from '../../components/common/FormComponents';
import { CreditCard } from 'phosphor-react';
import GooglePlacesAutocomplete from '../../components/common/GooglePlacesAutocomplete';
import { MINIMUM_PROPERTY_ACTIVATION_AMOUNT } from '../../config/constants';

// Helper Components
export const ProcessExplanation = () => (
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

export const ProgressIndicator = ({ currentStep, totalSteps = 8 }) => {
  const progressPercent = (currentStep / totalSteps) * 100;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progressPercent)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all duration-300" 
             style={{width: `${progressPercent}%`}}></div>
      </div>
    </div>
  );
};

export const RegistrationSuccessMessage = ({ onGoToHome }) => (
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
            onClick={onGoToHome}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Step 1: Basic Information
export const Step1BasicInfo = ({ 
  basicInfo, 
  validationErrors, 
  onBasicInfoChange,
  onLocationSelected,
  onSubmit,
  stepLoading = false 
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <TextInput
      name="name"
      value={basicInfo.name}
      onChange={onBasicInfoChange}
      label="Property Name"
      placeholder="Enter your property name"
      error={validationErrors.name}
    />

    <TextArea
      name="description"
      value={basicInfo.description}
      onChange={onBasicInfoChange}
      label="Description"
      placeholder="Describe your property in detail (minimum 10 words, maximum 150 words)..."
      error={validationErrors.description}
      rows={4}
    />

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Property Type
      </label>
      <select
        name="type"
        value={basicInfo.type}
        onChange={onBasicInfoChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
      >
        <option value="farmhouse">Farmhouse</option>
        <option value="bnb">Bed and breakfast (BnB)</option>
      </select>
    </div>

    <NumberInput
      name="per_day_price"
      value={basicInfo.per_day_price}
      onChange={onBasicInfoChange}
      label="Estimated Price (₹)"
      placeholder="Enter price per day in rupees"
      error={validationErrors.per_day_price}
      min={1}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TimePickerInput
        name="opening_time"
        value={basicInfo.opening_time}
        onChange={onBasicInfoChange}
        label="Check-IN"
        error={validationErrors.opening_time}
      />

      <TimePickerInput
        name="closing_time"
        value={basicInfo.closing_time}
        onChange={onBasicInfoChange}
        label="Check-OUT"
        error={validationErrors.closing_time}
      />
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
          onChange={onBasicInfoChange}
          onKeyPress={(e) => {
            // Only allow numbers (0-9)
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
              e.preventDefault()
            }
          }}
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

    <GooglePlacesAutocomplete
      value={basicInfo.address}
      onChange={onBasicInfoChange}
      onPlaceSelected={onLocationSelected}
      label="Property Address"
      placeholder="Start typing your property address..."
      error={validationErrors.address}
    />

    <TextInput
      type="tel"
      name="pin_code"
      value={basicInfo.pin_code}
      onChange={onBasicInfoChange}
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      }}
      label="Pin Code"
      placeholder="Auto-filled from address or enter manually"
      maxLength="6"
      pattern="[0-9]{6}"
      error={validationErrors.pin_code}
    />

    <StepNavigation 
      showPrevious={false} 
      isSubmitting={stepLoading}
      submitText={stepLoading ? "Saving..." : "Next Step"}
    />
  </form>
);

// Step 2: OTP Verification
export const Step2OTPVerification = ({ 
  otpCode,
  onOtpChange,
  onSubmit,
  onPrevious,
  isVerifying
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg text-center">
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Verify Your Phone Number</h3>
        <p className="text-gray-600 mb-6">
          We've sent a 6-digit verification code to your registered phone number. 
          Please enter the code below to continue.
        </p>

        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
            Enter OTP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="otpCode"
            value={otpCode}
            onChange={onOtpChange}
            maxLength="6"
            pattern="[0-9]{6}"
            className="w-full px-6 py-4 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="000000"
            required
          />
          <p className="text-sm text-gray-500 mt-2 text-left">Please enter the 6-digit code sent via SMS</p>
        </div>
      </div>

      <StepNavigation 
        showPrevious={true} 
        onPrevious={onPrevious}
        isSubmitting={isVerifying}
        submitText={isVerifying ? "Verifying..." : "Verify & Continue"}
      />
    </form>
  );
};

// Step 3: Essential Amenities (previously Step 2)
export const Step3EssentialAmenities = ({ 
  essentialAmenities, 
  onToggleChange, 
  onNumberChange, 
  onSubmit, 
  onPrevious 
}) => (
  <form onSubmit={onSubmit} className="space-y-12">
    <div className="space-y-6">
      <SectionHeader title="Guest Capacity" subtitle="Maximum allowed guests, children, and pets" />

      <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
        <NumberInput name="max_people_allowed" value={essentialAmenities.max_people_allowed} onChange={onNumberChange} label="Max Adults" min={1} max={50} centered required />
        <NumberInput name="max_children_allowed" value={essentialAmenities.max_children_allowed} onChange={onNumberChange} label="Max Children" min={0} max={20} centered />
        <NumberInput name="max_pets_allowed" value={essentialAmenities.max_pets_allowed} onChange={onNumberChange} label="Max Pets" min={0} max={10} centered />
      </div>
    </div>

    <div className="space-y-6">
      <SectionHeader title="Bedroom & Bathroom" subtitle="Room details and bathroom amenities" />

      <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
        <NumberInput name="bedrooms" value={essentialAmenities.bedrooms} onChange={onNumberChange} label="Bedrooms" min={0} max={10} centered />
        <NumberInput name="bathrooms" value={essentialAmenities.bathrooms} onChange={onNumberChange} label="Bathrooms" min={1} max={10} centered required />
        <NumberInput name="beds" value={essentialAmenities.beds} onChange={onNumberChange} label="Beds" min={0} max={20} centered />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToggleSwitch name="bed_linens" label="Bed Linens" description="Fresh sheets, pillowcases and blankets" checked={essentialAmenities.bed_linens} onChange={onToggleChange} />
        <ToggleSwitch name="towels" label="Towels" description="Clean towels for bathing" checked={essentialAmenities.towels} onChange={onToggleChange} />
        <ToggleSwitch name="toiletries" label="Toiletries" description="Soap, shampoo, toothpaste" checked={essentialAmenities.toiletries} onChange={onToggleChange} />
        <ToggleSwitch name="mirror" label="Mirror" description="For grooming in bathroom/bedroom" checked={essentialAmenities.mirror} onChange={onToggleChange} />
        <ToggleSwitch name="hair_dryer" label="Hair Dryer" description="For drying hair after bath" checked={essentialAmenities.hair_dryer} onChange={onToggleChange} />
        <ToggleSwitch name="attached_bathrooms" label="Attached Bathrooms" description="Private bathrooms with bedrooms" checked={essentialAmenities.attached_bathrooms} onChange={onToggleChange} />
        <ToggleSwitch name="bathtub" label="Bathtub" description="For relaxing baths" checked={essentialAmenities.bathtub} onChange={onToggleChange} />
      </div>
    </div>

    <div className="space-y-6">
      <SectionHeader title="Core Amenities" subtitle="Essential facilities and services" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToggleSwitch name="air_conditioning" label="Air Conditioning" description="Temperature control system" checked={essentialAmenities.air_conditioning} onChange={onToggleChange} />
        <ToggleSwitch name="wifi_internet" label="Wi-Fi Internet" description="Internet connection for guests" checked={essentialAmenities.wifi_internet} onChange={onToggleChange} />
        <ToggleSwitch name="power_backup" label="Power Backup" description="Inverter or generator during outages" checked={essentialAmenities.power_backup} onChange={onToggleChange} />
        <ToggleSwitch name="parking" label="Parking" description="Free or private parking space" checked={essentialAmenities.parking} onChange={onToggleChange} />
        <ToggleSwitch name="refrigerator" label="Refrigerator" description="For storing food and beverages" checked={essentialAmenities.refrigerator} onChange={onToggleChange} />
        <ToggleSwitch name="microwave" label="Microwave" description="For heating and cooking food" checked={essentialAmenities.microwave} onChange={onToggleChange} />
        <ToggleSwitch name="cooking_basics" label="Cooking Basics" description="Utensils, oil, salt and spices" checked={essentialAmenities.cooking_basics} onChange={onToggleChange} />
        <ToggleSwitch name="drinking_water" label="Drinking Water" description="Clean water supply" checked={essentialAmenities.drinking_water} onChange={onToggleChange} />
        <ToggleSwitch name="washing_machine" label="Washing Machine" description="For laundry needs" checked={essentialAmenities.washing_machine} onChange={onToggleChange} />
        <ToggleSwitch name="iron" label="Iron & Board" description="For clothing care" checked={essentialAmenities.iron} onChange={onToggleChange} />
        <ToggleSwitch name="geyser_hot_water" label="Hot Water" description="Geyser for bathing and washing" checked={essentialAmenities.geyser_hot_water} onChange={onToggleChange} />
        <ToggleSwitch name="television" label="Television" description="For entertainment" checked={essentialAmenities.television} onChange={onToggleChange} />
        <ToggleSwitch name="smart_tv_ott" label="Smart TV with OTT" description="Netflix, Prime, etc." checked={essentialAmenities.smart_tv_ott} onChange={onToggleChange} />
        <ToggleSwitch name="wardrobe" label="Wardrobe" description="Closet space for clothes" checked={essentialAmenities.wardrobe} onChange={onToggleChange} />
        <ToggleSwitch name="extra_mattress_bedding" label="Extra Bedding" description="Additional mattress and bedding" checked={essentialAmenities.extra_mattress_bedding} onChange={onToggleChange} />
        <ToggleSwitch name="cleaning_supplies" label="Cleaning Supplies" description="Cleaning materials provided" checked={essentialAmenities.cleaning_supplies} onChange={onToggleChange} />
      </div>
    </div>

    <StepNavigation onPrevious={onPrevious} />
  </form>
);

// Step 4: Experience Amenities (previously Step 3)
export const Step4ExperienceAmenities = ({ 
  experienceAmenities, 
  onToggleChange, 
  onSubmit, 
  onPrevious 
}) => {
  const renderToggle = (name, label, description) => (
    <ToggleSwitch 
      name={name} 
      label={label} 
      description={description} 
      checked={experienceAmenities[name]} 
      onChange={onToggleChange} 
    />
  );

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <div className="space-y-6">
        <SectionHeader title="Outdoor & Garden" subtitle="Outdoor spaces and garden facilities" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('private_lawn_garden', 'Private Lawn/Garden', 'Private outdoor space for relaxation')}
          {renderToggle('swimming_pool', 'Swimming Pool', 'Pool for recreation and exercise')}
          {renderToggle('outdoor_seating_area', 'Outdoor Seating', 'Chairs and tables for outdoor relaxation')}
          {renderToggle('bonfire_setup', 'Bonfire Setup', 'Area for evening gatherings and warmth')}
          {renderToggle('barbecue_setup', 'Barbecue Setup', 'Outdoor cooking and grilling area')}
          {renderToggle('terrace_balcony', 'Terrace/Balcony', 'Outdoor views and fresh air space')}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeader title="Food & Dining" subtitle="Cooking and dining facilities" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('kitchen_access_self_cooking', 'Kitchen Access', 'Self-cooking facilities available')}
          {renderToggle('in_house_meals_available', 'In-house Meals', 'Meals provided by the property')}
          {renderToggle('dining_table', 'Dining Table', 'Comfortable eating space')}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeader title="Entertainment & Activities" subtitle="Games and recreational activities" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('indoor_games', 'Indoor Games', 'Carrom, chess, ludo for entertainment')}
          {renderToggle('outdoor_games', 'Outdoor Games', 'Cricket, badminton, football available')}
          {renderToggle('pool_table', 'Pool Table', 'Billiards for recreational gaming')}
          {renderToggle('music_system', 'Music System', 'Speakers for playing music')}
          {renderToggle('board_games', 'Board Games', 'Group entertainment and fun')}
          {renderToggle('bicycle_access', 'Bicycle Access', 'Bikes for exploring and exercise')}
          {renderToggle('movie_projector', 'Movie Projector', 'Watching films and entertainment')}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeader title="Experience & Luxury Add-ons" subtitle="Premium experiences and luxury amenities" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('jacuzzi', 'Jacuzzi', 'Luxury relaxation and therapeutic bathing')}
          {renderToggle('private_bar_setup', 'Private Bar Setup', 'Drinks and cocktail preparation area')}
          {renderToggle('farm_view_nature_view', 'Farm/Nature View', 'Scenic and peaceful surroundings')}
          {renderToggle('open_shower_outdoor_bath', 'Open Shower/Outdoor Bath', 'Unique bathing experience')}
          {renderToggle('gazebo_cabana_seating', 'Gazebo/Cabana Seating', 'Comfortable outdoor relaxation')}
          {renderToggle('hammock', 'Hammock', 'Leisurely swinging and relaxation')}
          {renderToggle('high_tea_setup', 'High-tea Setup', 'Elegant tea time experience')}
          {renderToggle('event_space_small_gatherings', 'Event Space', 'Small gatherings and celebrations')}
          {renderToggle('private_chef_on_request', 'Private Chef', 'Personalized dining on request')}
        </div>
      </div>

      <StepNavigation onPrevious={onPrevious} />
    </form>
  );
};

// Step 5: Additional Amenities (previously Step 4)
export const Step5AdditionalAmenities = ({ 
  additionalAmenities, 
  onToggleChange, 
  onSubmit, 
  onPrevious 
}) => {
  const renderToggle = (name, label, description) => (
    <ToggleSwitch 
      name={name} 
      label={label} 
      description={description} 
      checked={additionalAmenities[name]} 
      onChange={onToggleChange} 
    />
  );

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <div className="space-y-6">
        <SectionHeader title="Pet & Family Friendly" subtitle="Family and pet accommodation features" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('pet_friendly', 'Pet-friendly', 'Welcoming dogs, cats and other pets')}
          {renderToggle('child_friendly', 'Child-friendly', 'Environment suitable for families with kids')}
          {renderToggle('kids_play_area', 'Kids Play Area', 'Games and activities for children')}
          {renderToggle('fenced_property', 'Fenced Property', 'Security and safety for pets and children')}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeader title="Safety & Security" subtitle="Security measures and safety equipment" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('cctv_cameras', 'CCTV Cameras', 'Common areas security monitoring')}
          {renderToggle('first_aid_kit', 'First Aid Kit', 'Medical emergencies and basic treatment')}
          {renderToggle('fire_extinguisher', 'Fire Extinguisher', 'Fire safety and emergency protection')}
          {renderToggle('security_guard', 'Security Guard', 'Property protection and guest safety')}
          {renderToggle('private_gate_compound_wall', 'Private Gate/Wall', 'Privacy and security boundary')}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeader title="House Rules & Services" subtitle="Property services and accommodation policies" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('daily_cleaning_available', 'Daily Cleaning', 'Maintain property hygiene')}
          {renderToggle('long_stays_allowed', 'Long Stays Allowed', 'Extended vacation or work purposes')}
          {renderToggle('early_check_in_late_check_out', 'Flexible Check-in/out', 'Early check-in or late check-out on request')}
          {renderToggle('staff_quarters_available', 'Staff Quarters', 'Property maintenance and guest services')}
          {renderToggle('caretaker_on_site', 'Caretaker On-site', 'Property assistance and guest support')}
        </div>
      </div>

      <StepNavigation onPrevious={onPrevious} />
    </form>
  );
};

// Step 6: Owner Details (previously Step 5)
export const Step6OwnerDetails = ({ 
  ownerDetails, 
  validationErrors, 
  onOwnerDetailsChange, 
  onOwnerPhotoUpload, 
  onSubmit, 
  onPrevious 
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-6">
      <SectionHeader title="Owner Details" subtitle="Provide information about the property owner" />
      
      <TextInput
        name="ownerName"
        value={ownerDetails.ownerName}
        onChange={onOwnerDetailsChange}
        label="Owner Name"
        placeholder="Enter owner's full name"
        error={validationErrors.ownerName}
        required
      />

      <TextArea
        name="ownerDescription"
        value={ownerDetails.ownerDescription}
        onChange={onOwnerDetailsChange}
        label="Owner Description"
        placeholder="Tell guests about yourself - your background, interests, and what makes you a great host..."
        error={validationErrors.ownerDescription}
        rows={4}
        required
      />

      <TextInput
        name="ownerDashboardId"
        value={ownerDetails.ownerDashboardId}
        onChange={onOwnerDetailsChange}
        label="Dashboard Login ID"
        placeholder="Create a unique ID for your owner dashboard login (min 3 characters)"
        error={validationErrors.ownerDashboardId}
        required
      />

      <div>
        <PasswordInput
          name="ownerDashboardPassword"
          value={ownerDetails.ownerDashboardPassword}
          onChange={onOwnerDetailsChange}
          label="Dashboard Password"
          placeholder="Must include uppercase, lowercase, number & special char"
          error={validationErrors.ownerDashboardPassword}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Password must be at least 8 characters and include: uppercase letter, lowercase letter, number, and special character (!@#$%^&*(),.?":{}|&lt;&gt;)
        </p>
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
                  onChange={onOwnerPhotoUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 800KB (passport size preferred)
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

    <StepNavigation onPrevious={onPrevious} />
  </form>
);

// Step 7: Document Upload (previously Step 6)
export const Step7DocumentUpload = ({ 
  uploadData, 
  validationErrors, 
  success, 
  loading, 
  onFileUpload, 
  onSubmit, 
  onPrevious 
}) => {
  const renderFileUploadSection = (fileType, label, accept, multiple = false) => (
    <FileUploadBox
      fileType={fileType}
      label={label}
      accept={accept}
      multiple={multiple}
      onChange={onFileUpload}
      error={validationErrors[fileType]}
      value={uploadData[fileType]}
      required
    />
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8">
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
        <SectionHeader title="Property Images" subtitle="Upload high-quality images of your property" />
        {renderFileUploadSection('propertyImages', 'Property Images (Multiple)', 'image/*', true)}
      </div>

      <div className="space-y-6">
        <SectionHeader title="Property Documents" subtitle="Upload property-related legal documents (e.g., electricity bill, property tax receipt)" />
        {renderFileUploadSection('propertyDocuments', 'Property Documents (Multiple)', '.pdf,.doc,.docx', true)}
      </div>

      <div className="space-y-6">
        <SectionHeader title="Identity Documents" subtitle="Upload your Aadhaar and Bank card for verification" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFileUploadSection('aadhaarCard', 'Aadhaar Card (PDF only)', '.pdf')}
          {renderFileUploadSection('panCard', 'PAN Card (PDF only)', '.pdf')}
        </div>
      </div>

      <StepNavigation 
        onPrevious={onPrevious} 
        nextLabel="Continue to Payment" 
        loading={loading}
        nextButtonColor="green"
      />
    </form>
  );
};

// Step 8: Credit Recharge (NEW)
export const Step8CreditRecharge = ({ 
  rechargeAmount,
  onRechargeAmountChange,
  onSubmit, 
  onPrevious,
  loading,
  currentBalance = 0
}) => (
  <form onSubmit={onSubmit} className="space-y-8">
    <div className="space-y-6">
      <SectionHeader title="Recharge Credits" subtitle="Add credits to activate your property listing" />
      
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CreditCard size={32} weight="duotone" className="text-green-600" />
            Enter Amount to Activate Your Property
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount (₹)
            </label>
            <input
              type="number"
              value={rechargeAmount}
              onChange={onRechargeAmountChange}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              disabled={loading}
              min={MINIMUM_PROPERTY_ACTIVATION_AMOUNT}
              step="1"
              required
            />
            <p className="text-sm text-red-500 mt-2">
              Minimum ₹{MINIMUM_PROPERTY_ACTIVATION_AMOUNT} required to activate your property listing and start receiving bookings.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium mb-1">Total Balance</p>
              <p className="text-3xl font-bold text-green-900">
                ₹{rechargeAmount && parseFloat(rechargeAmount) > 0 ? parseFloat(rechargeAmount) : 0}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            disabled={loading || !rechargeAmount || parseFloat(rechargeAmount) < MINIMUM_PROPERTY_ACTIVATION_AMOUNT}
          >
            {loading ? 'Processing Payment...' : 'Proceed to Payment & Complete Registration'}
          </button>
        </div>
      </div>
    </div>

    <StepNavigation 
      onPrevious={onPrevious} 
      showNext={false}
    />
  </form>
);
