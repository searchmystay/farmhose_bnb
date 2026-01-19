import React from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/Footer'

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - SearchMyStay</title>
        <meta name="description" content="Privacy Policy for SearchMyStay - How we collect, use and protect your data" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy – SearchMyStay</h1>
            <p className="text-gray-600 mt-2">Effective Date: January 16, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            <p className="text-gray-700 mb-6">
              SearchMyStay ("we", "our", "us") is committed to protecting the privacy of users and hosts who access or use our website.
            </p>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Name, phone number, and email address</li>
                <li>Property details provided by hosts</li>
                <li>Account and transaction details related to host recharges</li>
                <li>Basic technical data such as IP address, browser type, and device information</li>
              </ul>
            </section>

            {/* Use of Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Use of Information</h2>
              <p className="text-gray-700">
                Information is used to enable communication, manage accounts, process host payments, improve platform security, and comply with legal requirements.
              </p>
            </section>

            {/* Payments */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payments</h2>
              <p className="text-gray-700">
                Payments are processed securely through Razorpay. We do not store card, UPI, or bank details.
              </p>
            </section>

            {/* Sharing of Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sharing of Information</h2>
              <p className="text-gray-700">
                Information is not sold or rented and may be shared only with service providers or when legally required.
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-700">
                Cookies may be used to improve website experience.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700">
                Reasonable security measures are implemented to protect data.
              </p>
            </section>

            {/* User Rights */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Rights</h2>
              <p className="text-gray-700">
                Users may request access, correction, or deletion of their data.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-700">
                searchmystay07@gmail.com
              </p>
            </section>

          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default PrivacyPolicyPage