import React from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/Footer'

const CancellationPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation Policy - SearchMyStay</title>
        <meta name="description" content="Cancellation Policy for SearchMyStay - Discovery platform policies" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Cancellation Policy – SearchMyStay</h1>
            <p className="text-gray-600 mt-2">Effective Date: January 16, 2026</p>
            <p className="text-sm text-gray-500 mt-1">(Discovery Platform – No Bookings Handled)</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            <p className="text-gray-700 mb-6">
              SearchMyStay is a search and discovery platform that helps guests find farmhouses, villas, and BnBs and connect directly with hosts.
            </p>

            <p className="text-gray-700 mb-6">
              <strong>SearchMyStay does not process bookings or handle cancellations.</strong>
            </p>

            <p className="text-gray-700 mb-6">
              All booking confirmations, cancellations, and related communications are handled directly between the guest and the host.
            </p>

            <p className="text-gray-700 mb-6">
              Cancellation policies vary from property to property and are determined solely by the host.
            </p>

            {/* Key Points */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Points</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-3">
                <li>Each property host sets their own cancellation policy</li>
                <li>Cancellation terms may vary based on property type, season, and booking dates</li>
                <li>Some hosts may offer flexible cancellation, others may have strict policies</li>
                <li>Always confirm cancellation terms before making any payment to the host</li>
                <li>Maintain written communication with the host regarding cancellation terms</li>
              </ul>
            </section>

            {/* Recommendations */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">We strongly recommend guests to:</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Confirm cancellation policies with the host before booking</li>
                <li>Understand the cancellation timeline and any penalties</li>
                <li>Keep all communication documented</li>
                <li>Review cancellation terms for special events or peak seasons</li>
              </ul>
            </section>

            {/* Common Cancellation Types */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Cancellation Policy Types</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Flexible</h3>
                  <p className="text-sm text-green-700">Usually allows cancellation up to 24-48 hours before check-in with full or partial refund</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Moderate</h3>
                  <p className="text-sm text-yellow-700">Typically requires 3-7 days notice for cancellation with varying refund amounts</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Strict</h3>
                  <p className="text-sm text-red-700">May require 14+ days notice or offer limited/no refunds for cancellations</p>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Disclaimer</h3>
                <p className="text-gray-700">
                  <strong>SearchMyStay is not responsible for any cancellation disputes, policies, or related issues between guests and hosts.</strong> All cancellation-related matters must be resolved directly between the guest and the property host.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-700">
                For platform-related queries: searchmystay07@gmail.com
              </p>
              <p className="text-sm text-gray-500 mt-2">
                For booking cancellations, please contact the property host directly.
              </p>
            </section>

          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default CancellationPolicyPage