import { useState } from "react";

function ShopRequests({ onViewDetails, offlineShops }) {
  const [activeTab, setActiveTab] = useState("Active");

  const filteredData = offlineShops.filter((item) =>
    activeTab === "Active"
      ? item.status === "Active"
      : item.status === "Inactive"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        All Offline shops
      </h1>
      <div className="bg-white p-6 rounded-xl border shadow-md">
        {" "}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full border transition-all ${
              activeTab === "Active"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Active")}
          >
            Active Product/Service
          </button>
          <button
            className={`px-6 py-2 rounded-full border transition-all ${
              activeTab === "Inactive"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Inactive")}
          >
            Inactive Product/Service
          </button>
        </div>
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full">
            <tbody className="space-y-4">
              {filteredData.map((shop) => (
                <tr key={shop.id} className="border-b border-t">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={shop.logoUrl}
                        alt={shop.businessName}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{shop.businessName}</h3>
                        <p className="text-sm text-gray-500">{shop.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-sm">{shop.mobileNumber}</p>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                      <div>
                        <p className="text-sm">{shop.email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                      <div>
                        <p className="text-sm"> {shop.approvedDate}</p>
                        <p className="text-xs text-gray-500">Activation Date</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onViewDetails(shop)}
                      className="ml-auto px-6 py-2 border border-blue-500 text-blue-500 rounded-md
                        hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShopRequests;
