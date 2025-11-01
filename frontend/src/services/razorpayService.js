import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const createPaymentOrder = async (farmhouseId, amount) => {
  const response = await apiClient.post('/create-payment-order', {
    farmhouse_id: farmhouseId,
    amount: amount,
  })
  
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to create payment order')
  }
  
  return result.backend_data
}

export const sendPaymentWebhook = async (paymentData) => {
  const response = await apiClient.post('/payment-webhook', paymentData)
  
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Payment verification failed')
  }
  
  return result
}
