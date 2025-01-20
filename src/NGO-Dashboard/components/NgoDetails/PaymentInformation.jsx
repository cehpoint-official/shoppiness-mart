import { useState } from "react";

const PaymentInformation = () => {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    ifscCode: "",
    accountNumber: "",
  });
  const [cardDetails, setCardDetails] = useState({
    cardHolder: "",
    cardNumber: "",
    validThru: "",
    cvv: "",
  });

  return (
    <div className="w-full max-w-2xl p-4">
      {/* Notice Banner */}
      <div className="bg-[#FFB93921] p-3 mb-6 rounded">
        <p className="text-sm text-[#C5830B]">
          If supporters donate to your NGO or cause, the funds will be
          transferred to your account after deducting a 2% platform fee.
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {/* UPI Option */}
        <div>
          <label className="flex items-center mb-4">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-2 text-sm">Add UPI</span>
          </label>

          {paymentMethod === "upi" && (
            <div className="pl-6 space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label htmlFor="upiId" className="block text-sm text-gray-600 mb-1">UPI ID</label>
                  <input
                    id="upiId"
                    type="text"
                    placeholder="Enter UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm whitespace-nowrap self-end">
                  VERIFY
                </button>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-gray-200 rounded text-sm">
                  SAVE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bank Account Option */}
        <div>
          <label className="flex items-center mb-4">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "bank"}
              onChange={() => setPaymentMethod("bank")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-2 text-sm">Add Bank</span>
          </label>

          {paymentMethod === "bank" && (
            <div className="pl-6 space-y-3">
              <div>
                <label htmlFor="accountName" className="block text-sm text-gray-600 mb-1">Account Name</label>
                <input
                  id="accountName"
                  type="text"
                  placeholder="Account Name"
                  value={bankDetails.accountName}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label htmlFor="ifscCode" className="block text-sm text-gray-600 mb-1">NEFT IFSC Code</label>
                <input
                  id="ifscCode"
                  type="text"
                  placeholder="NEFT IFSC Code"
                  value={bankDetails.ifscCode}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, ifscCode: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm text-gray-600 mb-1">Account Number</label>
                <input
                  id="accountNumber"
                  type="text"
                  placeholder="Account Number"
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-orange-400 text-white rounded text-sm">
                  SAVE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card Option */}
        <div>
          <label className="flex items-center mb-4">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-2 text-sm">Credit/Debit/ATM Card</span>
          </label>

          {paymentMethod === "card" && (
            <div className="pl-6 space-y-3">
              <div>
                <label htmlFor="cardHolder" className="block text-sm text-gray-600 mb-1">Card Holder Name</label>
                <input
                  id="cardHolder"
                  type="text"
                  placeholder="Card Holder Name"
                  value={cardDetails.cardHolder}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardHolder: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label htmlFor="cardNumber" className="block text-sm text-gray-600 mb-1">Card Number</label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="Enter card number"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label htmlFor="validThru" className="block text-sm text-gray-600 mb-1">Valid Thru</label>
                  <div className="flex gap-2">
                    <select
                      id="validThruMonth"
                      className="w-20 p-2 border rounded text-sm"
                      value={cardDetails.validThru}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          validThru: e.target.value,
                        })
                      }
                    >
                      <option>MM</option>
                    </select>
                    <select
                      id="validThruYear"
                      className="w-20 p-2 border rounded text-sm"
                      value={cardDetails.validThru}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          validThru: e.target.value,
                        })
                      }
                    >
                      <option>YY</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm text-gray-600 mb-1">CVV</label>
                  <input
                    id="cvv"
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                    className="w-24 p-2 border rounded text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-orange-400 text-white rounded text-sm">
                  SAVE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInformation;