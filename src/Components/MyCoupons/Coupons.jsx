import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Coupons = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (couponsData.userId === userId && couponsData.status === "Pending") {
          data.push({ id: doc.id, ...couponsData });
        }
      });
      setCoupons(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [userId, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update total pages when coupons or itemsPerPage changes
  useEffect(() => {
    setTotalPages(Math.ceil(coupons.length / itemsPerPage));
  }, [coupons, itemsPerPage]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard!");
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOfferText = (coupon) => {
    if (coupon.productDiscount && coupon.businessRate) {
      return `Enjoy ${coupon.productDiscount}% Off In-Store ${coupon.productName} Purchase + ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
    } else if (coupon.productDiscount) {
      return `Enjoy ${coupon.productDiscount}% Off In-Store ${coupon.productName} Purchase at Shoppiness Mart!`;
    }
    return `For all purchase from ${coupon.businessName} you will get ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
  };

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get current coupons for pagination
  const indexOfLastCoupon = currentPage * itemsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - itemsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Max number of page buttons to show

    if (totalPages <= maxPageButtons) {
      // If total pages are less than max buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust to show up to 3 page numbers in the middle
      if (startPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (endPage >= totalPages - 1) {
        startPage = Math.max(totalPages - 3, 2);
      }

      // Add ellipsis after first page if necessary
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if necessary
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Skeleton Loading Component
  const SkeletonCoupon = () => (
    <div className="border p-4 bg-[#e9f9f77a] shadow-sm relative animate-pulse">
      <div className="absolute top-4 right-4">
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-normal mb-6">Available Coupons</h1>

      <div className="space-y-4 overflow-y-auto flex-1">
        <div className="max-w-6xl mx-auto space-y-4">
          {loading ? (
            // Show skeleton while loading
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCoupon key={index} />
            ))
          ) : coupons.length > 0 ? (
            // Show actual coupons once data is loaded
            <>
              {currentCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="border p-4 bg-[#e9f9f77a] shadow-sm relative"
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-gray-600 text-sm sm:text-base">
                      {formatDate(coupon.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-blue-600 text-lg sm:text-xl font-normal pr-20 sm:pr-32">
                      {coupon.businessName}
                    </h2>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <p className="text-gray-600 text-sm sm:text-base">
                        {getOfferText(coupon)}
                      </p>

                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-blue-600 text-base sm:text-lg">
                          Coupon code - {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy code"
                        >
                          <IoCopyOutline
                            className={
                              copiedCode === coupon.code
                                ? "text-green-500"
                                : "text-gray-400"
                            }
                            size={20}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstCoupon + 1} to{" "}
                    {Math.min(indexOfLastCoupon, coupons.length)} of{" "}
                    {coupons.length} coupons
                  </div>

                  <div className="flex items-center justify-center">
                    <nav className="flex items-center" aria-label="Pagination">
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 rounded-l-md border ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-600 hover:bg-blue-50"
                        }`}
                        aria-label="Previous page"
                      >
                        <IoChevronBackOutline size={18} />
                      </button>

                      {/* Page numbers */}
                      <div className="hidden sm:flex">
                        {getPageNumbers().map((page, index) =>
                          page === "..." ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-1 border-t border-b bg-gray-50 text-gray-500"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-3 py-1 border-t border-b ${
                                currentPage === page
                                  ? "bg-blue-50 text-blue-600 font-medium border-blue-200"
                                  : "bg-white text-gray-600 hover:bg-gray-50"
                              }`}
                              aria-current={
                                currentPage === page ? "page" : undefined
                              }
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>

                      {/* Mobile pagination indicator */}
                      <div className="sm:hidden px-3 py-1 border-t border-b bg-white text-gray-600">
                        {currentPage} / {totalPages}
                      </div>

                      <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className={`px-2 py-1 rounded-r-md border ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-600 hover:bg-blue-50"
                        }`}
                        aria-label="Next page"
                      >
                        <IoChevronForwardOutline size={18} />
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center text-lg">
              You haven&apos;t generated any coupons yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;
