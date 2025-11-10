import React from 'react';

// ValidationError Component
export const ValidationError = ({ error }) => {
  if (!error) return null;
  
  return (
    <p className="mt-1 text-sm text-red-600">{error}</p>
  );
};

// TextInput Component
export const TextInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  error, 
  required = false,
  type = "text",
  maxLength,
  pattern,
  onKeyPress,
  className = ""
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
        } ${className}`}
        placeholder={placeholder}
        maxLength={maxLength}
        pattern={pattern}
        onKeyPress={onKeyPress}
      />
      <ValidationError error={error} />
    </div>
  );
};

// TextArea Component
export const TextArea = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  error, 
  required = false,
  rows = 4,
  className = ""
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
        } ${className}`}
        placeholder={placeholder}
      />
      <ValidationError error={error} />
    </div>
  );
};

// NumberInput Component
export const NumberInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  error, 
  required = false,
  min,
  max,
  className = "",
  centered = false
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
        } ${centered ? 'text-center text-lg font-medium' : ''} ${className}`}
        placeholder={placeholder}
      />
      <ValidationError error={error} />
    </div>
  );
};

// TimePickerInput Component
export const TimePickerInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  error 
}) => {
  const handleHourChange = (e) => {
    const hour = parseInt(e.target.value);
    const minute = value ? value.split(':')[1] : '00';
    const isPM = value ? parseInt(value.split(':')[0]) >= 12 : false;
    const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    onChange({ target: { name, value: `${String(hour24).padStart(2, '0')}:${minute}` } });
  };

  const handleMinuteChange = (e) => {
    const hour = value ? value.split(':')[0] : '00';
    onChange({ target: { name, value: `${hour}:${e.target.value}` } });
  };

  const handlePeriodChange = (e) => {
    const [hour24, minute] = value ? value.split(':') : ['00', '00'];
    const hour12 = parseInt(hour24) % 12 || 12;
    const newHour24 = e.target.value === 'PM' ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
    onChange({ target: { name, value: `${String(newHour24).padStart(2, '0')}:${minute}` } });
  };

  const hour12 = value ? (parseInt(value.split(':')[0]) % 12 || 12) : '';
  const minute = value ? value.split(':')[1] : '';
  const period = value && parseInt(value.split(':')[0]) >= 12 ? 'PM' : 'AM';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          value={hour12}
          onChange={handleHourChange}
          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
        >
          <option value="">HH</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
          ))}
        </select>
        <select
          value={minute}
          onChange={handleMinuteChange}
          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
        >
          <option value="">MM</option>
          {[...Array(60)].map((_, i) => (
            <option key={i} value={String(i).padStart(2, '0')}>{String(i).padStart(2, '0')}</option>
          ))}
        </select>
        <select
          value={period}
          onChange={handlePeriodChange}
          className={`w-24 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <ValidationError error={error} />
    </div>
  );
};

// ToggleSwitch Component
export const ToggleSwitch = ({ 
  name, 
  label, 
  description, 
  checked, 
  onChange 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(name)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          checked ? 'bg-green-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// FileUploadBox Component
export const FileUploadBox = ({ 
  fileType, 
  label, 
  accept, 
  multiple = false, 
  onChange, 
  error, 
  value,
  required = false 
}) => {
  const getFileTypeHint = () => {
    if (accept.includes('image')) {
      return 'PNG, JPG, JPEG up to 2MB each';
    } else if (accept.includes('.pdf,.doc,.docx')) {
      return 'PDF, DOC, DOCX up to 10MB each';
    } else {
      return 'PDF up to 5MB (both sides with clear images)';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
        error 
          ? 'border-red-300 hover:border-red-400' 
          : 'border-gray-300 hover:border-green-400'
      }`}>
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500">
              <span>Upload {multiple ? 'files' : 'file'}</span>
              <input
                type="file"
                className="sr-only"
                accept={accept}
                multiple={multiple}
                onChange={(e) => onChange(e, fileType)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {getFileTypeHint()}
          </p>
        </div>
      </div>
      {value && (
        <div className="mt-2">
          {Array.isArray(value) ? (
            <p className="text-sm text-green-600">{value.length} files selected</p>
          ) : (
            <p className="text-sm text-green-600">{value.name}</p>
          )}
        </div>
      )}
      <ValidationError error={error} />
    </div>
  );
};

// SectionHeader Component
export const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

// StepNavigation Component
export const StepNavigation = ({ 
  onPrevious, 
  onNext, 
  nextLabel = "Next Step", 
  loading = false, 
  showPrevious = true,
  nextButtonColor = "green"
}) => {
  const buttonColors = {
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      ring: 'focus:ring-green-500'
    },
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      ring: 'focus:ring-blue-500'
    }
  };

  const colors = buttonColors[nextButtonColor] || buttonColors.green;

  return (
    <div className="flex justify-between pt-6 border-t">
      {showPrevious ? (
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Previous
        </button>
      ) : (
        <div></div>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`px-8 py-3 ${colors.bg} text-white rounded-lg ${colors.hover} focus:ring-2 ${colors.ring} focus:ring-offset-2 transition-all font-medium ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
            : ''
        }`}
      >
        {loading ? 'Submitting...' : nextLabel}
      </button>
    </div>
  );
};
