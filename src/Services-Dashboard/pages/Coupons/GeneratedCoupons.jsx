import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FiMoreVertical, FiSearch } from "react-icons/fi";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";

const GeneratedCoupons = () => {
  const [activeTab, setActiveTab] = useState("generated");
  const [currentPage, setCurrentPage] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (couponsData.businessId === id) {
          data.push({ id: doc.id, ...couponsData });
        }
      });
      setCoupons(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCoupons = coupons
    .filter((coupon) =>
      activeTab === "generated"
        ? coupon.status === "Pending"
        : coupon.status === "Claimed"
    )
    .filter((coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCoupons = filteredCoupons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getNoDataMessage = () => {
    if (loading) return null;
    return {
      generated: {
        title: "No Generated Coupons",
        description:
          "There are no coupons generated at the moment. New coupons will appear here once they are created.",
      },
      claimed: {
        title: "No Claimed Coupons",
        description:
          "No coupons have been claimed yet. Claimed coupons will be displayed here once customers redeem them.",
      },
    }[activeTab];
  };

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto">
      <h1 className="text-xl sm:text-2xl font-normal mb-6 sm:mb-8">Coupons</h1>

      <div className="bg-white rounded-lg border p-4 shadow-lg w-full">
        {/* Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base whitespace-nowrap ${
                activeTab === "generated"
                  ? "bg-[#F59E0B] text-white"
                  : "border border-black text-gray-600"
              }`}
              onClick={() => {
                setActiveTab("generated");
                setCurrentPage(1);
              }}
            >
              Generated coupons
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base whitespace-nowrap ${
                activeTab === "claimed"
                  ? "bg-[#F59E0B] text-white"
                  : "border border-black text-gray-600"
              }`}
              onClick={() => {
                setActiveTab("claimed");
                setCurrentPage(1);
              }}
            >
              Claimed coupons
            </button>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by coupon code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm sm:text-base"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden space-y-4">
          {loading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 animate-pulse space-y-3"
              >
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : displayedCoupons.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900">
                {getNoDataMessage()?.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {getNoDataMessage()?.description}
              </p>
            </div>
          ) : (
            displayedCoupons.map((coupon, index) => (
              <div key={coupon.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">#{startIndex + index + 1}</p>
                    <p className="text-sm text-gray-600">Code: {coupon.code}</p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <FiMoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Shop: {coupon.businessName}</p>
                  <p>Email: {coupon.email}</p>
                  <p>Name: {coupon.fullName}</p>
                  <p>Created: {coupon.createdAt}</p>
                  {activeTab === "claimed" && (
                    <p>Claimed: {coupon.claimedAt}</p>
                  )}
                  <p>
                    Status:{" "}
                    <span
                      className={`${
                        coupon.status === "Pending"
                          ? "text-[#F59E0B]"
                          : "text-[#22C55E]"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-medium">
                <th className="pb-4 text-gray-500">#</th>
                <th className="pb-4 text-gray-500">Code</th>
                <th className="pb-4 text-gray-500">Shop Name</th>
                <th className="pb-4 text-gray-500">Email</th>
                <th className="pb-4 text-gray-500">Name</th>
                <th className="pb-4 text-gray-500">Created Date</th>
                {activeTab === "claimed" && (
                  <th className="pb-4 text-gray-500">Claimed Date</th>
                )}
                <th className="pb-4 text-gray-500">Status</th>
                <th className="pb-4 text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={index} className="border-t animate-pulse">
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-6"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    {activeTab === "claimed" && (
                      <td className="py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                    )}
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </td>
                  </tr>
                ))
              ) : displayedCoupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "claimed" ? 9 : 8}
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {getNoDataMessage()?.title}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {getNoDataMessage()?.description}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedCoupons.map((coupon, index) => (
                  <tr key={coupon.id} className="border-t">
                    <td className="py-4">{startIndex + index + 1}.</td>
                    <td className="py-4">{coupon.code}</td>
                    <td className="py-4">{coupon.businessName}</td>
                    <td className="py-4">{coupon.email}</td>
                    <td className="py-4">{coupon.fullName}</td>
                    <td className="py-4">{coupon.createdAt}</td>
                    {activeTab === "claimed" && (
                      <td className="py-4">{coupon.claimedAt}</td>
                    )}
                    <td className="py-4">
                      <span
                        className={`${
                          coupon.status === "Pending"
                            ? "text-[#F59E0B]"
                            : "text-[#22C55E]"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <FiMoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {displayedCoupons.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, filteredCoupons.length)} of{" "}
              {filteredCoupons.length}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`w-8 h-8 rounded-sm text-sm ${
                    currentPage === i + 1
                      ? "bg-[#F59E0B] text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm disabled:opacity-50"
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
};

export default GeneratedCoupons;