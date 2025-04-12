import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase"; // Adjust the import path as needed
import { RiShoppingBagLine } from "react-icons/ri";
import { FaHandHoldingHeart } from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const TransactionSummary = () => {
  const [givebacks, setGivebacks] = useState([]);
  const [donationTransactions, setDonationTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch givebacks
      const givebacksSnapshot = await getDocs(
        collection(db, "givebackCashbacks")
      );
      const givebacksData = [];
      givebacksSnapshot.forEach((doc) => {
        const GivebackHistoryData = doc.data();
        if (GivebackHistoryData.ngoId === id) {
          givebacksData.push({ id: doc.id, ...GivebackHistoryData });
        }
      });
      setGivebacks(givebacksData);

      // Fetch donation transactions
      const donationQuery = query(
        collection(db, "donationTransactions"),
        where("causeId", "==", id)
      );

      const donationSnapshot = await getDocs(donationQuery);
      const donationData = [];
      donationSnapshot.forEach((doc) => {
        donationData.push({ id: doc.id, ...doc.data() });
      });

      // Sort by date (newest first)
      donationData.sort((a, b) => {
        const dateA = a.paymentDate ? new Date(a.paymentDate) : new Date(0);
        const dateB = b.paymentDate ? new Date(b.paymentDate) : new Date(0);
        return dateB - dateA;
      });

      setDonationTransactions(donationData);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform givebacks into transactions
  const allTransactions = [
    // Format donation transactions
    ...donationTransactions.map((item) => ({
      id: item.id,
      merchant: "SHOPPINESSMART",
      date: new Date(item.paymentDate ? item.paymentDate : new Date()),
      formattedDate:
        typeof item.paymentDate === "string"
          ? item.paymentDate
          : new Date(item.paymentDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            }),
      amount: item.donationAmount || item.amount,
      formattedAmount: `Rs. ${
        (item.donationAmount || item.amount)?.toFixed(2) || 0
      }`,
      status: item.paymentStatus,
      statusMessage:
        item.paymentStatus === "Completed"
          ? `Payment received (${item.donationPercentage || 100}% after fees)`
          : "Payment pending",
      userName: item.customerName,
      userEmail: item.customerEmail,
      userImage: item.userProfilePic,
      type: "donation",
      donationPercentage: item.donationPercentage,
      paymentMethod: item.paymentMethod,
      originalAmount: item.amount,
    })),

    // Format givebacks
    ...givebacks.map((item) => ({
      id: item.id,
      merchant: "SHOPPINESSMART GIVEBACK",
      date: new Date(item.paidAt || item.requestedAt),
      formattedDate: new Date(
        item.paidAt || item.requestedAt
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      amount: item.amount,
      formattedAmount: `Rs. ${item.amount?.toFixed(2) || 0}`,
      status: item.status,
      statusMessage:
        item.status === "Completed"
          ? "Giveback cashback donated"
          : "Donation pending",
      userName: item.userName,
      userEmail: item.userEmail,
      userImage: item.userPic,
      type: "giveback",
    })),
  ]
    // Sort by date (newest first)
    .sort((a, b) => b.date - a.date);

  // Get current transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = allTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(allTransactions.length / transactionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-medium text-gray-900">Transaction Summary</h2>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            </div>
          ))
        ) : allTransactions.length > 0 ? (
          <>
            {currentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex flex-col p-4 border border-black rounded-lg"
              >
                {/* Header with transaction type badge */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center
                              ${
                                transaction.type === "donation"
                                  ? "bg-blue-100"
                                  : "bg-orange-100"
                              }`}
                    >
                      {transaction.type === "donation" ? (
                        <RiShoppingBagLine className="w-6 h-6 text-blue-500" />
                      ) : (
                        <FaHandHoldingHeart className="w-6 h-6 text-orange-500" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full 
                              ${
                                transaction.type === "donation"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                    >
                      {transaction.type === "donation"
                        ? "Direct Donation"
                        : "Giveback Donation"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full
                              ${
                                transaction.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex flex-col">
                    {/* User details */}
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={transaction.userImage || "/placeholder.svg"}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.userName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.userEmail || "No email"}
                        </p>
                      </div>
                    </div>

                    {/* Transaction details */}
                    <div className="ml-11">
                      <p className="text-sm text-gray-700">
                        {transaction.merchant}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.formattedDate}
                      </p>
                    </div>
                  </div>

                  {/* Amount and status */}
                  <div className="mt-3 md:mt-0 text-right">
                    <p
                      className={`font-medium ${
                        transaction.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {transaction.formattedAmount}
                    </p>

                    {/* Conditional display for donation transactions */}
                    {transaction.type === "donation" &&
                      transaction.status === "Completed" && (
                        <p className="text-xs text-gray-600">
                          {transaction.donationPercentage
                            ? `${
                                transaction.donationPercentage
                              }% of Rs. ${transaction.originalAmount?.toFixed(
                                2
                              )}`
                            : "100% of donation"}
                        </p>
                      )}

                    {/* Payment method for completed donations */}
                    {transaction.type === "donation" &&
                      transaction.status === "Completed" &&
                      transaction.paymentMethod && (
                        <p className="text-xs text-gray-500 mt-1">
                          via {transaction.paymentMethod}
                        </p>
                      )}

                    {/* Status message */}
                    <p className="text-xs text-gray-600 mt-1">
                      {transaction.statusMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-gray-600">
                  Showing {indexOfFirstTransaction + 1}-
                  {Math.min(indexOfLastTransaction, allTransactions.length)} of{" "}
                  {allTransactions.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <IoChevronBackOutline className="w-4 h-4 mr-1" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={nextPage}
                  disabled={
                    currentPage >=
                    Math.ceil(allTransactions.length / transactionsPerPage)
                  }
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage >=
                    Math.ceil(allTransactions.length / transactionsPerPage)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>Next</span>
                  <IoChevronForwardOutline className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No recent transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionSummary;
