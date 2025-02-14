import { useEffect, useState } from "react";

// Skeleton loader component
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

function ShopRequests({ onViewDetails, offlineShops, loading }) {
  const [activeTab, setActiveTab] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredData = offlineShops.filter((item) =>
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        All Offline shops
      </h1>
      <div className="bg-white p-6 rounded-xl border shadow-md">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full border transition-all ${
              activeTab === "Active"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Active")}
          >
            Active Product/Service
          </button>
          <button
            className={`px-6 py-2 rounded-full border transition-all ${
              activeTab === "Inactive"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Inactive")}
          >
            Inactive Product/Service
          </button>
        </div>
        <div className="overflow-x-auto">
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
                        <div>
                          <p className="text-sm">{shop.mobileNumber}</p>
                          <p className="text-xs text-gray-500">Phone</p>
                        </div>
                        <div>
                          <p className="text-sm">{shop.email}</p>
                          <p className="text-xs text-gray-500">Email</p>
                        </div>
                        <div>
                          <p className="text-sm">{shop.createdDate}</p>
                          <p className="text-xs text-gray-500">
                            Requested date
                          </p>
                        </div>
                        <div>
                          {activeTab === "Active" ? (
                            <div>
                              <p className="text-sm">{shop.approvedDate}</p>
                              <p className="text-xs text-gray-500">
                                Activation Date
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm">{shop.inactiveDate}</p>
                              <p className="text-xs text-red-500">
                                Inactivation Date
                              </p>
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

        {/* Pagination */}
        {!loading && paginatedData.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of{" "}
              {filteredData.length}
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ShopRequests;
