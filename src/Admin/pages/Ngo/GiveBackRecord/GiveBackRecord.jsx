import { useState } from "react";
import {  FaSort } from "react-icons/fa";

const ngos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `NGO ${i + 1}`,
  location: "Pravat Sarani, opposite to Bolpur..",
  logo: "/lovable-uploads/c2fcfeaf-5645-45fe-a024-76858d64dc6d.png",
  totalGivebacks: Math.floor(Math.random() * 50) + 1,
  amount: Math.floor(Math.random() * 5000) + 1000,
  createdAt: new Date(2024, 0, i + 1),
}));

const ITEMS_PER_PAGE = 5;
const GiveBackRecord = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const sortNGOs = (ngos) => {
    switch (sortOption) {
      case "newest":
        return [...ngos].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      case "oldest":
        return [...ngos].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
      case "az":
        return [...ngos].sort((a, b) => a.name.localeCompare(b.name));
      case "za":
        return [...ngos].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return ngos;
    }
  };
  const sortedNGOs = sortNGOs(ngos);
  const totalPages = Math.ceil(sortedNGOs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNGOs = sortedNGOs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  return (
    <div className="p-6">
      <div className="flex px-4 items-center justify-between mb-4">
        <h1 className="text-2xl font-normal mb-8">NGO/Cause Requests</h1>

        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => {
              const select = document.getElementById("sortSelect");
              if (select) {
                select.click();
              }
            }}
          >
            <FaSort />
            <span>Sort by</span>
          </button>
          <select
            id="sortSelect"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
          </select>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto border shadow-md rounded-xl py-3 px-10">
          <span className="text-gray-500 font-medium">
            {ngos.length} listed NGO
          </span>
          <table className="w-full mt-3">
            <tbody className="flex flex-col gap-3">
              {paginatedNGOs.map((ngo) => (
                <tr key={ngo.id} className="border flex justify-between items-center rounded-xl hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={ngo.logo}
                        alt={ngo.name}
                        className="w-16 h-16 object-contain"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{ngo.name}</h3>
                        <p className="text-gray-500 text-sm">{ngo.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <p className="font-semibold">{ngo.totalGivebacks}</p>
                    <p className="text-gray-500 text-sm">Total Givebacks</p>
                  </td>
                  <td className="text-center p-4">
                    <p className="font-semibold">Rs. {ngo.amount}</p>
                    <p className="text-gray-500 text-sm">Amount</p>
                  </td>
                  <td className="text-right p-4">
                    <button className="border border-blue-600 px-2 py-1 text-blue-500 hover:bg-blue-50 rounded">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, sortedNGOs.length)} of{" "}
            {sortedNGOs.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
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

export default GiveBackRecord;
