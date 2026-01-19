import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ACCESS_PASSWORD, MAX_ATTEMPTS, BLOCK_DURATION_MINUTES } from '../config/comingSoon'

const ComingSoon = ({ onAccessGranted }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Configuration
  const CORRECT_PASSWORD = ACCESS_PASSWORD
  const MAX_ATTEMPTS_CONFIG = MAX_ATTEMPTS
  const BLOCK_DURATION = BLOCK_DURATION_MINUTES * 60 * 1000

  useEffect(() => {
    // Check if user was previously blocked
    const blockData = localStorage.getItem('sms_block_data')
    if (blockData) {
      const { timestamp, attemptCount } = JSON.parse(blockData)
      const timeElapsed = Date.now() - timestamp
      
      if (timeElapsed < BLOCK_DURATION && attemptCount >= MAX_ATTEMPTS_CONFIG) {
        setIsBlocked(true)
        setAttempts(attemptCount)
        const remainingTime = Math.ceil((BLOCK_DURATION - timeElapsed) / 60000)
        setError(`Too many failed attempts. Try again in ${remainingTime} minutes.`)
      } else if (timeElapsed >= BLOCK_DURATION) {
        // Reset block if time has elapsed
        localStorage.removeItem('sms_block_data')
        setAttempts(0)
      } else {
        setAttempts(attemptCount)
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isBlocked) {
      return
    }

    // Handle empty input
    if (!password.trim()) {
      setError('Please enter the access password')
      return
    }

    // Check password
    if (password === CORRECT_PASSWORD) {
      // Success: Save access flag and notify parent
      localStorage.setItem('sms_access_granted', 'true')
      localStorage.removeItem('sms_block_data')
      setError('')
      onAccessGranted()
    } else {
      // Wrong password
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts >= MAX_ATTEMPTS_CONFIG) {
        setIsBlocked(true)
        setError(`Too many failed attempts. Access blocked for 15 minutes.`)
        localStorage.setItem('sms_block_data', JSON.stringify({
          timestamp: Date.now(),
          attemptCount: newAttempts
        }))
      } else {
        setError(`Incorrect password. ${MAX_ATTEMPTS_CONFIG - newAttempts} attempts remaining.`)
      }
      
      setPassword('')
    }
  }

  return (
    <>
      <Helmet>
        <title>Coming Soon - SearchMyStay</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="SearchMyStay is coming soon. Premium farmhouse and BnB booking platform." />
      </Helmet>
      
      {/* JavaScript disabled message */}
      <noscript>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f3f4f6',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>JavaScript Required</h1>
            <p>Please enable JavaScript in your browser to access SearchMyStay.</p>
          </div>
        </div>
      </noscript>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/search_my_stay_logo.svg" 
                alt="SearchMyStay Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">SearchMyStay</h1>
            <p className="text-gray-600">Premium Farmhouse & BnB Booking</p>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">🚀 Coming Soon</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We're putting the finishing touches on something amazing. 
              Get ready to discover and book premium farmhouses and BnBs like never before.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Access Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isBlocked}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="Enter access password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isBlocked}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isBlocked}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isBlocked ? 'Access Blocked' : 'Enter Website'}
            </button>
          </form>

          {/* Attempt Counter */}
          {attempts > 0 && !isBlocked && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Failed attempts: {attempts}/{MAX_ATTEMPTS_CONFIG}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Need access? Contact our team for the password.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ComingSoon