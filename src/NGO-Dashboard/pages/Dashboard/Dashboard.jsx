import { MdLocalPhone } from "react-icons/md";
import { LiaEnvelopeSolid } from "react-icons/lia";
import { BsFillHeartPulseFill } from "react-icons/bs";
import { FaHandHoldingWater } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import { FaHandHoldingHeart } from "react-icons/fa"; 
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { Link, useParams } from "react-router-dom";

function Dashboard() {
  const [givebacks, setGivebacks] = useState([]);
  const [donationTransactions, setDonationTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

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

  // Calculate total donations (sum of completed transactions)
  const totalDonations = 
    // Sum from completed givebacks
    givebacks
      .filter(item => item.status === "Completed")
      .reduce((sum, item) => sum + item.amount, 0) +
    // Sum from completed donation transactions
    donationTransactions
      .filter(item => item.paymentStatus === "Completed")
      .reduce((sum, item) => sum + (item.donationAmount || item.amount), 0);

  // Calculate total supporters (unique supporters across both systems)
  // Use a combined set of emails for deduplication
  const allSupporterEmails = new Set();
  
  // Add all giveback emails regardless of status
  givebacks.forEach(item => {
    if (item.userEmail) {
      allSupporterEmails.add(item.userEmail.toLowerCase());
    }
  });

  // Add all donation transaction emails regardless of status
  donationTransactions.forEach(transaction => {
    if (transaction.customerEmail) {
      allSupporterEmails.add(transaction.customerEmail.toLowerCase());
    }
  });

  const totalSupporters = allSupporterEmails.size;

  // New supporters (combined from both sources and unique by email)
  const uniqueSupporters = new Map(); // Using Map to track by email

  // Process all givebacks for supporters
  givebacks.forEach(item => {
    if (!item.userEmail) return;
    
    const email = item.userEmail.toLowerCase();
    const date = new Date(item.paidAt || item.requestedAt);
    
    if (!uniqueSupporters.has(email) || date > uniqueSupporters.get(email).date) {
      uniqueSupporters.set(email, {
        email: item.userEmail,
        name: item.userName,
        image: item.userPic,
        date: date,
        source: "giveback"
      });
    }
  });

  // Process all donation transactions for supporters
  donationTransactions.forEach(item => {
    if (!item.customerEmail) return;
    
    const email = item.customerEmail.toLowerCase();
    const date = new Date(item.paymentDate);
    
    if (!uniqueSupporters.has(email) || date > uniqueSupporters.get(email).date) {
      uniqueSupporters.set(email, {
        email: item.customerEmail,
        name: item.customerName,
        image: item.userProfilePic,
        date: date,
        source: "donation"
      });
    }
  });

  // Convert to array, sort by date, and take top 4
  const newSupporters = Array.from(uniqueSupporters.values())
    .sort((a, b) => b.date - a.date)
    .slice(0, 4);

  // Recent transactions (combined from both sources)
  const allTransactions = [
    // Format donation transactions
    ...donationTransactions.map(item => ({
      id: item.id,
      merchant: "SHOPPINESSMART",
      date: new Date(item.paymentDate ? item.paymentDate : new Date()),
      formattedDate: typeof item.paymentDate === 'string' 
        ? item.paymentDate 
        : new Date(item.paymentDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
      amount: item.donationAmount || item.amount,
      formattedAmount: `Rs. ${(item.donationAmount || item.amount)?.toFixed(2) || 0}`,
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
      originalAmount: item.amount
    })),

    // Format givebacks
    ...givebacks.map(item => ({
      id: item.id,
      merchant: "SHOPPINESSMART GIVEBACK",
      date: new Date(item.paidAt || item.requestedAt),
      formattedDate: new Date(item.paidAt || item.requestedAt).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
        }
      ),
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
      type: "giveback"
    })),
  ]
  // Sort by date (newest first)
  .sort((a, b) => b.date - a.date)
  // Take only the first 3
  .slice(0, 3);

  const { user } = useSelector((state) => state.ngoUserReducer);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* NGO Info Card */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={user?.logoUrl}
              alt="NGO Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col w-full text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold truncate">
                {user?.causeName}
              </h2>
              <div className="space-y-2 mt-2 sm:mt-3">
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                  <LiaEnvelopeSolid className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </p>
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                  <MdLocalPhone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{user?.mobileNumber}</span>
                </p>
              </div>
              <div className="mt-4 sm:mt-6 flex justify-center sm:justify-start">
                <Link to={`/ngo-dashboard/${id}/details`}>
                  <button
                    className="
              px-4 py-2 
              bg-orange-400 text-white 
              rounded-md 
              text-sm sm:text-base
              hover:bg-orange-500 
              transition-colors 
              w-full sm:w-auto
              touch-manipulation
            "
                  >
                    Cause/NGO Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Donations</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <h3 className="text-3xl font-bold mt-1">
                  Rs. {totalDonations.toFixed(2)}
                </h3>
              )}
            </div>
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <FaHandHoldingWater className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Supporters</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <h3 className="text-3xl font-bold mt-1">{totalSupporters}</h3>
              )}
            </div>
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <BsFillHeartPulseFill className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-3">
        {/* New Supporters */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold">New Supporters</h3>
            <span className="bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full">
              {newSupporters.length}
            </span>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
                  </div>
                </div>
              ))
            ) : newSupporters.length > 0 ? (
              newSupporters.map((supporter, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img
                    src={supporter.image || "/placeholder.svg"}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{supporter.name}</p>
                    <p className="text-sm text-gray-600">{supporter.email}</p>
                    <span className="text-xs inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {supporter.source === "giveback" ? "Giveback Donor" : "Direct Donor"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No new supporters found.</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <span className="bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full">
              {allTransactions.length}
            </span>
          </div>
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
              allTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 border rounded-lg"
                >
                  {/* Header with transaction type badge */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                        ${transaction.type === "donation" ? "bg-blue-100" : "bg-orange-100"}`}
                      >
                        {transaction.type === "donation" ? (
                          <RiShoppingBagLine className="w-6 h-6 text-blue-500" />
                        ) : (
                          <FaHandHoldingHeart className="w-6 h-6 text-orange-500" />
                        )}
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full 
                        ${transaction.type === "donation" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
                      >
                        {transaction.type === "donation" ? "Direct Donation" : "Giveback Donation"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full
                        ${transaction.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
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
                          <p className="font-medium text-sm">{transaction.userName || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">{transaction.userEmail || "No email"}</p>
                        </div>
                      </div>
                      
                      {/* Transaction details */}
                      <div className="ml-11">
                        <p className="text-sm text-gray-700">{transaction.merchant}</p>
                        <p className="text-xs text-gray-500">{transaction.formattedDate}</p>
                      </div>
                    </div>
                    
                    {/* Amount and status */}
                    <div className="mt-3 md:mt-0 text-right">
                      <p className={`font-medium ${
                          transaction.status === "Completed" ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {transaction.formattedAmount}
                      </p>
                      
                      {/* Conditional display for donation transactions */}
                      {transaction.type === "donation" && transaction.status === "Completed" && (
                        <p className="text-xs text-gray-600">
                          {transaction.donationPercentage ? 
                            `${transaction.donationPercentage}% of Rs. ${transaction.originalAmount?.toFixed(2)}` : 
                            "100% of donation"
                          }
                        </p>
                      )}
                      
                      {/* Payment method for completed donations */}
                      {transaction.type === "donation" && transaction.status === "Completed" && transaction.paymentMethod && (
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
              ))
            ) : (
              <p className="text-gray-600">No recent transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;