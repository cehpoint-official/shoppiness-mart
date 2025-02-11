import { useState } from "react";
import CashbackForm from "../../Components/Chashback&Giveback/CashbackForm";
import "./CashbackGiveback.scss";
import GiveBackForm from "../../Components/Chashback&Giveback/GiveBackForm";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import CashbackRequests from "../../Components/Chashback&Giveback/CashbackRequests";
import GiveBackHistory from "../../Components/Chashback&Giveback/GiveBackHistory";
import WithdrawalForm from "../../Components/Chashback&Giveback/WithdrawalForm";
import WithdrawlRequests from "../../Components/Chashback&Giveback/WithdrawlRequests";
import { useSelector } from "react-redux";

const CashbackGiveback = () => {
  const [activeTab, setActiveTab] = useState("claim");
  const [showCashbackRequests, setShowCashbackRequests] = useState(false);
  const [showGiveBackHistory, setShowGiveBackHistory] = useState(false);
  const [showWithdrawalRequests, setShowWithdrawalRequests] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
  };
  
  if (showCashbackRequests) {
    return (
      <div className=" p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCashbackRequests(false)}
            className="p-1"
          >
            <HiOutlineArrowNarrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-normal">Cashback Requests</h2>
        </div>
        <CashbackRequests />
      </div>
    );
  }

  if (showWithdrawalRequests) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWithdrawalRequests(false)}
            className="p-1"
          >
            <HiOutlineArrowNarrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-normal">Withdrawal Request</h2>
        </div>
        <WithdrawlRequests />
      </div>
    );
  }
  if (showGiveBackHistory) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowGiveBackHistory(false)} className="p-1">
            <HiOutlineArrowNarrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-normal">Giveback History</h2>
        </div>
        <GiveBackHistory />
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Cashback</h1>
        {activeTab === "claim" && (
          <button
            onClick={() => setShowCashbackRequests(true)}
            className="text-[#047E72] text-sm border border-[#047E72] rounded px-4 py-1"
          >
            Cashback request
          </button>
        )}
        {activeTab === "withdrawal" && (
          <button
            onClick={() => setShowWithdrawalRequests(true)}
            className="text-[#047E72] text-sm border border-[#047E72] rounded px-4 py-1"
          >
            Withdrawal Request
          </button>
        )}
        {activeTab === "giveback" && (
          <button
            onClick={() => setShowGiveBackHistory(true)}
            className="text-[#047E72] text-sm border border-[#047E72] rounded px-4 py-1"
          >
            Giveback History
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CashbackCard
          title="Collected Cash backs"
          amount={user?.collectedCashback || 0}
          pendingAmount={user?.pendingCashback || 0}
          link="View Details"
        />
        <CashbackCard
          title="Withdraw"
          amount={user?.withdrawAmount || 0}
          link="View Details"
        />
        <CashbackCard
          title="Give Back"
          amount={user?.givebackAmount || 0}
          pendingGivebackAmount={user?.pendingGivebackAmount || 0}
          link="View Details"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleTabClick("claim")}
            className={`text-sm font-medium pb-2 px-1 transition-all ${
              activeTab === "claim"
                ? "border-b-2 border-[#047E72] text-[#047E72]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Claim Cashback
          </button>
          <button
            onClick={() => handleTabClick("withdrawal")}
            className={`text-sm font-medium pb-2 px-1 transition-all ${
              activeTab === "withdrawal"
                ? "border-b-2 border-[#047E72] text-[#047E72]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Withdraw Cashback
          </button>
          <button
            onClick={() => handleTabClick("giveback")}
            className={`text-sm font-medium pb-2 px-1 transition-all ${
              activeTab === "giveback"
                ? "border-b-2 border-[#047E72] text-[#047E72]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Give Back your Cashback
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "claim" && <CashbackForm />}
          {activeTab === "withdrawal" && <WithdrawalForm />}
          {activeTab === "giveback" && <GiveBackForm />}
        </div>
      </div>
    </div>
  );
};

export default CashbackGiveback;

const CashbackCard = ({
  title,
  amount,
  pendingAmount,
  pendingGivebackAmount,
  link,
}) => {
  const isLoading = amount === undefined || amount === null;
  const isPendingLoading =
    pendingAmount === undefined || pendingAmount === null;
  const isPendingGivebackLoading =
    pendingGivebackAmount === undefined || pendingGivebackAmount === null;

  return (
    <div className="bg-white p-4 rounded shadow-md border border-gray-100">
      <div className="text-sm text-text-gray mb-2">{title}</div>

      {/* Main Amount */}
      <div className="font-medium text-lg mb-3">
        {isLoading ? (
          <div className="animate-pulse h-6 w-20 bg-gray-200 rounded"></div>
        ) : (
          <>₹{amount}</>
        )}
      </div>

      {/* Pending Amounts Section */}
      <div className="space-y-2">
        {/* Pending Withdrawal */}
        {pendingAmount > 0 && (
          <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
            <span className="mr-2">🕒</span>
            {isPendingLoading ? (
              <div className="animate-pulse h-4 w-16 bg-amber-200 rounded"></div>
            ) : (
              <>Pending Withdrawal: ₹{pendingAmount}</>
            )}
          </div>
        )}

        {/* Pending Giveback */}
        {pendingGivebackAmount > 0 && (
          <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded">
            <span className="mr-2">💝</span>
            {isPendingGivebackLoading ? (
              <div className="animate-pulse h-4 w-16 bg-purple-200 rounded"></div>
            ) : (
              <>Pending Giveback: ₹{pendingGivebackAmount}</>
            )}
          </div>
        )}
      </div>

      {/* Link */}
      <div className="mt-3">
        <a href="#" className="text-blue-600 text-sm hover:underline">
          {link}
        </a>
      </div>
    </div>
  );
};
