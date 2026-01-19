import React from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/Footer'

const RefundPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation & Refund Policy - SearchMyStay</title>
        <meta name="description" content="Cancellation & Refund Policy for SearchMyStay - Discovery platform policies" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Cancellation & Refund Policy – SearchMyStay</h1>
            <p className="text-gray-600 mt-2">Effective Date: January 16, 2026</p>
            <p className="text-sm text-gray-500 mt-1">(Discovery Platform – No Payments Handled)</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            <p className="text-gray-700 mb-6">
              SearchMyStay is a search and discovery platform that helps guests find farmhouses, villas, and BnBs and connect directly with hosts.
            </p>

            <p className="text-gray-700 mb-6">
              <strong>SearchMyStay does not process bookings, payments, cancellations, or refunds.</strong>
            </p>

            <p className="text-gray-700 mb-6">
              All booking-related discussions, confirmations, cancellations, and refunds are handled directly between the guest and the host.
            </p>

            <p className="text-gray-700 mb-6">
              Cancellation and refund policies vary from property to property and are determined solely by the host.
            </p>

            {/* Recommendations */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">We strongly recommend guests to:</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Confirm cancellation and refund terms with the host before making any payment.</li>
                <li>Maintain written communication with the host for clarity.</li>
              </ul>
            </section>

            {/* Disclaimer */}
            <section className="mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Important:</strong> SearchMyStay shall not be responsible for any disputes, cancellations, refunds, or payment-related issues between guests and hosts.
                </p>
              </div>
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

export default RefundPolicyPage