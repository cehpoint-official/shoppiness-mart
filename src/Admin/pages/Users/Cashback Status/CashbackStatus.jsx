import { useState } from "react";
import { FiMoreVertical, FiX } from "react-icons/fi";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../../firebase";

const CashbackStatus = () => {
  const [activeTab, setActiveTab] = useState("Approved");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const itemsPerPage = 5;

  // Sample data - in a real app this would come from an API
  const allCoupons = [
    {
      id: 1,
      code: "#679989",
      shopName: "WOW MOMO",
      email: "user@gmail.com",
      name: "Priti Mondal",
      date: "22 July,2024",
      status: "Paid",
      amount: 250,
    },
    // Previous dynamic coupon generation remains the same
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(
      (id) => ({
        id,
        code: `#6799${id}`,
        shopName: "WOW MOMO",
        email: "user@gmail.com",
        name: "Priti Mondal",
        date: "22 July,2024",
        status: id % 2 === 0 ? "Denied" : "Paid",
        amount: 100 + (id * 10),
      })
    ),
  ];

  // Function to save notification to Firestore
  const saveNotification = async (message, userId) => {
    try {
      await addDoc(collection(db, 'userNotifications'), {
        message,
        userId,
        read: false,
        createdAt: serverTimestamp(),
      });
      console.log("Notification saved successfully");
    } catch (error) {
      console.error("Error saving notification: ", error);
    }
  };

  // Function to handle status change and create notification
  const handleStatusChange = async (coupon, newStatus) => {
    console.log(coupon);
    const userId = coupon.email;
    
    let message = "";
    if (newStatus === "Paid") {
      message = `Your cashback of ₹${coupon.amount} for ${coupon.shopName} (${coupon.code}) has been approved and paid.`;
    } else if (newStatus === "Denied") {
      message = `Your cashback request for ${coupon.shopName} (${coupon.code}) has been denied.`;
    }
    
    if (message) {
      await saveNotification(message, userId);
    }
    
    // Reset selected coupon after handling
    setSelectedCoupon(null);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Filter coupons based on active tab
  const filteredCoupons = allCoupons.filter((coupon) =>
    activeTab === "Approved"
      ? coupon.status === "Paid"
      : coupon.status === "Denied"
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCoupons = filteredCoupons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-normal mb-8">Cashback Status</h1>

      {/* Notification Popup */}
      {selectedCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button 
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Send Notification</h2>
            <p className="mb-4 text-gray-600">
              Send a notification for cashback request {selectedCoupon.code}?
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setSelectedCoupon(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleStatusChange(selectedCoupon, selectedCoupon.status)}
                className="px-4 py-2 bg-[#F59E0B] text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-lg p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Approved"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => handleTabChange("Approved")}
          >
            Approved Cashbacks
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Denied"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => handleTabChange("Denied")}
          >
            Denied Cashbacks
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-medium">
                <th className="pb-4 text-gray-500">#</th>
                <th className="pb-4 text-gray-500">Code</th>
                <th className="pb-4 text-gray-500">Shop Name</th>
                <th className="pb-4 text-gray-500">Email</th>
                <th className="pb-4 text-gray-500">Name</th>
                <th className="pb-4 text-gray-500">Date</th>
                <th className="pb-4 text-gray-500">Status</th>
                <th className="pb-4 text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-t">
                  <td className="py-4">{coupon.id}.</td>
                  <td className="py-4">{coupon.code}</td>
                  <td className="py-4">{coupon.shopName}</td>
                  <td className="py-4">{coupon.email}</td>
                  <td className="py-4">{coupon.name}</td>
                  <td className="py-4">{coupon.date}</td>
                  <td className="py-4">
                    <span className="text-[#F59E0B]">{coupon.status}</span>
                  </td>
                  <td className="py-4">
                    <button 
                      className="p-1 hover:bg-gray-100 rounded-full"
                      onClick={() => setSelectedCoupon(coupon)}
                    >
                      <FiMoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min(itemsPerPage, filteredCoupons.length)} of{" "}
            {filteredCoupons.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm disabled:opacity-50"
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
              className="px-4 py-2 text-sm disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackStatus;