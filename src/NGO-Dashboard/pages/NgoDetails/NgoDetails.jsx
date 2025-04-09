import { useState } from "react";
import CauseInformation from "../../components/NgoDetails/CauseInformation";
import CauseImage from "../../components/NgoDetails/CauseImage";
import PaymentInformation from "../../components/NgoDetails/PaymentInformation";
import TransactionSummary from "../../components/NgoDetails/TransactionSummary";
import CausePage from "../../components/NgoDetails/CausePage";

const NgoDetails = () => {
  const [activeTab, setActiveTab] = useState("cause-info");

  const tabs = [
    {
      id: "cause-info",
      label: "Cause Information",
      component: <CauseInformation />,
    },
    { id: "cause-image", label: "Cause Image", component: <CauseImage /> },
    {
      id: "payment-info",
      label: "Payment Information",
      component: <PaymentInformation />,
    },
    {
      id: "transaction",
      label: "Transaction Summary",
      component: <TransactionSummary />,
    },
    { id: "cause-page", label: "Cause Page", component: <CausePage /> },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-10 pt-5">
      <h1 className="text-xl sm:text-2xl mb-4 sm:mb-6">Cause/NGO Details</h1>

      <div>
        <div className="overflow-x-auto">
          <div className="flex md:space-x-8 flex-col md:flex-row min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-3 md:py-4 px-2 md:px-1 text-sm transition-colors relative
                  w-full md:w-auto text-left
                  ${
                    activeTab === tab.id
                      ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#5E5E5E] text-black font-medium"
                      : "text-[#5E5E5E] hover:text-black"
                  }
                  border-gray-200 md:border-b-0
                  touch-manipulation
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default NgoDetails;
