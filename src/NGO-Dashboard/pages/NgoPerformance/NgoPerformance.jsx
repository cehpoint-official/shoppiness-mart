import { useCallback, useEffect, useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import TransactionHistory from "./TransactionHistory";
import Supporters from "./Supporters";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";

const NgoPerformance = () => {
  const [givebacks, setGivebacks] = useState([]);
  const [donationTransactions, setDonationTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("performance");
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
      .filter((item) => item.status === "Completed")
      .reduce((sum, item) => sum + item.amount, 0) +
    // Sum from completed donation transactions
    donationTransactions
      .filter((item) => item.paymentStatus === "Completed")
      .reduce((sum, item) => sum + (item.donationAmount || item.amount), 0);

  // Calculate total supporters (unique supporters across both systems)
  // Use a combined set of emails for deduplication
  const allSupporterEmails = new Set();

  // Add all giveback emails regardless of status
  givebacks.forEach((item) => {
    if (item.userEmail) {
      allSupporterEmails.add(item.userEmail.toLowerCase());
    }
  });

  // Add all donation transaction emails regardless of status
  donationTransactions.forEach((transaction) => {
    if (transaction.customerEmail) {
      allSupporterEmails.add(transaction.customerEmail.toLowerCase());
    }
  });

  const totalSupporters = allSupporterEmails.size;
  //  console.log(givebacks);

  if (currentView === "transactionHistory") {
    return (
      <TransactionHistory
        onBack={() => setCurrentView("performance")}
        givebacks={givebacks}
        donationTransactions={donationTransactions}
        loading={loading}
      />
    );
  }
  if (currentView === "supporters") {
    return (
      <Supporters
        onBack={() => setCurrentView("performance")}
        givebacks={givebacks}
        donationTransactions={donationTransactions}
      />
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-xl mb-6">Cause/NGO Performance</h2>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <p className="text-gray-500">Total Donations</p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-300 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-medium">
                RS. {totalDonations.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="text-gray-500 mr-4">Transaction History</span>
            <button
              onClick={() => setCurrentView("transactionHistory")}
              className="w-10 h-10 bg-[#FDB022] rounded-full flex items-center justify-center"
            >
              <HiArrowRight className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <p className="text-gray-500">Total Supporters</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-300 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-medium">{totalSupporters} Users</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="text-gray-500 mr-4">Supporters History</span>
            <button
              onClick={() => setCurrentView("supporters")}
              className="w-10 h-10 bg-[#FDB022] rounded-full flex items-center justify-center"
            >
              <HiArrowRight className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoPerformance;
