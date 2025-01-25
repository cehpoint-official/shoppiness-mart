import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import TransactionHistory from "./TransactionHistory";
import Supporters from "./Supporters";

const NgoPerformance = () => {
  const performanceData = [
    {
      title: "Total Donations",
      value: "RS. 25,000",
      buttonLabel: "Transaction History",
      onClick: () => setCurrentView("transactionHistory"),
    },
    {
      title: "Total Supporters",
      value: "500 Users",
      buttonLabel: "Supporters",
      onClick: () => setCurrentView("supporters"),
    },
  ];

  const [currentView, setCurrentView] = useState("performance");

  if (currentView === "transactionHistory") {
    return <TransactionHistory onBack={() => setCurrentView("performance")} />;
  }
  if (currentView === "supporters") {
    return <Supporters onBack={() => setCurrentView("performance")} />;
  }
  const PerformanceCard = ({ title, value, buttonLabel, onClick }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <p className="text-gray-500">{title}</p>
          <p className="text-2xl font-medium">{value}</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="text-gray-500 mr-4">{buttonLabel}</span>

          <button
            onClick={onClick}
            className="w-10 h-10 bg-[#FDB022] rounded-full flex items-center justify-center"
          >
            <HiArrowRight className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-10">
      <h2 className="text-xl mb-6">Cause/NGO Performance</h2>
      {performanceData.map((data, index) => (
        <PerformanceCard
          key={index}
          title={data.title}
          value={data.value}
          buttonLabel={data.buttonLabel}
          onClick={data.onClick}
        />
      ))}
    </div>
  );
};

export default NgoPerformance;
