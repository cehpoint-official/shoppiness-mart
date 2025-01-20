const TransactionSummary = () => {
  const transactions = [
    {
      id: 1,
      name: "SHOPNESSSMART",
      date: "02 Jun",
      amount: 2000,
    },
    {
      id: 2,
      name: "SHOPNESSSMART",
      date: "05 May",
      amount: 2000,
    },
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-medium text-gray-900">Transaction Summary</h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                ₹
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.name}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
                <button className="text-sm text-blue-600 hover:underline">
                  See more
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Payment received</p>
              <p className="font-medium text-green-600">
                Rs. {transaction.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionSummary;
