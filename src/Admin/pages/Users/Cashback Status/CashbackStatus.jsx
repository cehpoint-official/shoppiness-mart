import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

const CashbackStatus = () => {
  const [activeTab, setActiveTab] = useState("Approved");
  const [currentPage, setCurrentPage] = useState(1);
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
    },
    // Generating a mix of "Pending" and "Claimed" statuses dynamically
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(
      (id) => ({
        id,
        code: `#6799${id}`, // Unique code
        shopName: "WOW MOMO",
        email: "user@gmail.com",
        name: "Priti Mondal",
        date: "22 July,2024",
        status: id % 2 === 0 ? "Denied" : "Paid", // Alternating status for variety
      })
    ),
  ];

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

      <div className="bg-white rounded-lg border shadow-lg p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Approved"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => setActiveTab("Approved")}
          >
            Approved Cashbacks
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Denied"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => setActiveTab("Denied")}
          >
            Denied Cashbacks
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-medium">
                <th className="pb-4  text-gray-500">#</th>
                <th className="pb-4  text-gray-500">Code</th>
                <th className="pb-4 text-gray-500">Shop Name</th>
                <th className="pb-4  text-gray-500">Email</th>
                <th className="pb-4  text-gray-500">Name</th>
                <th className="pb-4 text-gray-500">Date</th>
                <th className="pb-4  text-gray-500">Status</th>
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
                    <button className="p-1 hover:bg-gray-100 rounded-full">
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
