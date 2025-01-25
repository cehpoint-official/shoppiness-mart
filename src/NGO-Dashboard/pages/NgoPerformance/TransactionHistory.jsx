import { HiArrowLeft } from "react-icons/hi";
import { GoArrowDownLeft } from "react-icons/go";

const TransactionRow = ({ merchant, id, date, amount, status }) => (
  <div className="border bg-white shadow-md rounded-lg p-6 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-[#19CA9F] rounded-full flex items-center justify-center">
          <GoArrowDownLeft className="text-white text-xl" />
        </div>
        <div>
          <p className="font-medium">{merchant}</p>
          <p className="text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p>{date}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p>Rs. {amount}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-emerald-500">{status}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Action</p>
          <button className="text-blue-500">View Details</button>
        </div>
      </div>
    </div>
  </div>
);

const TransactionHistory = ({ onBack }) => {
  const transactions = [
    {
      merchant: "SPHOPINESSSMART",
      id: "8879090009",
      date: "12 Jun 2024 at 8 PM",
      amount: "2000",
      status: "Recived",
    },
    // Repeated data for demonstration
    {
      merchant: "SPHOPINESSSMART",
      id: "8879090009",
      date: "12 Jun 2024 at 8 PM",
      amount: "2000",
      status: "Recived",
    },
    {
      merchant: "SPHOPINESSSMART",
      id: "8879090009",
      date: "12 Jun 2024 at 8 PM",
      amount: "2000",
      status: "Recived",
    },
    {
      merchant: "SPHOPINESSSMART",
      id: "8879090009",
      date: "12 Jun 2024 at 8 PM",
      amount: "2000",
      status: "Recived",
    },
    {
      merchant: "SPHOPINESSSMART",
      id: "8879090009",
      date: "12 Jun 2024 at 8 PM",
      amount: "2000",
      status: "Recived",
    },
  ];

  return (
    <div className="p-10">
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
        <button className="px-4 py-2 border border-black rounded-lg hover:bg-gray-50">
          Filter
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <TransactionRow key={index} {...transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
