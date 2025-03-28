import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExist } from "../../redux/reducer/userReducer";
import { BiLoaderAlt } from "react-icons/bi";
const WithdrawalForm = () => {
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [existingPayments, setExistingPayments] = useState({
    bankAccounts: [],
    cardDetails: [],
    upiDetails: [],
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { user } = useSelector((state) => state.userReducer);
  const [amount, setAmount] = useState("");
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const { userId } = useParams();
  const dispatch = useDispatch();
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

        setLoadingPayment(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingWithdrawal(true);

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Enter a valid withdrawal amount");
      setIsProcessingWithdrawal(false);
      return;
    }

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      toast.error("Error fetching user data");
      setIsProcessingWithdrawal(false);
      return;
    }

    const userData = docSnap.data();
    const availableCashback = userData.collectedCashback || 0;

    if (Number(amount) > availableCashback) {
      toast.error("Insufficient cashback balance");
      setIsProcessingWithdrawal(false);
      return;
    }

    try {
      // Store the withdrawal request with status "Pending"
      await addDoc(collection(db, "WithdrawCashback"), {
        userId,
        userName: user.fname + " " + user.lname,
        userEmail: user.email,
        amount: Number(amount),
        selectedPayment,
        status: "Pending",
        requestedAt: new Date().toISOString(),
      });

      const numAmount = Number(amount);

      // Update Firestore
      await updateDoc(docRef, {
        collectedCashback: increment(-numAmount),
        pendingCashback: increment(numAmount),
      });
      // Add notification to adminNotifications collection
      await addDoc(collection(db, "adminNotifications"), {
      message: `New Withdrawal request from ${user.fname} ${user.lname} for amount ${numAmount} .`,
      createdAt: new Date().toISOString(),
      read: false,
    });
      // Update Redux state immediately
      const updatedUser = {
        ...user,
        collectedCashback: (user.collectedCashback || 0) - numAmount,
        pendingCashback: (user.pendingCashback || 0) + numAmount,
      };
      dispatch(userExist(updatedUser));

      toast.success("Withdrawal request submitted successfully!");
      setAmount("");
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessingWithdrawal(false);
    }
  };

  return (
    <div className="relative">
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-2">Enter Amount</label>
          <input
            type="text"
            placeholder="Enter withdrawal amount"
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <div>
            {loadingPayment ? (
              <div className="w-40 h-4 bg-gray-300 rounded animate-pulse"></div>
            ) : selectedPayment ? (
              getPaymentDisplayText(selectedPayment)
            ) : (
              "No payment method selected"
            )}
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
          disabled={isProcessingWithdrawal}
          className="w-full flex justify-center items-center gap-3 bg-blue-700 text-white rounded py-2 text-md mt-6"
        >
          {" "}
          {isProcessingWithdrawal ? (
            <>
              <BiLoaderAlt className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Withdraw Amount"
          )}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalForm;
