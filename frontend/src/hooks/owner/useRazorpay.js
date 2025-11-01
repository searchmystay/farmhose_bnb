import { useState } from 'react'
import { createPaymentOrder, sendPaymentWebhook } from '../../services/razorpayService'

const useRazorpay = (farmhouseId, onSuccess) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const initiatePayment = async (amount) => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const scriptLoaded = await loadRazorpayScript()
      
      if (!scriptLoaded) {
        setError('Failed to load Razorpay. Please check your internet connection.')
        setLoading(false)
        return
      }

      const orderData = await createPaymentOrder(farmhouseId, amount)

      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'Farmhouse Listing',
        description: 'Recharge Credits',
        handler: async (response) => {
          try {
            const webhookData = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              status: 'success',
            }

            await sendPaymentWebhook(webhookData)
            
            if (onSuccess) {
              onSuccess()
            }
          } catch (err) {
            setError(err.message || 'Payment verification failed')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled by user')
          },
        },
        theme: {
          color: '#2563eb',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

      razorpay.on('payment.failed', async (response) => {
        try {
          const webhookData = {
            order_id: response.error.metadata.order_id,
            status: 'failed',
          }
          
          await sendPaymentWebhook(webhookData)
        } catch (err) {
          console.error('Failed to send failure webhook:', err)
        }
        
        setError('Payment failed. Please try again.')
        setLoading(false)
      })

    } catch (err) {
      setError(err.message || 'Failed to initiate payment')
      setLoading(false)
    }
  }

  return {
    initiatePayment,
    loading,
    error,
  }
}

export default useRazorpay
