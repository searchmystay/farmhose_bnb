import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { adminLogin } from '../services/adminApi'

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (password) => {
    if (!password) {
      toast.error('Password is required')
      return
    }

    setIsLoading(true)
    try {
      const result = await adminLogin({ password })
      toast.success('Login successful')
      // TODO: Navigate to dashboard when created
      // navigate('/admin/dashboard')
      return result
    } catch (error) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading
  }
}