import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack, IoEllipsisVertical } from "react-icons/io5";
import { db } from "../../../../firebase";

function ListedProducts({ onBack, shopId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        if (productData.businessId === shopId) {
          data.push({ id: doc.id, ...productData });
        }
      });
      setProducts(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Handle page change with scroll to top for mobile
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) {
      document.getElementById("productListContainer")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Skeleton loading components
  const SkeletonRow = () => (
    <tr className="hidden md:table-row">
      <td className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const SkeletonCard = () => (
    <div className="md:hidden border-b py-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
          <div className="flex justify-between items-center mt-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6">
      <div className="py-2 sm:py-4 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <IoArrowBack className="w-5 h-5 mr-2" />
          <span className="text-sm sm:text-base">List of Products</span>
        </button>
      </div>

      <div id="productListContainer" className="p-3 sm:p-4 bg-white rounded-xl shadow-md">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <tbody>
              {loading ? (
                Array(itemsPerPage)
                  .fill(0)
                  .map((_, index) => <SkeletonRow key={index} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    There are no products listed in this shop currently
                  </td>
                </tr>
              ) : (
                currentItems.map((product) => (
                  <tr key={product.id} className="border-b border-t">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-900">
                              ₹ {product.price}
                            </span>
                            {product.discountType === "percentage" ? (
                              <span className="text-green-600 py-1 px-2 bg-green-200 rounded-lg">
                                {product.discount}% off
                              </span>
                            ) : (
                              <span className="text-green-600 py-1 px-2 bg-green-200 rounded-lg">
                                ₹{product.discount} discount
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">Created on</div>
                      <div>{product.createdDate}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">Category</div>
                      <div>{product.category}</div>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <IoEllipsisVertical className="w-6 h-6 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {loading ? (
            Array(itemsPerPage)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              There are no products listed in this shop currently
            </div>
          ) : (
            currentItems.map((product) => (
              <div key={product.id} className="border-b py-4">
                <div className="flex items-start gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <div className="flex flex-col items-center gap-2 mt-1 text-sm">
                      <span className="text-gray-900">₹ {product.price}</span>
                      {product.discountType === "percentage" ? (
                        <span className="text-green-600 text-xs py-1 px-2 bg-green-200 rounded-lg">
                          {product.discount}% off
                        </span>
                      ) : (
                        <span className="text-green-600 text-xs py-1 px-2 bg-green-200 rounded-lg">
                          ₹{product.discount} discount
                        </span>
                      )}
                    </div>
                    
                    {/* Additional info for mobile */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                      <div>
                        <span>Created: </span>
                        <span className="text-gray-900">{product.createdDate}</span>
                      </div>
                      <div>
                        <span>Category: </span>
                        <span className="text-gray-900">{product.category}</span>
                      </div>
                    </div>
                    
                    {/* Action button for mobile */}
                    <div className="flex justify-end mt-1">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <IoEllipsisVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination - responsive for both mobile and desktop */}
        {!loading && products.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-xs sm:text-sm text-gray-600 order-2 md:order-1">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, products.length)} of {products.length}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 order-1 md:order-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Show all page numbers if there are 5 or fewer pages */}
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm rounded flex items-center justify-center ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )
              ) : (
                // For more than 5 pages, show a condensed version
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm rounded flex items-center justify-center ${
                      currentPage === 1 
                        ? "bg-blue-500 text-white" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    1
                  </button>
                  
                  {currentPage > 3 && (
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm">...</span>
                  )}
                  
                  {currentPage !== 1 && currentPage !== totalPages && (
                    <button
                      className="w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm rounded flex items-center justify-center bg-blue-500 text-white"
                    >
                      {currentPage}
                    </button>
                  )}
                  
                  {currentPage < totalPages - 2 && (
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm">...</span>
                  )}
                  
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm rounded flex items-center justify-center ${
                      currentPage === totalPages 
                        ? "bg-blue-500 text-white" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListedProducts;