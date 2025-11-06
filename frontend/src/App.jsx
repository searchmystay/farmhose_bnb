import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { useState, useEffect } from 'react'
import React from 'react'
import { checkAuthStatus } from './services/adminApi'
import { checkOwnerAuthStatus } from './services/ownerApi'
import HomePage from './pages/website/HomePage'
import SearchPage from './pages/website/SearchPage'
import PropertiesPage from './pages/website/PropertiesPage'
import PropertyDetailPage from './pages/website/PropertyDetailPage'
import RegisterPropertyPage from './pages/website/RegisterPropertyPage'
import WishlistPage from './pages/website/WishlistPage'
import AdminLogin from './pages/admin/AdminLogin'
import MainAdminPage from './pages/admin/MainAdminPage'
import OwnerLogin from './pages/owner/OwnerLogin'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import ReviewSubmissionPage from './pages/website/ReviewSubmissionPage'

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus()
        setIsAuthenticated(response.status === 'success')
        if (response.status === 'success') {
          setUserData(response.backend_data)
        }
      } catch (error) {
        setIsAuthenticated(false)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? React.cloneElement(children, { userData }) : <Navigate to="/admin/login" replace />
}

function OwnerProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ownerData, setOwnerData] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkOwnerAuthStatus()
        setIsAuthenticated(response.status === 'success')
        if (response.status === 'success') {
          setOwnerData(response.backend_data)
        }
      } catch (error) {
        setIsAuthenticated(false)
        setOwnerData(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? React.cloneElement(children, { ownerData }) : <Navigate to="/owner" replace />
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="font-sans antialiased">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/farmhouse" element={<PropertiesPage propertyType="farmhouse" />} />
            <Route path="/bnb" element={<PropertiesPage propertyType="bnb" />} />
            <Route path="/property/:propertyId" element={<PropertyDetailPage />} />
            <Route path="/register-property" element={<RegisterPropertyPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/reviews/:farmhouseId" element={<ReviewSubmissionPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <MainAdminPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/owner" element={<OwnerLogin />} />
            <Route path="/owner/:farmhouseId" element={
              <OwnerProtectedRoute>
                <OwnerDashboard />
              </OwnerProtectedRoute>
            } />
          </Routes>
          <Toaster position="bottom-left" richColors />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
