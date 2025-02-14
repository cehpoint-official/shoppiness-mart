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
  const [totalItems, setTotalItems] = useState(0); // Total number of items
  const itemsPerPage = 5; // Number of items per page

  // Calculate total pages dynamically
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
        setTotalItems(data.length); // Set total items based on fetched data
      } catch (error) {
        console.log("Error getting document: ", error);
        toast.error("Failed to fetch NGO details");
      } finally {
        setLoading(false);
      }
    };

    fetchNgoDetails();
  }, [ngoId]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : "-";
  };

  // Toggle menu
  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return ngoGivebackDetails.slice(startIndex, endIndex);
  };

  // Skeleton Loading Rows
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
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <button onClick={onBack} className="hover:bg-gray-100 p-2 rounded-full">
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-medium">Back</h1>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto mb-6">
        <table className="w-full min-w-[1000px]">
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

      {/* Pagination - Now Outside Table */}
      {ngoGivebackDetails.length > 0 && (
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {Math.min(itemsPerPage, totalItems)} of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
