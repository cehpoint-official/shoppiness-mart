import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { doc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Payment = ({ userData }) => {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [existingPayments, setExistingPayments] = useState({
    bankAccounts: [],
    cardDetails: [],
    upiDetails: [],
  });

  // State for new payment methods
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
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

  // Fetch all existing payment methods on component mount
  useEffect(() => {
    const fetchAllPaymentMethods = async () => {
      if (!userData?.uid) return;

      try {
        const userBankDetailsRef = doc(db, "userBankDetails", userData.uid);

        // Fetch bank accounts
        const bankAccountsSnapshot = await getDocs(
          collection(userBankDetailsRef, "bankAccounts")
        );
        const banks = bankAccountsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch card details
        const cardDetailsSnapshot = await getDocs(
          collection(userBankDetailsRef, "cardDetails")
        );
        const cards = cardDetailsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch UPI details
        const upiDetailsSnapshot = await getDocs(
          collection(userBankDetailsRef, "upiDetails")
        );
        const upis = upiDetailsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExistingPayments({
          bankAccounts: banks,
          cardDetails: cards,
          upiDetails: upis,
        });
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchAllPaymentMethods();
  }, [userData?.uid]);

  // Save new payment method handlers
  const saveUpiDetails = async () => {
    if (!upiId.trim()) return;

    try {
      const userBankDetailsRef = doc(db, "userBankDetails", userData.uid);
      const upiCollectionRef = collection(userBankDetailsRef, "upiDetails");

      await addDoc(upiCollectionRef, {
        upiId: upiId.trim(),
      });

      // Refresh the UPI list
      const newUpiList = [
        ...existingPayments.upiDetails,
        { upiId: upiId.trim() },
      ];
      setExistingPayments((prev) => ({
        ...prev,
        upiDetails: newUpiList,
      }));

      // Reset form
      setUpiId("");
      setShowPaymentMethods(false);
    } catch (error) {
      console.error("Error saving UPI details:", error);
    }
  };

  const saveBankDetails = async () => {
    if (!bankDetails.bankName || !bankDetails.accountNumber) return;

    try {
      const userBankDetailsRef = doc(db, "userBankDetails", userData.uid);
      const bankCollectionRef = collection(userBankDetailsRef, "bankAccounts");

      await addDoc(bankCollectionRef, bankDetails);

      // Refresh the bank accounts list
      const newBanksList = [...existingPayments.bankAccounts, bankDetails];
      setExistingPayments((prev) => ({
        ...prev,
        bankAccounts: newBanksList,
      }));

      // Reset form
      setBankDetails({
        bankName: "",
        accountName: "",
        ifscCode: "",
        accountNumber: "",
      });
      setShowPaymentMethods(false);
    } catch (error) {
      console.error("Error saving bank details:", error);
    }
  };

  const saveCardDetails = async () => {
    if (!cardDetails.cardNumber || !cardDetails.cardHolder) return;

    try {
      const userBankDetailsRef = doc(db, "userBankDetails", userData.uid);
      const cardCollectionRef = collection(userBankDetailsRef, "cardDetails");

      await addDoc(cardCollectionRef, cardDetails);

      // Refresh the cards list
      const newCardsList = [...existingPayments.cardDetails, cardDetails];
      setExistingPayments((prev) => ({
        ...prev,
        cardDetails: newCardsList,
      }));

      // Reset form
      setCardDetails({
        cardHolder: "",
        cardNumber: "",
        validThru: "",
        cvv: "",
      });
      setShowPaymentMethods(false);
    } catch (error) {
      console.error("Error saving card details:", error);
    }
  };

  // Helper function to mask card number
  const maskCardNumber = (number) => {
    return `********${number.slice(-4)}`;
  };

  const hasExistingPayments =
    existingPayments.bankAccounts.length > 0 ||
    existingPayments.cardDetails.length > 0 ||
    existingPayments.upiDetails.length > 0;

  // Generate years for card expiry
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  return (
    <div className=" p-2">
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl font-bold">Payment Methods</h1>

        {/* Display existing payment methods */}
        {hasExistingPayments && (
          <div className="space-y-4">
            {existingPayments.bankAccounts.map((bank, index) => (
              <div
                key={`bank-${index}`}
                className="p-4 border rounded shadow-sm"
              >
                <p className="font-medium text-gray-800">Bank Account</p>
                <p className="text-lg font-medium">{bank.bankName}</p>
                <p className="text-sm text-gray-600">
                  Account: {bank.accountNumber}
                </p>
              </div>
            ))}

            {existingPayments.cardDetails.map((card, index) => (
              <div
                key={`card-${index}`}
                className="p-4 border rounded shadow-sm"
              >
                <p className="font-medium text-gray-800">Card</p>
                <p className="text-lg font-medium">{card.cardHolder}</p>
                <p className="text-sm text-gray-600">
                  {maskCardNumber(card.cardNumber)}
                </p>
              </div>
            ))}

            {existingPayments.upiDetails.map((upi, index) => (
              <div
                key={`upi-${index}`}
                className="p-4 border rounded shadow-sm"
              >
                <p className="font-medium text-gray-800">UPI</p>
                <p className="text-lg text-gray-600">{upi.upiId}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Payment Method Button */}
        <button
          onClick={() => setShowPaymentMethods(!showPaymentMethods)}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-full md:w-1/3 flex items-center justify-center gap-3 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          {hasExistingPayments
            ? "Add Another Payment Method"
            : "Add Payment Method"}
        </button>

        {/* Payment Methods Forms */}
        {showPaymentMethods && (
          <div className="space-y-6 border rounded-lg p-6">
            {/* Payment Method Selection */}
            <div className="space-y-4">
              {/* UPI Option */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium">UPI</span>
              </label>

              {/* Bank Account Option */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium">Bank Account</span>
              </label>

              {/* Card Option */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium">Credit/Debit Card</span>
              </label>
            </div>

            {/* UPI Form */}
            {paymentMethod === "upi" && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="username@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={saveUpiDetails}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors self-end"
                  >
                    Save UPI
                  </button>
                </div>
              </div>
            )}

            {/* Bank Account Form */}
            {paymentMethod === "bank" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={bankDetails.ifscCode}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        ifscCode: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveBankDetails}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Bank Account
                  </button>
                </div>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardHolder}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardHolder: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value,
                      })
                    }
                    maxLength={16}
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={cardDetails.validThru.split("/")[0] || ""}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            validThru: `${e.target.value}/${
                              cardDetails.validThru.split("/")[1] || ""
                            }`,
                          })
                        }
                        className="w-24 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option
                              key={month}
                              value={month.toString().padStart(2, "0")}
                            >
                              {month.toString().padStart(2, "0")}
                            </option>
                          )
                        )}
                      </select>

                      <select
                        value={cardDetails.validThru.split("/")[1] || ""}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            validThru: `${
                              cardDetails.validThru.split("/")[0] || ""
                            }/${e.target.value}`,
                          })
                        }
                        className="w-24 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">YY</option>
                        {generateYears().map((year) => (
                          <option key={year} value={year.toString().slice(-2)}>
                            {year.toString().slice(-2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      className="w-24 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveCardDetails}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Card
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
