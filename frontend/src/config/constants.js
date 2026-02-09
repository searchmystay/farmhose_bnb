// Frontend Configuration Constants
export const MINIMUM_PROPERTY_ACTIVATION_AMOUNT = 1000;

// API Endpoints
export const API_BASE_URL = '/api';

// Validation Rules
export const VALIDATION_RULES = {
  PROPERTY_NAME: {
    MIN_LENGTH: 3,
    MAX_WORDS: 5
  },
  PHONE_NUMBER: {
    LENGTH: 10
  },
  PIN_CODE: {
    LENGTH: 6
  },
  OTP: {
    LENGTH: 6,
    EXPIRY_MINUTES: 10
  },
  PASSWORD: {
    MIN_LENGTH: 8
  }
};