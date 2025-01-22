import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

const mockData = [
  {
    id: 1,
    shopName: "Cake Ghor",
    date: "12 may, 2024",
    status: "Pending",
  },
  {
    id: 2,
    shopName: "WOW MOMO",
    date: "12 may, 2024",
    status: "Collected",
  },
];

const CashbackRequests = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredData = mockData.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.status.toUpperCase() === activeFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFilter("ALL")}
          className={`px-4 py-1 rounded-full text-sm ${
            activeFilter === "ALL"
              ? "bg-blue-500 text-white"
              : "border-2 text-gray-400"
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setActiveFilter("PENDING")}
          className={`px-4 py-1 rounded-full text-sm ${
            activeFilter === "PENDING"
              ? "bg-blue-500 text-white"
              : "border-2 text-gray-400"
          }`}
        >
          PENDING
        </button>
        <button
          onClick={() => setActiveFilter("COLLECTED")}
          className={`px-4 py-1 rounded-full text-sm ${
            activeFilter === "COLLECTED"
              ? "bg-blue-500 text-white"
              : "border-2 text-gray-400"
          }`}
        >
          COLLECTED
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">#</th>
            <th className="py-2 px-4 border-b text-left">Shop Name</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((request, index) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{index + 1}.</td>
              <td className="py-2 px-4 border-b">{request.shopName}</td>
              <td className="py-2 px-4 border-b">{request.date}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`${
                    request.status === "Pending"
                      ? "text-[#F59E0B]"
                      : "text-[#22C55E]"
                  }`}
                >
                  {request.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <button className="p-1">
                  <FaEllipsisV className="h-4 w-4 text-text-gray" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashbackRequests;
