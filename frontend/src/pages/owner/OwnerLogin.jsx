import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Eye, EyeSlash, Lock, User, Buildings } from 'phosphor-react'
import { useOwnerAuth } from '../../hooks/useOwner'

function OwnerLogin() {
  const [ownerId, setOwnerId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useOwnerAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(ownerId, password)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-2">
          Owner Dashboard ID
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="ownerId"
            type="text"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            placeholder="Enter your owner ID"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !ownerId.trim() || !password.trim()}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )

  const renderLoginCard = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Buildings className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Owner Login</h1>
        <p className="text-gray-600">Access your property dashboard</p>
      </div>
      
      {renderLoginForm()}
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Owner Login - Farmhouse Listing</title>
        <meta name="description" content="Secure owner login for farmhouse property dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {renderLoginCard()}
        </div>
      </div>
    </>
  )
}

export default OwnerLogin
