import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usePropertyRegistration } from '../../hooks/usePropertyData';
import {
  saveBasicInfo,
  verifyOtp,
  saveEssentialAmenities,
  saveExperienceAmenities,
  saveAdditionalAmenities,
  saveOwnerDetails,
  uploadOwnerPhoto,
  completePropertyRegistration
} from '../../services/propertyApi';
import {
  ProcessExplanation,
  ProgressIndicator,
  RegistrationSuccessMessage,
  Step1BasicInfo,
  Step2OTPVerification,
  Step3EssentialAmenities,
  Step4ExperienceAmenities,
  Step5AdditionalAmenities,
  Step6OwnerDetails,
  Step7DocumentUpload,
  Step8CreditRecharge
} from './PropertyRegistrationSteps';
import useRazorpay from '../../hooks/owner/useRazorpay';
import { MINIMUM_PROPERTY_ACTIVATION_AMOUNT } from '../../config/constants';

const PropertyRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [stepLoading, setStepLoading] = useState(false);
  const { submitRegistration, loading, success, resetState } = usePropertyRegistration();
  
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    type: 'farmhouse',
    per_day_price: '',
    opening_time: '',
    closing_time: '',
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
    bedrooms: 0,
    bathrooms: 1,
    beds: 0,
    bed_linens: false,
    towels: false,
    toiletries: false,
    mirror: false,
    hair_dryer: false,
    attached_bathrooms: false,
    bathtub: false,
    max_people_allowed: 1,
    max_children_allowed: 0,
    max_pets_allowed: 0
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
    ownerPhoto: null,
    ownerDashboardId: '',
    ownerDashboardPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Credit recharge states
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [documentsUploaded, setDocumentsUploaded] = useState(false);

  // Payment success callback
  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your property is now active.');
    setRechargeAmount('');
    clearAllStates();
    setPropertyId(null);
    sessionStorage.removeItem('currentPropertyId');
    setIsRegistrationComplete(true);
  };

  // Initialize Razorpay hook
  const { initiatePayment, loading: paymentLoading } = useRazorpay(propertyId, handlePaymentSuccess);

  useEffect(() => {
    const savedPropertyId = sessionStorage.getItem('currentPropertyId');
    if (savedPropertyId) {
      setPropertyId(savedPropertyId);
    }
  }, []);

  useEffect(() => {
    if (propertyId) {
      sessionStorage.setItem('currentPropertyId', propertyId);
    }
  }, [propertyId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtpCode(value);
  };

  const handleAddressInputChange = () => {
    setIsAddressSelectedFromGoogle(false);
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationSelected = (locationData) => {
    setBasicInfo(prev => ({
      ...prev,
      address: locationData.address,
      pin_code: locationData.pin_code || prev.pin_code,
      location: {
        address: locationData.address,
        pin_code: locationData.pin_code || prev.pin_code,
        city: locationData.city,
        state: locationData.state,
        country: locationData.country,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        coordinates: locationData.coordinates
      }
    }));
    
    if (validationErrors.address) {
      setValidationErrors(prev => ({ ...prev, address: '' }));
    }
    
    if (locationData.pin_code && validationErrors.pin_code) {
      setValidationErrors(prev => ({ ...prev, pin_code: '' }));
    }
    
    if (!locationData.pin_code) {
      toast.info('Pin code not found for this location. Please enter it manually.');
    }
  };

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

  const handleOwnerDetailsChange = (e) => {
    const { name, value } = e.target;
    setOwnerDetails(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOwnerPhotoUpload = (e) => {
    const file = e.target.files[0];
    
    // Validate file type for owner photo (exclude SVG)
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          ownerPhoto: 'Only JPG, JPEG, and PNG files are allowed for photos'
        }));
        return;
      }
    }
    
    setOwnerDetails(prev => ({ ...prev, ownerPhoto: file }));
    
    if (validationErrors.ownerPhoto) {
      setValidationErrors(prev => ({ ...prev, ownerPhoto: '' }));
    }
  };

  const handleFileUpload = (e, fileType) => {
    const files = Array.from(e.target.files);
    
    // Validate file types for images (exclude SVG)
    if (fileType === 'propertyImages' || fileType === 'ownerPhoto') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        setValidationErrors(prev => ({
          ...prev,
          [fileType]: 'Only JPG, JPEG, and PNG files are allowed for images'
        }));
        return;
      }
    }
    
    setUploadData(prev => ({
      ...prev,
      [fileType]: fileType === 'propertyImages' || fileType === 'propertyDocuments' ? files : files[0]
    }));
    
    if (validationErrors[fileType]) {
      setValidationErrors(prev => ({ ...prev, [fileType]: '' }));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateBasicInfo = () => {
    const errors = {};
    
    if (!basicInfo.name.trim()) {
      errors.name = 'Property name is required';
    } else if (basicInfo.name.trim().length < 3) {
      errors.name = 'Property name must be at least 3 characters';
    } else if (basicInfo.name.trim().split(/\s+/).length > 5) {
      errors.name = 'Property name should not exceed 5 words';
    } else if (!/^[a-zA-Z\s\-'&.]+$/.test(basicInfo.name.trim())) {
      errors.name = 'Property name can only contain letters, spaces, hyphens, apostrophes, ampersands, and periods';
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
    
    if (!basicInfo.opening_time.trim()) {
      errors.opening_time = 'Opening time is required';
    }
    
    if (!basicInfo.closing_time.trim()) {
      errors.closing_time = 'Closing time is required';
    }
    
    if (!basicInfo.pin_code.trim()) {
      errors.pin_code = 'Pin code is required';
    } else if (!/^\d{6}$/.test(basicInfo.pin_code.trim())) {
      errors.pin_code = 'Pin code must contain only numbers and be exactly 6 digits';
    }
    
    return errors;
  };

  const validateOwnerDetails = () => {
    const errors = {};
    
    if (!ownerDetails.ownerName.trim()) {
      errors.ownerName = 'Owner name is required';
    } else if (ownerDetails.ownerName.trim().split(/\s+/).length > 3) {
      errors.ownerName = 'Owner name should not exceed 3 words';
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
    
    if (!ownerDetails.ownerDashboardId.trim()) {
      errors.ownerDashboardId = 'Dashboard ID is required';
    } else if (ownerDetails.ownerDashboardId.trim().length < 3) {
      errors.ownerDashboardId = 'Dashboard ID must be at least 3 characters';
    }
    
    if (!ownerDetails.ownerDashboardPassword.trim()) {
      errors.ownerDashboardPassword = 'Dashboard password is required';
    } else {
      const password = ownerDetails.ownerDashboardPassword.trim();
      if (password.length < 8) {
        errors.ownerDashboardPassword = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(password)) {
        errors.ownerDashboardPassword = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(password)) {
        errors.ownerDashboardPassword = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(password)) {
        errors.ownerDashboardPassword = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.ownerDashboardPassword = 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
      }
    }
    
    return errors;
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

  const handleStep1Next = async (e) => {
    e.preventDefault();
    const errors = validateBasicInfo();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setStepLoading(true);
    
    try {
      const response = await saveBasicInfo(basicInfo, propertyId);
      setPropertyId(response.propertyId);
      toast.success('Basic information saved! OTP sent to your phone number.');
      setCurrentStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to save basic information');
    } finally {
      setStepLoading(false);
    }
  };

  const handleStep2Next = async (e) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const response = await verifyOtp(propertyId, otpCode);
      if (response.success) {
        toast.success(response.message || 'Phone number verified successfully!');
        setOtpCode('');
        setCurrentStep(3);
      }
    } catch (error) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleStep3Next = async (e) => {
    e.preventDefault();
    
    if (essentialAmenities.max_people_allowed < 1) {
      toast.error('Max Adults must be at least 1. Properties must allow guests to stay.');
      return;
    }
    
    if (essentialAmenities.bathrooms < 1) {
      toast.error('Bathrooms must be at least 1. Properties must have bathroom facilities.');
      return;
    }
    
    setStepLoading(true);
    
    try {
      await saveEssentialAmenities(propertyId, essentialAmenities);
      toast.success('Essential amenities saved successfully!');
      setCurrentStep(4);
    } catch (error) {
      toast.error(error.message || 'Failed to save essential amenities');
    } finally {
      setStepLoading(false);
    }
  };

  const handleStep4Next = async (e) => {
    e.preventDefault();
    setStepLoading(true);
    
    try {
      await saveExperienceAmenities(propertyId, experienceAmenities);
      toast.success('Experience amenities saved successfully!');
      setCurrentStep(5);
    } catch (error) {
      toast.error(error.message || 'Failed to save experience amenities');
    } finally {
      setStepLoading(false);
    }
  };

  const handleStep5Next = async (e) => {
    e.preventDefault();
    setStepLoading(true);
    
    try {
      await saveAdditionalAmenities(propertyId, additionalAmenities);
      toast.success('Additional amenities saved successfully!');
      setCurrentStep(6);
    } catch (error) {
      toast.error(error.message || 'Failed to save additional amenities');
    } finally {
      setStepLoading(false);
    }
  };

  const handleStep6Next = async (e) => {
    e.preventDefault();
    const errors = validateOwnerDetails();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setStepLoading(true);
    
    try {
      await saveOwnerDetails(
        propertyId, 
        ownerDetails.ownerName, 
        ownerDetails.ownerDescription,
        ownerDetails.ownerDashboardId,
        ownerDetails.ownerDashboardPassword
      );
      
      if (ownerDetails.ownerPhoto) {
        await uploadOwnerPhoto(propertyId, ownerDetails.ownerPhoto);
      }
      
      toast.success('Owner details saved successfully!');
      setCurrentStep(7);
    } catch (error) {
      toast.error(error.message || 'Failed to save owner details');
    } finally {
      setStepLoading(false);
    }
  };

  const clearAllStates = () => {
    setBasicInfo({
      name: '',
      description: '',
      type: 'farmhouse',
      per_day_price: '',
      opening_time: '',
      closing_time: '',
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
      bedrooms: 0,
      bathrooms: 1,
      beds: 0,
      bed_linens: false,
      towels: false,
      toiletries: false,
      mirror: false,
      hair_dryer: false,
      attached_bathrooms: false,
      bathtub: false,
      max_people_allowed: 1,
      max_children_allowed: 0,
      max_pets_allowed: 0
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
      ownerPhoto: null,
      ownerDashboardId: '',
      ownerDashboardPassword: ''
    });
    setValidationErrors({});
  };

  const handleStep7Next = async (e) => {
    e.preventDefault();
    
    const errors = validateFileUploads();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setStepLoading(true);
    
    try {
      await completePropertyRegistration(
        propertyId,
        uploadData.propertyImages,
        uploadData.propertyDocuments,
        uploadData.aadhaarCard,
        uploadData.panCard
      );
      
      toast.success('Documents uploaded successfully! Now add credits to activate your property.');
      setDocumentsUploaded(true);
      setCurrentStep(8);
    } catch (error) {
      toast.error(error.message || 'Failed to upload documents. Please try again.');
    } finally {
      setStepLoading(false);
    }
  };

  const handleRechargeAmountChange = (e) => {
    setRechargeAmount(e.target.value);
  };

  const handleStep8Next = async (e) => {
    e.preventDefault();
    const amount = parseFloat(rechargeAmount);
    
    if (!amount || amount < MINIMUM_PROPERTY_ACTIVATION_AMOUNT) {
      toast.error(`Minimum amount is ₹${MINIMUM_PROPERTY_ACTIVATION_AMOUNT} to activate your property`);
      return;
    }

    initiatePayment(amount);
  };

  const handleGoToHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      {isRegistrationComplete ? (
        <RegistrationSuccessMessage onGoToHome={handleGoToHome} />
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

              <ProcessExplanation />
              <ProgressIndicator currentStep={currentStep} />
              
              {currentStep === 1 && (
                <Step1BasicInfo
                  basicInfo={basicInfo}
                  validationErrors={validationErrors}
                  onBasicInfoChange={handleBasicInfoChange}
                  onLocationSelected={handleLocationSelected}
                  onAddressInputChange={handleAddressInputChange}
                  onSubmit={handleStep1Next}
                />
              )}
              
              {currentStep === 2 && (
                <Step2OTPVerification
                  otpCode={otpCode}
                  onOtpChange={handleOtpChange}
                  onSubmit={handleStep2Next}
                  onPrevious={handlePrevious}
                  isVerifying={isVerifying}
                />
              )}

              {currentStep === 3 && (
                <Step3EssentialAmenities
                  essentialAmenities={essentialAmenities}
                  onToggleChange={handleEssentialToggleChange}
                  onNumberChange={handleNumberChange}
                  onSubmit={handleStep3Next}
                  onPrevious={handlePrevious}
                />
              )}
              
              {currentStep === 4 && (
                <Step4ExperienceAmenities
                  experienceAmenities={experienceAmenities}
                  onToggleChange={handleExperienceToggleChange}
                  onSubmit={handleStep4Next}
                  onPrevious={handlePrevious}
                />
              )}
              
              {currentStep === 5 && (
                <Step5AdditionalAmenities
                  additionalAmenities={additionalAmenities}
                  onToggleChange={handleAdditionalToggleChange}
                  onSubmit={handleStep5Next}
                  onPrevious={handlePrevious}
                />
              )}
              
              {currentStep === 6 && (
                <Step6OwnerDetails
                  ownerDetails={ownerDetails}
                  validationErrors={validationErrors}
                  onOwnerDetailsChange={handleOwnerDetailsChange}
                  onOwnerPhotoUpload={handleOwnerPhotoUpload}
                  onSubmit={handleStep6Next}
                  onPrevious={handlePrevious}
                />
              )}
              
              {currentStep === 7 && (
                <Step7DocumentUpload
                  uploadData={uploadData}
                  validationErrors={validationErrors}
                  success={success}
                  loading={stepLoading}
                  onFileUpload={handleFileUpload}
                  onSubmit={handleStep7Next}
                  onPrevious={handlePrevious}
                />
              )}

              {currentStep === 8 && (
                <Step8CreditRecharge
                  rechargeAmount={rechargeAmount}
                  onRechargeAmountChange={handleRechargeAmountChange}
                  onSubmit={handleStep8Next}
                  onPrevious={handlePrevious}
                  loading={paymentLoading}
                  currentBalance={0}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyRegistrationForm;
