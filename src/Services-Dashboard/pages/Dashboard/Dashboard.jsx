import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FaUsers, FaBox, FaTicketAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [allCustomer, setAllCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchProductData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        if (productData.businessId === id) {
          data.push({ id: doc.id, ...productData });
        }
      });
      setProducts(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCustomerData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const data = [];
      const uniqueEmails = new Set(); // To track unique emails

      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (
          couponsData.businessId === id &&
          !uniqueEmails.has(couponsData.email)
        ) {
          uniqueEmails.add(couponsData.email); // Add email to the set
          data.push({
            avatar: couponsData.userProfilePic,
            name: couponsData.fullName,
            email: couponsData.email,
          });
        }
      });

      setAllCustomer(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }, [id]);

  const fetchClaimedCouponsDetailsData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "invoiceDetails"));
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
    fetchProductData();
    fetchCustomerData();
    fetchClaimedCouponsDetailsData();
  }, [fetchProductData, fetchCustomerData, fetchClaimedCouponsDetailsData]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Dashboard</h1>
        {/* <button className="px-4 py-1.5 bg-gray-100 rounded flex items-center gap-1 border border-black">
          Today <IoMdArrowDropdown className="text-lg" />
        </button> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={<FaUsers className="text-white" />}
              title="Total Customer"
              value={allCustomer.length > 0 ? allCustomer.length : 0}
              color="bg-teal-600"
              border="border-teal-600"
            />
            <StatCard
              icon={<FaBox className="text-white" />}
              title="Total Product"
              value={products.length > 0 ? products.length : 0}
              color="bg-orange-400"
              border="border-orange-400"
            />
            <StatCard
              icon={<FaTicketAlt className="text-white" />}
              title="Claimed Coupons"
              value={customers.length > 0 ? customers.length : 0}
              color="bg-red-400"
              border="border-red-400"
            />
          </>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-medium">Claimed Coupons</h2>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left text-sm text-gray-600">
                  <tr>
                    <th className="pb-4">Coupon ID</th>
                    <th className="pb-4">Name</th>
                    <th className="pb-4">Contact</th>
                    <th className="pb-4">Offer</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[...Array(5)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <ClaimedCoupons customers={customers} />
        )}
        {loading ? (
          <NewCustomersSkeleton />
        ) : (
          <NewCustomers customers={allCustomer} />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, border }) {
  return (
    <div
      className={`bg-white h-[130px] p-4 rounded-t-lg shadow-sm border-b-4 ${border}`}
    >
      <div className="flex justify-between items-start relative">
        <div>
          <p className="text-3xl font-semibold mb-1">{value}</p>
          <p className="text-gray-600">{title}</p>
        </div>
        <div className={`p-3 absolute -right-2 top-16 rounded-md ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white h-[130px] p-4 rounded-t-lg shadow-sm border-b-4 border-gray-200 animate-pulse">
      <div className="flex justify-between items-start relative">
        <div>
          <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="p-3 absolute -right-2 top-16 rounded-md bg-gray-200">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function ClaimedCoupons({ customers }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-medium">Claimed Coupons</h2>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {customers.length > 0 ? customers.length : 0}
        </span>
      </div>
      {customers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left text-sm text-gray-600">
              <tr>
                <th className="pb-4">Coupon ID</th>
                <th className="pb-4">Name</th>
                <th className="pb-4">Contact</th>
                <th className="pb-4">Offer</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map((customer, index) => (
                <tr key={index} className="border-t">
                  <td className="py-4">{customer.claimedCouponCode}</td>
                  <td>{customer.claimedCouponCodeUserName}</td>
                  <td className="whitespace-pre-line">
                    {customer.customerEmail}
                  </td>
                  <td>{customer.discount}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No claimed coupons.</p>
      )}
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-t">
      <td className="py-4">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>
      <td>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </td>
      <td>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );
}

function NewCustomers({ customers }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-medium">New Customers</h2>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {customers.length > 0 ? customers.length : 0}
        </span>
      </div>
      {customers.length > 0 ? (
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <div key={index} className="flex items-center gap-3">
              <img
                src={customer.avatar || "/placeholder.svg"}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No new customers.</p>
      )}
    </div>
  );
}

function NewCustomersSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-medium">New Customers</h2>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </span>
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
