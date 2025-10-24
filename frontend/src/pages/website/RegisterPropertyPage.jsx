import React, { useState } from 'react';

const RegisterPropertyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'farmhouse',
    phone_number: '',
    address: '',
    pin_code: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    console.log('Basic Info:', formData);
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
  const renderProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Step 1 of 4</span>
        <span>25% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all duration-300" 
             style={{width: '25%'}}></div>
      </div>
    </div>
  );

  // Render the basic information form fields
  const renderBasicInfoForm = () => (
    <form onSubmit={handleNextStep} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
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
          value={formData.description}
          onChange={handleInputChange}
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
          value={formData.type}
          onChange={handleInputChange}
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
            value={formData.phone_number}
            onChange={handleInputChange}
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
          value={formData.address}
          onChange={handleInputChange}
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
          value={formData.pin_code}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="Enter pin code"
          maxLength="6"
          pattern="[0-9]{6}"
        />
      </div>

      {renderActionButtons()}
    </form>
  );

  // Render the action buttons at bottom
  const renderActionButtons = () => (
    <div className="flex justify-end pt-6 border-t">
      <button
        type="submit"
        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
      >
        Next Step
      </button>
    </div>
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
          {renderBasicInfoForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterPropertyPage;