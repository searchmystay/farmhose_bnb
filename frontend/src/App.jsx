import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './pages/website/HomePage'
import PropertiesPage from './pages/website/PropertiesPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="font-sans antialiased">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/farmhouse" element={<PropertiesPage propertyType="farmhouse" />} />
            <Route path="/bnb" element={<PropertiesPage propertyType="bnb" />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
