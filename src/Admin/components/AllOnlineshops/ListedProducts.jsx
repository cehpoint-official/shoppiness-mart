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

  // Skeleton loading row component
  const SkeletonRow = () => (
    <tr>
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

  return (
    <div className="p-6">
      <div className="py-4 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <IoArrowBack className="w-5 h-5 mr-2" />
          List of Products
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full min-w-[640px]">
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
                <tr key={product.id} className="border-b border-t ">
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
                            <span className="text-green-600">
                              {product.discount}% off
                            </span>
                          ) : (
                            <span className="text-green-600">
                              ₹{product.discount} discount
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <div className="text-sm text-gray-600">Created on</div>
                    <div>{product.createdDate}</div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
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

        {!loading && products.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-600 order-2 md:order-1">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, products.length)} of {products.length}
            </div>

            <div className="flex items-center gap-2 order-1 md:order-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
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

export default ListedProducts;
