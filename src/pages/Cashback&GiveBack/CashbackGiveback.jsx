import { useState } from "react";
import CashbackForm from "../../Components/Chashback&Giveback/CashbackForm";
import "./CashbackGiveback.scss";
import GiveBackForm from "../../Components/Chashback&Giveback/GiveBackForm";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import CashbackRequests from "../../Components/Chashback&Giveback/CashbackRequests";
import GiveBackHistory from "../../Components/Chashback&Giveback/GiveBackHistory";
const CashbackGiveback = () => {
  const [activeTab, setActiveTab] = useState("claim");
  const [showCashbackRequests, setShowCashbackRequests] = useState(false);
  const [showGiveBackHistory, setShowGiveBackHistory] = useState(false);

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
        {activeTab === "claim" ? (
          <button
            onClick={() => setShowCashbackRequests(true)}
            className="text-[#047E72] text-sm border border-[#047E72] rounded px-4 py-1"
          >
            Cashback request
          </button>
        ) : (
          <button
            onClick={() => setShowGiveBackHistory(true)}
            className="text-[#047E72] text-sm border border-[#047E72] rounded px-4 py-1"
          >
            Give Back History
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CashbackCard
          title="Collected Cash backs"
          amount="RS.2500"
          link="View Details"
        />
        <CashbackCard title="Withdraw" amount="RS.500" link="View Details" />
        <CashbackCard title="Give Back" amount="RS.500" link="View Details" />
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
          {activeTab === "giveback" && <GiveBackForm />}
        </div>
      </div>
    </div>
  );
};

export default CashbackGiveback;

const CashbackCard = ({ title, amount, link }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md border border-gray-100">
      <div className="text-sm text-text-gray mb-2">{title}</div>
      <div className="font-medium mb-2">{amount}</div>
      <a href="#" className="text-blue-600 text-sm">
        {link}
      </a>
    </div>
  );
};
