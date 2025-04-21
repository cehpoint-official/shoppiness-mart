import { useEffect, useState } from "react";

// Skeleton loader components
const TableRowSkeleton = () => (
  <tr className="border-b border-t animate-pulse">
    <td className="py-4 px-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded"></div>
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="grid grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="ml-auto w-24 h-8 bg-gray-200 rounded"></div>
    </td>
  </tr>
);

const CardSkeleton = () => (
  <div className="border-b border-t animate-pulse mb-4 p-4 md:hidden">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded"></div>
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="mt-4 flex justify-end">
      <div className="w-24 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

function ShopRequests({ onViewDetails, onlineShops, loading }) {
  const [activeTab, setActiveTab] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredData = onlineShops.filter((item) =>
    activeTab === "Active"
      ? item.status === "Active"
      : item.status === "Inactive"
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to first page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of the list on mobile when changing pages
      if (window.innerWidth < 768) {
        document.getElementById("shopListContainer")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
        All Online shops
      </h1>
      <div className="bg-white p-3 md:p-6 rounded-xl border shadow-md">
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
          <button
            className={`px-3 md:px-6 py-2 rounded-full border transition-all text-sm md:text-base ${
              activeTab === "Active"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Active")}
          >
            Active Product/Service
          </button>
          <button
            className={`px-3 md:px-6 py-2 rounded-full border transition-all text-sm md:text-base ${
              activeTab === "Inactive"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Inactive")}
          >
            Inactive Product/Service
          </button>
        </div>

        <div id="shopListContainer" className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {loading ? (
              [...Array(ITEMS_PER_PAGE)].map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((shop) => (
                <div key={shop.id} className="border-b border-t p-3 sm:p-4">
                  {/* Shop header - logo and name */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <img
                      src={shop.logoUrl}
                      alt={shop.businessName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-base sm:text-lg">{shop.businessName}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {shop.location}
                      </p>
                    </div>
                  </div>
                  
                  {/* Shop details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="truncate">{shop.mobileNumber}</p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                    <div>
                      <p className="truncate">{shop.email}</p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                    <div>
                      <p>{shop.createdDate}</p>
                      <p className="text-xs text-gray-500">Requested date</p>
                    </div>
                    <div>
                      {activeTab === "Active" ? (
                        <div>
                          <p>{shop.approvedDate}</p>
                          <p className="text-xs text-gray-500">Activation Date</p>
                        </div>
                      ) : (
                        <div>
                          <p>{shop.inactiveDate}</p>
                          <p className="text-xs text-red-500">Inactivation Date</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* View details button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onViewDetails(shop)}
                      className="px-4 py-1.5 text-sm border border-blue-500 text-blue-500 rounded-md
                        hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-600">
                {activeTab === "Active"
                  ? "No Active shops found."
                  : "No Inactive shops found."}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <tbody className="space-y-4">
                {loading ? (
                  [...Array(ITEMS_PER_PAGE)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((shop) => (
                    <tr key={shop.id} className="border-b border-t">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={shop.logoUrl}
                            alt={shop.businessName}
                            className="w-20 h-20 rounded object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{shop.businessName}</h3>
                            <p className="text-sm text-gray-500">
                              {shop.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="grid grid-cols-4 gap-8">
                          <div className="min-w-[120px]">
                            <p className="text-sm truncate">{shop.mobileNumber}</p>
                            <p className="text-xs text-gray-500">Phone</p>
                          </div>
                          <div className="min-w-[180px] pr-4">
                            <p className="text-sm truncate">{shop.email}</p>
                            <p className="text-xs text-gray-500">Email</p>
                          </div>
                          <div>
                            <p className="text-sm">{shop.createdDate}</p>
                            <p className="text-xs text-gray-500">Requested date</p>
                          </div>
                          <div>
                            {activeTab === "Active" ? (
                              <div>
                                <p className="text-sm">{shop.approvedDate}</p>
                                <p className="text-xs text-gray-500">Activation Date</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm">{shop.inactiveDate}</p>
                                <p className="text-xs text-red-500">Inactivation Date</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => onViewDetails(shop)}
                          className="ml-auto px-6 py-2 border border-blue-500 text-blue-500 rounded-md
                            hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      <div className="p-6 text-center text-gray-600">
                        {activeTab === "Active"
                          ? "No Active shops found."
                          : "No Inactive shops found."}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Responsive Pagination */}
        {!loading && paginatedData.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-xs md:text-sm text-gray-600 order-2 md:order-1">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of{" "}
              {filteredData.length}
            </p>
            <div className="flex gap-1 md:gap-2 order-1 md:order-2">
              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <span className="md:hidden">Prev</span>
                <span className="hidden md:inline">Previous</span>
              </button>
              
              {/* Mobile pagination with limited pages */}
              <div className="md:hidden flex gap-1">
                {totalPages <= 5 ? (
                  // Show all pages if 5 or fewer
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`w-6 h-6 rounded text-xs ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))
                ) : (
                  // Show limited pages with ellipsis for larger page counts
                  <>
                    <button
                      className={`w-6 h-6 rounded text-xs ${
                        currentPage === 1 ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                    
                    {currentPage > 3 && (
                      <span className="flex items-center justify-center w-6 h-6">...</span>
                    )}
                    
                    {currentPage !== 1 && currentPage !== totalPages && (
                      <button
                        className="w-6 h-6 rounded text-xs bg-blue-500 text-white"
                      >
                        {currentPage}
                      </button>
                    )}
                    
                    {currentPage < totalPages - 2 && (
                      <span className="flex items-center justify-center w-6 h-6">...</span>
                    )}
                    
                    <button
                      className={`w-6 h-6 rounded text-xs ${
                        currentPage === totalPages ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              {/* Desktop pagination showing all pages */}
              <div className="hidden md:flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`w-8 h-8 rounded ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              
              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <span className="md:hidden">Next</span>
                <span className="hidden md:inline">Next</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopRequests;