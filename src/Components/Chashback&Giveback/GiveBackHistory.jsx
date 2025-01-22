import { LuArrowUpDown } from "react-icons/lu";

const GiveBackHistory = () => {
  const historyData = [
    {
      ngo: "Sun NGO",
      amount: 2500,
      status: "Successfully Completed",
    },
    {
      ngo: "Sun NGO",
      amount: 2500,
      status: "Successfully Completed",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 text-sm text-[#047E72]">
          <LuArrowUpDown className="h-4 w-4 text-[#047E72]" />
          Sort by
        </button>
      </div>
      <div className="space-y-4">
        {historyData.map((item, index) => (
          <div key={index} className="bg-[#FAFFFE] p-4 border border-[#D2EDEA] space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium text-blue-700">
                {item.ngo}
              </h3>
              <button className="text-blue-700 underline text-sm">View</button>
            </div>
            <p className="text-sm text-gray-500">
              Your Generous Giveback of Rs. {item.amount} to {item.ngo} Has Been{" "}
              {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiveBackHistory;
