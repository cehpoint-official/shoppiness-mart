import { collection, doc, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";

const CashbackForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [existingPayments, setExistingPayments] = useState({
    bankAccounts: [],
    cardDetails: [],
    upiDetails: [],
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { user } = useSelector((state) => state.userReducer);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        data.push({ id: doc.id, ...shopData });
      });
      setShops(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
  };

  const handlePaidAmountChange = (e) => {
    setPaidAmount(e.target.value);
  };

  useEffect(() => {
    const fetchAllPaymentMethods = async () => {
      if (!user?.uid) return;

      try {
        const userBankDetailsRef = doc(db, "userBankDetails", user.uid);

        const bankAccountsSnapshot = await getDocs(
          collection(userBankDetailsRef, "bankAccounts")
        );
        const banks = bankAccountsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "bank",
          ...doc.data(),
        }));

        const cardDetailsSnapshot = await getDocs(
          collection(userBankDetailsRef, "cardDetails")
        );
        const cards = cardDetailsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "card",
          ...doc.data(),
        }));

        const upiDetailsSnapshot = await getDocs(
          collection(userBankDetailsRef, "upiDetails")
        );
        const upis = upiDetailsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "upi",
          ...doc.data(),
        }));

        setExistingPayments({
          bankAccounts: banks,
          cardDetails: cards,
          upiDetails: upis,
        });

        if (banks.length > 0) {
          setSelectedPayment(banks[0]);
        } else if (cards.length > 0) {
          setSelectedPayment(cards[0]);
        } else if (upis.length > 0) {
          setSelectedPayment(upis[0]);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchAllPaymentMethods();
  }, [user?.uid]);

  const handlePaymentSelection = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentSelection(false);
  };

  const getPaymentDisplayText = (payment) => {
    if (!payment) return "";

    switch (payment.type) {
      case "bank":
        return `${payment.bankName} XXXXX${payment.accountNumber.slice(-3)}`;
      case "card":
        return `${payment.cardHolder} Card XXXXX${payment.cardNumber.slice(
          -4
        )}`;
      case "upi":
        return payment.upiId;
      default:
        return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      selectedShop,
      paidAmount,
      selectedFile,
      selectedPayment,
      status: "New",
    };

    console.log("Form Data:", formData);
  };

  return (
    <div className="relative">
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-2">Select Shop</label>
          <select
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            value={selectedShop}
            onChange={handleShopChange}
          >
            <option value="">Select a shop...</option>
            {shops.map((shop, index) => (
              <option key={index} value={shop.businessName}>
                {shop.businessName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Paid Amount</label>
          <input
            type="text"
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            value={paidAmount}
            onChange={handlePaidAmountChange}
          />
        </div>

        <div className="flex gap-5 items-center">
          <label className="block text-sm mb-2">Upload Invoice</label>
          <div className="flex gap-2 items-center">
            <label className="bg-gray-200 text-sm px-4 py-2 rounded cursor-pointer flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div>
            {selectedPayment
              ? getPaymentDisplayText(selectedPayment)
              : "No payment method selected"}
          </div>
          <button
            type="button"
            className="text-[#07B0A0] font-medium"
            onClick={() => setShowPaymentSelection(!showPaymentSelection)}
          >
            CHANGE
          </button>
        </div>

        {showPaymentSelection && (
          <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-md border p-4 z-10">
            {existingPayments.bankAccounts.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Bank Accounts</h3>
                {existingPayments.bankAccounts.map((bank) => (
                  <div
                    key={bank.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handlePaymentSelection(bank)}
                  >
                    <span className="text-sm">{`${bank.bankName} - ${bank.accountNumber}`}</span>
                  </div>
                ))}
              </div>
            )}

            {existingPayments.cardDetails.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Cards</h3>
                {existingPayments.cardDetails.map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handlePaymentSelection(card)}
                  >
                    <span className="text-sm">{`${
                      card.cardHolder
                    } - XXXX${card.cardNumber.slice(-4)}`}</span>
                  </div>
                ))}
              </div>
            )}

            {existingPayments.upiDetails.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">UPI</h3>
                {existingPayments.upiDetails.map((upi) => (
                  <div
                    key={upi.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handlePaymentSelection(upi)}
                  >
                    <span className="text-sm">{upi.upiId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white rounded py-2 text-md mt-6"
        >
          Claim Cashback
        </button>
      </form>
    </div>
  );
};

export default CashbackForm;
