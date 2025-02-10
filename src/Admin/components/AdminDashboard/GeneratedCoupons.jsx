import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

const GeneratedCoupons = () => {
  const [activeTab, setActiveTab] = useState("Monthly");

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl font-semibold mb-6">Generated Coupons</h2>

      <TabGroup activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 bg-green-50 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white text-xl font-bold w-12 h-12 rounded-xl flex items-center justify-center">
            25
          </div>
          <span className="text-lg">All Coupons</span>
        </div>
        <button className="text-green-500 flex items-center gap-1">
          View All <BsChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl font-bold">25</div>
          <div className="text-gray-500">Total</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl font-bold">45</div>
          <div className="text-gray-500">Pending</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl font-bold">05</div>
          <div className="text-gray-500">Claimed</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Blue arc (70%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e6e6e6"
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="12"
              strokeDasharray={`${70 * 2.51} 251`}
              transform="rotate(-90 50 50)"
            />
            {/* Coral arc (30%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ff7f7f"
              strokeWidth="12"
              strokeDasharray={`${30 * 2.51} 251`}
              transform="rotate(180 50 50)"
            />
          </svg>
        </div>

        <div className="space-y-3 mt-6">
          <div>
            <div className="flex justify-between mb-1">
              <span>Total(25)</span>
              <span>70%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full w-[70%] bg-blue-500 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>Delivered(45)</span>
              <span>30%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full w-[30%] bg-[#ff7f7f] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GeneratedCoupons;

const TabGroup = ({ activeTab, setActiveTab }) => (
  <div className="inline-flex bg-gray-100 rounded-full p-1">
    {["Monthly", "Weekly", "Today"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-1 rounded-full text-sm ${
          activeTab === tab ? "bg-white text-black shadow-sm" : "text-blue-500"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);
