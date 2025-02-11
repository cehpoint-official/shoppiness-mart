import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../../firebase";
import {
  BsPerson,
  BsEnvelope,
  BsCurrencyDollar,
  BsBank2,
  BsCalendar,
} from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";

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
  const [activeTab, setActiveTab] = useState("requested");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [history, setHistory] = useState([]);
  const [ngoDetails, setNgoDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGivebackRequest, setSelectedGivebackRequest] = useState(null);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "givebackCashbacks"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const GivebackHistoryData = doc.data();
        data.push({ historyId: doc.id, ...GivebackHistoryData });
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
            new Date(formatDate(b.requestedAt)) -
            new Date(formatDate(a.requestedAt))
        );
      case "oldest":
        return [...donations].sort(
          (a, b) =>
            new Date(formatDate(a.requestedAt)) -
            new Date(formatDate(b.requestedAt))
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

  const filteredGiveBackRequest = history.filter((coupon) =>
    activeTab === "requested"
      ? coupon.status === "Pending"
      : coupon.status === "Completed"
  );

  const sortedDonations = sortDonations(filteredGiveBackRequest);
  const totalPages = Math.ceil(filteredGiveBackRequest.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDonations = sortedDonations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleApprove = (request) => {
    console.log("Approved:", request);
    // Add your approval logic here
  };

  const handleReject = (request) => {
    console.log("Rejected:", request);
    // Add your rejection logic here
  };

  if (selectedGivebackRequest) {
    const fetchNgoDetails = async () => {
      const docRef = doc(db, "causeDetails", selectedGivebackRequest.ngoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNgoDetails(data);
      }
    };

    useEffect(() => {
      fetchNgoDetails();
    }, [selectedGivebackRequest]);

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div>
          {/* Header */}
          <button
            onClick={() => setSelectedGivebackRequest(null)}
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            aria-label="Go back"
          >
            <IoArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xl font-medium">Withdrawal Request Details</span>
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6">
              <h2 className="text-white text-2xl font-semibold">
                Request ID: # {selectedGivebackRequest.historyId}
              </h2>
            </div>

            {/* Card Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-50 rounded-lg">
                    <BsPerson className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Name</div>
                    <div className="font-medium text-gray-900">
                      {selectedGivebackRequest.userName}
                    </div>
                  </div>
                </div>

                {/* NGO Name */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-50 rounded-lg">
                    <BsPerson className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">NGO Name</div>
                    <div className="font-medium text-gray-900">
                      {ngoDetails?.name || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <BsEnvelope className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="font-medium text-gray-900">
                      {selectedGivebackRequest.userEmail}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <BsCurrencyDollar className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Requested Amount</div>
                    <div className="font-medium text-gray-900">
                      {selectedGivebackRequest.amount}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BsBank2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                    <div className="font-medium text-gray-900 mb-2">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          {selectedGivebackRequest.selectedPayment?.accountNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedGivebackRequest.selectedPayment?.ifscCode}
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedGivebackRequest.selectedPayment?.upiId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requested Date */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <BsCalendar className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Requested Date</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedGivebackRequest.requestedAt)}
                    </div>
                  </div>
                </div>

                {/* Paid Date (if applicable) */}
                {activeTab === "Completed" && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <BsCalendar className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Paid Date</div>
                      <div className="font-medium text-gray-900">
                        {formatDate(selectedGivebackRequest.paidAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  onClick={() => handleApprove(selectedGivebackRequest)}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={() => handleReject(selectedGivebackRequest)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex py-6 px-2 gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "requested"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("requested");
              setCurrentPage(1);
            }}
          >
            Pending Givebacks
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Completed"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("Completed");
              setCurrentPage(1);
            }}
          >
            Completed Givebacks
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-4 font-medium text-gray-600">NGO/Cause name</th>
                <th className="p-4 font-medium text-gray-600">Requested Date</th>
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
                    <tr
                      key={donation.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedGivebackRequest(donation)}
                    >
                      <td className="p-4">{donation.ngoName}</td>
                      <td className="p-4">{formatDate(donation.requestedAt)}</td>
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
            {Math.min(startIndex + itemsPerPage, filteredGiveBackRequest.length)} of{" "}
            {filteredGiveBackRequest.length}
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