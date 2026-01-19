import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center md:flex md:justify-center md:items-center md:space-x-16">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">SearchMyStay</h3>
            <p className="text-gray-400 text-sm">Verified farmhouses and BnBs for your perfect getaway.</p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold mb-2 text-sm">Contact Info</h4>
            <p className="text-gray-400 text-sm">Searchmystay07@gmail.com</p>
            <p className="text-gray-400 text-sm">+91 820 966 5356</p>
          </div>
        </div>
        
        {/* Legal Links */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-3">
            <Link 
              to="/privacy-policy" 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-conditions" 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
            <Link 
              to="/refund-policy" 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Refund Policy
            </Link>
            <Link 
              to="/contact-us" 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
          <div className="text-center text-gray-400 text-xs">
            <p>&copy; 2025 SearchMyStay. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer