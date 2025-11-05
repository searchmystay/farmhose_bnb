import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import HomePage from './pages/website/HomePage'
import SearchPage from './pages/website/SearchPage'
import PropertiesPage from './pages/website/PropertiesPage'
import PropertyDetailPage from './pages/website/PropertyDetailPage'
import RegisterPropertyPage from './pages/website/RegisterPropertyPage'
import WishlistPage from './pages/website/WishlistPage'
import AdminLogin from './pages/admin/AdminLogin'
import MainAdminPage from './pages/admin/MainAdminPage'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import ReviewSubmissionPage from './pages/website/ReviewSubmissionPage'

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
            <Route path="/admin" element={<MainAdminPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/owner-dashboard/:farmhouseId" element={<OwnerDashboard />} />
          </Routes>
          <Toaster position="bottom-left" richColors />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
