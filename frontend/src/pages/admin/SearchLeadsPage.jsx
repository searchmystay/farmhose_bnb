import React from 'react'
import { useAdminSearchLeads } from '../../hooks/useAdmin'

export default function SearchLeadsPage() {
  const { leads, totalCount, page, setPage, isLoading, error, refetch } = useAdminSearchLeads()

  const limit = 25
  const totalPages = Math.ceil(totalCount / limit)

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
        <span className="text-gray-600 text-sm sm:text-base font-medium">Loading search leads...</span>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 mb-4 text-sm sm:text-base font-medium">{error}</p>
        <button onClick={refetch} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base cursor-pointer">
          Try Again
        </button>
      </div>
    </div>
  )

  const renderEmptyState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-gray-600 text-base sm:text-lg font-medium">No search leads found</p>
        <p className="text-gray-500 text-sm sm:text-base mt-2">When users perform property searches, they will appear here</p>
      </div>
    </div>
  )

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const formatPropertyType = (type) => {
    if (type === 'both') return 'Farmhouse & BnB'
    if (type === 'farmhouse') return 'Farmhouse'
    if (type === 'bnb') return 'BnB'
    return type || 'N/A'
  }

  const renderLeadRow = (lead, index) => {
    const serialNumber = (page - 1) * limit + index + 1
    return (
      <tr key={lead.id} className="hover:bg-gray-50 border-b border-gray-100 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{serialNumber}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{lead.mobile_number || 'N/A'}</td>
        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{lead.location_name || 'N/A'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            lead.property_type === 'farmhouse' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
            lead.property_type === 'bnb' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
            'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {formatPropertyType(lead.property_type)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {lead.check_in_date || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {lead.check_out_date || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {lead.number_of_adults} A, {lead.number_of_children} C, {lead.number_of_pets} P
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {lead.created_at || 'N/A'}
        </td>
      </tr>
    )
  }

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState()
  if (leads.length === 0) return renderEmptyState()

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {leads.map(renderLeadRow)}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, totalCount)}</span> of{' '}
                <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
                        page === pNum
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
