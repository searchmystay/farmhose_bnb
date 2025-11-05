import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ownerLogin } from '../services/ownerApi'

export const useOwnerAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (ownerId, password) => {
    if (!ownerId) {
      toast.error('Owner ID is required')
      return
    }

    if (!password) {
      toast.error('Password is required')
      return
    }

    setIsLoading(true)
    try {
      const result = await ownerLogin({ owner_id: ownerId, password })
      
      if (result.success && result.data) {
        toast.success(`Welcome back, ${result.data.owner_name || 'Owner'}!`)
        navigate(`/owner/dashboard/${result.data.farmhouse_id}`)
      }
      
      return result
    } catch (error) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading }
}
