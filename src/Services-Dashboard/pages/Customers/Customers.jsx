import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { Link, useParams } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "claimedCouponsDetails")
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        const customersData = doc.data();
        if (
          customersData.businessId === id &&
          customersData.claimedCouponCode
        ) {
          data.push({ id: doc.id, ...customersData });
        }
      });
      setCustomers(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const totalPages = Math.ceil(customers.length / customersPerPage);

  return (
    <div className="container mx-auto my-10 p-10 flex flex-col gap-10">
      <h1 className="text-xl">Customers</h1>
      {loading ? (
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left">Coupon ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Offer</th>
              <th className="py-3 px-4 text-left">Claimed on</th>
              <th className="py-3 px-4 text-left">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: customersPerPage }).map((_, index) => (
              <tr key={index} className="border-b animate-pulse">
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-300 rounded w-40"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-300 rounded w-28"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : customers.length === 0 ? (
        <p className="text-center text-gray-500">No customer data available</p>
      ) : (
        <>
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Coupon ID</th>
                <th className="py-3 px-4 text-left">Customer Name</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-left">Offer</th>
                <th className="py-3 px-4 text-left">Claimed on</th>
                <th className="py-3 px-4 text-left">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{customer.claimedCouponCode}</td>
                  <td className="py-3 px-4">
                    {customer.claimedCouponCodeUserName}
                  </td>
                  <td className="py-3 px-4">
                    {customer.claimedCouponCodeUserEmail}
                  </td>
                  <td className="py-3 px-4">{customer.discount}%</td>
                  <td className="py-3 px-4">{customer.claimedDate}</td>
                  <td className="py-3 px-4">
                    {customer.pdfUrl ? (
                      <Link
                        to={customer.pdfUrl}
                        download
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-400">No PDF</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customers;
