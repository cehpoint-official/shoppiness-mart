import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../../firebase";
const SkeletonRow = () => {
  return (
    <tr className="border-b animate-pulse">
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );
};
const Givebacks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "givebackCashbacks"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const GivebackHistoryData = doc.data();
        data.push({ id: doc.id, ...GivebackHistoryData });
      });
      setHistory(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  const sortDonations = (donations) => {
    switch (sortBy) {
      case "newest":
        return [...donations].sort(
          (a, b) =>
            new Date(formatDate(b.completedAt)) -
            new Date(formatDate(a.completedAt))
        );
      case "oldest":
        return [...donations].sort(
          (a, b) =>
            new Date(formatDate(a.completedAt)) -
            new Date(formatDate(b.completedAt))
        );
      case "az":
        return [...donations].sort((a, b) =>
          a.ngoName.localeCompare(b.ngoName)
        );
      case "za":
        return [...donations].sort((a, b) =>
          b.ngoName.localeCompare(a.ngoName)
        );
      default:
        return donations;
    }
  };

  const sortedDonations = sortDonations(history);
  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDonations = sortedDonations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl">Give Backs</h1>
        </div>
        <div className="relative">
          <select
            className="appearance-none border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-4 font-medium text-gray-600">
                  NGO/Cause name
                </th>
                <th className="p-4 font-medium text-gray-600">Date</th>
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                : displayedDonations.map((donation) => (
                    <tr key={donation.id} className="border-b">
                      <td className="p-4">{donation.ngoName}</td>
                      <td className="p-4">
                        {formatDate(donation.completedAt)}
                      </td>
                      <td className="p-4">{donation.userName}</td>
                      <td className="p-4">{donation.userEmail}</td>
                      <td className="p-4">₹ {donation.amount}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, history.length)} of{" "}
            {history.length}
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
                className={`w-8 h-8 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
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

export default Givebacks;
