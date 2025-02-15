import { useState } from "react";
import { FiArrowLeft, FiMoreVertical, FiFileText } from "react-icons/fi";

const DisputeRequest = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDisputeRequest, setSelectedDisputeRequest] = useState(null);
    const itemsPerPage = 5;
  
    // Sample data - in a real app this would come from an API
    const allDisputeRequest = [
      {
        id: 1,
        code: "#679989",
        shopName: "WOW MOMO",
        email: "user@gmail.com",
        name: "Priti Mondal",
        date: "22 July,2024",
        status: "New",
      },
      // Duplicating the same data for demonstration
      ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(
        (id) => ({
          id,
          code: "#679989",
          shopName: "WOW MOMO",
          email: "user@gmail.com",
          name: "Priti Mondal",
          date: "22 July,2024",
          status: "New",
        })
      ),
    ];
  
    // Calculate pagination
    const totalPages = Math.ceil(allDisputeRequest.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedCoupons = allDisputeRequest.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    if (selectedDisputeRequest) {
      return (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setSelectedDisputeRequest(null)}
              className="flex items-center gap-2 text black hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="text-lg ">Cashback request details</span>
            </button>
          </div>
  
          <div className="bg-white rounded-lg shadow-md border p-8">
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <div className="text-gray-500 mb-1">Name</div>
                <div className="font-medium">{selectedDisputeRequest.name}</div>
              </div>
  
              <div>
                <div className="text-gray-500 mb-1">Shop Name</div>
                <div className="font-medium">{selectedDisputeRequest.shopName}</div>
              </div>
  
              <div>
                <div className="text-gray-500 mb-1">Email</div>
                <div className="font-medium">{selectedDisputeRequest.email}</div>
              </div>
  
              <div>
                <div className="text-gray-500 mb-1">Paid Amount</div>
                <div className="font-medium">{selectedDisputeRequest.paidAmount}</div>
              </div>
  
              <div>
                <div className="text-gray-500 mb-1">Phone No.</div>
                <div className="font-medium">{selectedDisputeRequest.phone}</div>
              </div>
  
              <div>
                <div className="text-gray-500 mb-1">Payment method</div>
                <div className="font-medium">{selectedDisputeRequest.paymentMethod}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedDisputeRequest.paymentId}
                </div>
              </div>
  
              <div>
                <div className="text-gray-500 mb-1">Date</div>
                <div className="font-medium">{selectedDisputeRequest.date}</div>
              </div>
  
              <div>
                <div className="text-gray-500 mb-1">Invoice</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FiFileText className="w-5 h-5 text-red-500" />
                    <span>{selectedDisputeRequest.invoice}</span>
                  </div>
                  <button className="px-3 py-1 bg-gray-200 rounded text-sm">
                    Download
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
  
            <div className="flex justify-end gap-4 mt-12">
              <button className="px-4 py-2 bg-gray-200 rounded">
                Request Denied
              </button>
              <button className="px-4 py-2 bg-[#F59E0B] text-white rounded">
                Mark as Paid
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-normal mb-8">Dispute Requests</h1>
  
        <div className="bg-white rounded-lg border shadow-lg p-6">
          {/* Tabs */}
  
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
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <FiMoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                            onClick={() => setSelectedDisputeRequest(coupon)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {Math.min(itemsPerPage, allDisputeRequest.length)} of{" "}
              {allDisputeRequest.length}
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
export default DisputeRequest