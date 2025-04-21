import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiChevronLeft, FiMoreVertical } from "react-icons/fi";
import { db } from "../../../../../firebase";

const NgoDetails = ({ ngoId, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [ngoGivebackDetails, setNgoGivebackDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const fetchNgoDetails = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "givebackCashbacks")
        );
        const data = [];
        querySnapshot.forEach((doc) => {
          const ngoData = doc.data();
          if (ngoData && ngoData.ngoId === ngoId) {
            data.push({ id: doc.id, ...ngoData });
          }
        });
        setNgoGivebackDetails(data);
        setTotalItems(data.length);
      } catch (error) {
        console.log("Error getting document: ", error);
        toast.error("Failed to fetch NGO details");
      } finally {
        setLoading(false);
      }
    };

    fetchNgoDetails();
  }, [ngoId]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Close any open menu when changing pages
      setActiveMenu(null);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : "-";
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return ngoGivebackDetails.slice(startIndex, endIndex);
  };

  // Card view for mobile screens
  const renderMobileCards = () => {
    return getPaginatedData().map((row) => (
      <div key={row.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{row.ngoName}</h3>
          <div className="relative">
            <button
              onClick={() => toggleMenu(row.id)}
              className="hover:bg-gray-100 p-2 rounded-full"
            >
              <FiMoreVertical className="w-4 h-4" />
            </button>
            {activeMenu === row.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Edit
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-gray-500">Date:</div>
          <div>{formatDate(row.paidAt)}</div>
          
          <div className="text-gray-500">Name:</div>
          <div>{row.userName}</div>
          
          <div className="text-gray-500">Email:</div>
          <div className="break-all">{row.userEmail}</div>
          
          <div className="text-gray-500">Amount:</div>
          <div>₹ {row.amount}</div>
        </div>
      </div>
    ));
  };

  // Skeleton loading for mobile cards
  const renderMobileSkeletonCards = () => {
    return Array.from({ length: itemsPerPage }).map((_, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    ));
  };

  // Skeleton Loading Rows for desktop
  const renderSkeletonRows = () => {
    return Array.from({ length: itemsPerPage }).map((_, index) => (
      <tr key={index} className="border-b last:border-b-0">
        <td className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </td>
        <td className="p-4">
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </td>
        <td className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </td>
        <td className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </td>
        <td className="p-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </td>
        <td className="p-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex items-center gap-2">
        <button onClick={onBack} className="hover:bg-gray-100 p-2 rounded-full">
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg md:text-xl font-medium">Back</h1>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">NGO/Cause name</th>
              <th className="text-left p-4 font-medium">Recieved Date</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeletonRows()
            ) : ngoGivebackDetails.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  This NGO has not received any donations yet.
                </td>
              </tr>
            ) : (
              getPaginatedData().map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="p-4">{row.ngoName}</td>
                  <td className="p-4">{formatDate(row.paidAt)}</td>
                  <td className="p-4">{row.userName}</td>
                  <td className="p-4">{row.userEmail}</td>
                  <td className="p-4">₹ {row.amount}</td>
                  <td className="p-4 relative">
                    <button
                      onClick={() => toggleMenu(row.id)}
                      className="hover:bg-gray-100 p-2 rounded-full"
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenu === row.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                        <div className="py-1">
                          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                            Edit
                          </button>
                          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View (shown only on mobile) */}
      <div className="md:hidden">
        {loading ? (
          renderMobileSkeletonCards()
        ) : ngoGivebackDetails.length === 0 ? (
          <div className="bg-white p-4 rounded-lg text-center text-gray-500">
            This NGO has not received any donations yet.
          </div>
        ) : (
          renderMobileCards()
        )}
      </div>

      {/* Responsive Pagination */}
      {ngoGivebackDetails.length > 0 && (
        <div className="p-2 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs md:text-sm text-gray-600 order-2 md:order-1">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </div>
          <div className="flex items-center gap-1 md:gap-2 order-1 md:order-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 md:px-3 py-1 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            
            {/* Dynamic pagination that shows fewer buttons on mobile */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              
              // On mobile, only show current page and immediate neighbors
              if (window.innerWidth < 768) {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === currentPage - 2 && currentPage > 3) ||
                  (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNum}>...</span>;
                }
                return null;
              }
              
              // Desktop view - show more page numbers
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === currentPage - 3 && currentPage > 4) ||
                (pageNum === currentPage + 3 && currentPage < totalPages - 3)
              ) {
                return <span key={pageNum}>...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 md:px-3 py-1 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDetails;