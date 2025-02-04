import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "claimedCouponsDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const customersData = doc.data();
        if (customersData.businessId === id) {
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

  return (
    <div className="container mx-auto my-10 p-10 flex flex-col gap-10">
      <h1 className="text-xl">Customers</h1>
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
          {loading
            ? Array.from({ length: 5 }).map((_, index) => ( // Adjust the length dynamically based on data
                <tr key={index} className="border-b animate-pulse">
                  <td className="py-3 px-4"><div className="h-4 bg-gray-300 rounded w-24"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-300 rounded w-40"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-300 rounded w-20"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-300 rounded w-28"></div></td>
                  <td className="py-3 px-4"><div className="h-8 bg-gray-300 rounded w-16"></div></td>
                </tr>
              ))
            : customers.map((customer, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{customer.claimedCouponCode}</td>
                  <td className="py-3 px-4">{customer.claimedCouponCodeUserName}</td>
                  <td className="py-3 px-4">{customer.claimedCouponCodeUserEmail}</td>
                  <td className="py-3 px-4">{customer.discount}%</td>
                  <td className="py-3 px-4">{customer.claimedDate}</td>
                  <td className="py-3 px-4">
                    {customer.pdfUrl ? (
                      <a
                        href={customer.pdfUrl}
                        download
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">No PDF</span>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
