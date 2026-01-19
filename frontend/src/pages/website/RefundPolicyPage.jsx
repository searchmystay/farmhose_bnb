import React from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/Footer'

const RefundPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - SearchMyStay</title>
        <meta name="description" content="Refund Policy for SearchMyStay - Discovery platform policies" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Refund Policy – SearchMyStay</h1>
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
              <strong>SearchMyStay does not process bookings, payments, or refunds.</strong>
            </p>

            <p className="text-gray-700 mb-6">
              All payment transactions and refunds are handled directly between the guest and the host.
            </p>

            <p className="text-gray-700 mb-6">
              Refund policies vary from property to property and are determined solely by the host.
            </p>

            {/* Key Points */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Points About Refunds</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-3">
                <li>Each property host sets their own refund policy</li>
                <li>Refund amounts and processing times vary by host</li>
                <li>Some hosts may offer full refunds, others partial or no refunds</li>
                <li>Refund eligibility depends on the host's specific terms and conditions</li>
                <li>Emergency situations may be handled differently by different hosts</li>
              </ul>
            </section>

            {/* Recommendations */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">We strongly recommend guests to:</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Confirm refund policies and terms with the host before making any payment</li>
                <li>Understand the refund timeline and processing method</li>
                <li>Maintain written communication with the host for all refund requests</li>
                <li>Keep records of all transactions and communications</li>
              </ul>
            </section>

            {/* Common Refund Types */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Refund Scenarios</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Full Refund</h3>
                  <p className="text-sm text-green-700">Usually offered for early cancellations or host-initiated cancellations</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Partial Refund</h3>
                  <p className="text-sm text-yellow-700">Common for late cancellations, often minus processing fees or penalties</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">No Refund</h3>
                  <p className="text-sm text-blue-700">Applied for same-day cancellations or no-shows, depending on host policy</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Emergency Refund</h3>
                  <p className="text-sm text-purple-700">Special circumstances may be considered by hosts on case-by-case basis</p>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Disclaimer</h3>
                <p className="text-gray-700">
                  <strong>SearchMyStay is not responsible for any refund disputes, processing delays, or refund-related issues between guests and hosts.</strong> All refund matters must be resolved directly between the guest and the property host.
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
                For refund requests, please contact the property host directly.
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