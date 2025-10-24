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
            <p className="text-gray-400 text-sm">info@searchmystay.com</p>
            <p className="text-gray-400 text-sm">+91 9999999999</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-400 text-xs">
          <p>&copy; 2025 SearchMyStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer