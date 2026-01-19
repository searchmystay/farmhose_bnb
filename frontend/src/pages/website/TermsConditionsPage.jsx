import React from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/Footer'

const TermsConditionsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - SearchMyStay</title>
        <meta name="description" content="Terms & Conditions for SearchMyStay - Platform usage guidelines and policies" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions – SearchMyStay</h1>
            <p className="text-gray-600 mt-2">Effective Date: January 16, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">

            {/* Platform Usage */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Usage</h2>
              <p className="text-gray-700">
                SearchMyStay provides a platform to discover properties and connect users with hosts. We do not own or manage any properties.
              </p>
            </section>

            {/* User & Host Responsibilities */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User & Host Responsibilities</h2>
              <p className="text-gray-700">
                Users and hosts must provide accurate information. Hosts are responsible for listings. Users must verify details independently.
              </p>
            </section>

            {/* Payments */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payments</h2>
              <p className="text-gray-700">
                Payments apply only to hosts and are processed via Razorpay. Payments are non-refundable unless stated otherwise.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prohibited Activities</h2>
              <p className="text-gray-700">
                Misuse, false information, or unlawful use is prohibited.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700">
                SearchMyStay is not liable for disputes, losses, or service quality.
              </p>
            </section>

            {/* Account Suspension */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Suspension</h2>
              <p className="text-gray-700">
                Accounts may be suspended for violations.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700">
                All platform content belongs to SearchMyStay.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700">
                Governed by the laws of India.
              </p>
            </section>

            {/* Changes */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Changes</h2>
              <p className="text-gray-700">
                Terms may be updated periodically.
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

export default TermsConditionsPage