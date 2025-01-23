import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";

const POS = ({ onGenerateInvoice }) => {
  const [products] = useState([
    {
      id: 1,
      name: "Phone",
      price: 20000,
      quantity: 1,
      discount: 20,
      subtotal: 18000,
    },
  ]);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [cashCollected, setCashCollected] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [tempTaxPercentage, setTempTaxPercentage] = useState("");
  const [tempTaxAmount, setTempTaxAmount] = useState("");
  const [tempCashCollected, setTempCashCollected] = useState("");
  const [tempChangeAmount, setTempChangeAmount] = useState("");

  const handleTaxEdit = () => {
    setTempTaxPercentage(taxPercentage.toString());
    setTempTaxAmount(taxAmount.toString());
    setShowTaxModal(true);
  };

  const handleCashEdit = () => {
    setTempCashCollected(cashCollected.toString());
    setTempChangeAmount(changeAmount.toString());
    setShowCashModal(true);
  };

  const handleTaxClose = () => {
    setShowTaxModal(false);
  };

  const handleCashClose = () => {
    setShowCashModal(false);
  };

  const handleTaxSave = () => {
    const newTaxPercentage = parseFloat(tempTaxPercentage) || 0;
    const newTaxAmount = parseFloat(tempTaxAmount) || 0;
    setTaxPercentage(newTaxPercentage);
    setTaxAmount(newTaxAmount);
    setShowTaxModal(false);
  };

  const handleCashSave = () => {
    const newCashCollected = parseFloat(tempCashCollected) || 0;
    const newChangeAmount = parseFloat(tempChangeAmount) || 0;
    setCashCollected(newCashCollected);
    setChangeAmount(newChangeAmount);
    setShowCashModal(false);
    };
    
    const handleGenerateInvoice = () => {
        const invoiceData = {
          customerName: "Tithi Mondal",
          phoneNumber: "9764676879",
          products: products,
          taxPercentage,
          taxAmount,
          cashCollected,
          changeAmount,
          // Add any other necessary data
        };
        onGenerateInvoice(invoiceData);
      };
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between">
          <div className="w-[550px]">
            <h2 className="text-md mb-2">Verify coupon</h2>
            <div className="relative w-full">
              <input
                type="text"
                className="w-full border border-black rounded-md shadow-sm py-2 pl-2 pr-20"
              />
              <button className="absolute inset-y-0 right-0 px-4 text-blue-500">
                Verify
              </button>
            </div>
          </div>
          <div className="bg-[#00639A26] text-[#0E2744] w-1/2 p-4">
            <p>
              Name: Tithi Mondal, Email: email@gmail.com, Phone No.
              656578888887, Offer from shop: 20% OFF on Phone, (2.5% Cashback)
            </p>
          </div>
        </div>

        <form className="space-y-4 mt-10">
          <div className="grid grid-cols-3 gap-4 text-black font-medium">
            <div className="flex flex-col gap-3">
              <span className="">Customer Name:</span>
              <input type="text" className=" bg-gray-50 rounded px-2 py-2" />
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-medium">Phone No.:</span>
              <input type="text" className="bg-gray-50 rounded px-2 py-2" />
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-medium">Email:</span>
              <input type="text" className="bg-gray-50 rounded px-2 py-2" />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-black font-medium">
              <div className="flex flex-col gap-3">
                <span className="font-medium">Biller Name:</span>
                <input type="text" className="bg-gray-50 rounded px-2 py-2" />
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-medium">Billing Date:</span>
                <input type="text" className="bg-gray-50 rounded px-2 py-2" />
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-medium">Due Date:</span>
                <input type="text" className="bg-gray-50 rounded px-2 py-2" />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="max-w-7xl flex gap-4 mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="bg-gray-50 w-[500px] p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold mb-4">Add Product</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-gray-700 font-medium mb-2"
              >
                Product Name*
              </label>
              <input
                type="text"
                id="productName"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-gray-700 font-medium mb-2"
              >
                Product Name*
              </label>
              <div className="mb-4 flex bg-white items-center">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                >
                  -
                </button>
                <span className="mx-4 text-gray-700 font-medium">1X</span>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md ml-2"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-700 font-medium mb-2"
              >
                Price*
              </label>
              <input
                type="number"
                id="price"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product price"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="discountType"
                className="block text-gray-700 font-medium mb-2"
              >
                Discount Type*
              </label>
              <select
                id="discountType"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select discount type</option>
                <option value="percent">Percentage</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="discount"
                className="block text-gray-700 font-medium mb-2"
              >
                Discount*
              </label>
              <input
                type="number"
                id="discount"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter discount"
              />
            </div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Add
            </button>
          </form>
        </div>
        <div className="max-w-5xl mx-auto p-6 bg-white">
          <h1 className="text-xl font-bold mb-6">SELECTED PRODUCTS</h1>

          {/* Products Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 font-semibold">PRODUCT</th>
                  <th className="text-left py-4 font-semibold">PRICE</th>
                  <th className="text-left py-4 font-semibold">QUANTITY</th>
                  <th className="text-left py-4 font-semibold">DISCOUNT</th>
                  <th className="text-left py-4 font-semibold">SUBTOTAL</th>
                  <th className="text-left py-4 font-semibold">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-4">{product.name}</td>
                    <td className="py-4">
                      Rs. {product.price.toLocaleString()}
                    </td>
                    <td className="py-4">{product.quantity}X</td>
                    <td className="py-4">{product.discount}%</td>
                    <td className="py-4">
                      Rs. {product.subtotal.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <button className="text-red-500 hover:text-red-700">
                        <RxCross2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Total Item</p>
                <p className="text-2xl font-semibold">01</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Total Price Rs.</p>
                <p className="text-2xl font-semibold">18,000</p>
              </div>
              <div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-gray-600">TAX:</p>
                  <button onClick={handleTaxEdit}>
                    <FaRegEdit className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-600">Cash collected</p>
                  <button onClick={handleCashEdit}>
                    <FaRegEdit className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-semibold">Grand Total</p>
                <p className="text-2xl font-bold text-blue-600">18,050</p>
              </div>
            </div>
          </div>

          {/* Generate Invoice Button */}
          <button
            onClick={handleGenerateInvoice}
            className="w-full mt-6 bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Generate Invoice
          </button>
        </div>
        {/* New Tax Modal Design */}
        {/* Tax Modal */}
        {showTaxModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[700px] p-6 relative">
              <button
                onClick={handleTaxClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <RxCross2 size={20} />
              </button>
              <div className="space-y-4">
                <div className="flex gap-10 my-10 mx-5">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={tempTaxPercentage}
                      onChange={(e) => setTempTaxPercentage(e.target.value)}
                      className="w-full p-2 bg-gray-100 rounded border border-gray-300"
                      placeholder="Enter tax percentage"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Tax Percentage
                    </label>
                    <input
                      type="number"
                      value={tempTaxAmount}
                      onChange={(e) => setTempTaxAmount(e.target.value)}
                      className="w-full p-2 bg-gray-100 rounded border border-gray-300"
                      placeholder="Enter tax amount"
                    />
                  </div>
                </div>
                <button
                  onClick={handleTaxSave}
                  className="w-full bg-[#1BD4A8] text-white py-2 rounded hover:bg-emerald-600 transition-colors"
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cash Modal */}
        {showCashModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[700px] p-6 relative">
              <button
                onClick={handleCashClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <RxCross2 size={20} />
              </button>
              <div className="space-y-4">
                <div className="flex gap-10 my-10 mx-5">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={tempCashCollected}
                      onChange={(e) => setTempCashCollected(e.target.value)}
                      className="w-full p-2 bg-gray-100 rounded border border-gray-300"
                      placeholder="Enter cash collected"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Cash Collected
                    </label>
                    <input
                      type="number"
                      value={tempChangeAmount}
                      onChange={(e) => setTempChangeAmount(e.target.value)}
                      className="w-full p-2 bg-gray-100 rounded border border-gray-300"
                      placeholder="Enter change amount"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCashSave}
                  className="w-full bg-[#1BD4A8] text-white py-2 rounded hover:bg-emerald-600 transition-colors"
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;
