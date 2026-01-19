import React from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/Footer'

const ContactUsPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - SearchMyStay</title>
        <meta name="description" content="Get in touch with SearchMyStay - We're here to help with your queries" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us – SearchMyStay</h1>
            <p className="text-gray-600 mt-2">Effective Date: January 16, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Have questions or need help using SearchMyStay?</h2>
              <p className="text-gray-700 text-lg">We're happy to assist.</p>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              
              {/* Email */}
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-700">searchmystay07@gmail.com</p>
              </div>

              {/* Phone */}
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone / WhatsApp</h3>
                <p className="text-gray-700">+91 820 966 5356</p>
              </div>

            </div>

            {/* Support Hours */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Hours</h3>
                <p className="text-gray-700">Monday – Sunday | 10:00 AM – 7:00 PM</p>
              </div>
            </div>

            {/* Important Note */}
            <section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Note</h3>
                <p className="text-gray-700">
                  For booking availability, pricing, or stay-related queries, please contact the host directly using the details provided on the property page.
                </p>
              </div>
            </section>

            {/* Quick Contact Form */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows="4" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
            </section>

          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default ContactUsPage