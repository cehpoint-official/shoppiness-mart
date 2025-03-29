import { HiArrowLeft } from "react-icons/hi";
import { GoArrowDownLeft } from "react-icons/go";

const TransactionRow = ({ merchant, id, date, amount, status }) => (
  <div className="border bg-white shadow-md rounded-lg p-4 md:p-6 mb-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Merchant Info - Always on top on mobile */}
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-[#19CA9F] rounded-full flex items-center justify-center">
          <GoArrowDownLeft className="text-white text-xl" />
        </div>
        <div>
          <p className="font-medium">{merchant}</p>
          <p className="text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>
      
      {/* Transaction Details - Responsive grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-sm md:text-base">{date}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-sm md:text-base">Rs. {amount}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-emerald-500 text-sm md:text-base">{status}</p>
        </div>
        
        {/* <div className="col-span-2 md:col-span-1">
          <p className="text-sm text-gray-500">Action</p>
          <button className="text-blue-500 text-sm md:text-base">View Details</button>
        </div> */}
      </div>
    </div>
  </div>
);

const TransactionHistory = ({ onBack, givebacks }) => {
  // Transform givebacks into transactions
  const transactions = givebacks
    .filter((item) => item.status === "Completed") // Only include completed transactions
    .map((item) => ({
      merchant: item.userName, // Static merchant name
      id: item.id, // Use the transaction ID from givebacks
      date: new Date(item.paidAt || item.requestedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }), // Format date
      amount: item.amount, // Use the amount from givebacks
      status: "Received", // Static status for completed transactions
    }));

  return (
    <div className="p-4 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="hover:bg-gray-100 p-2 rounded-full"
          >
            <HiArrowLeft className="text-xl" />
          </button>
          <h2 className="text-xl">Transaction History</h2>
        </div>
        {/* <button className="px-4 py-2 border border-black rounded-lg hover:bg-gray-50">
          Filter
        </button> */}
      </div>

      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TransactionRow key={index} {...transaction} />
          ))
        ) : (
          <p className="text-gray-600">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;