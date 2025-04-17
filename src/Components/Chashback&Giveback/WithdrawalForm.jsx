import { addDoc, collection, doc, getDoc, getDocs, updateDoc, increment, query, where } from "firebase/firestore";
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
  const [cashbackType, setCashbackType] = useState("shops"); // Default to shops
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

    try {
      const numAmount = Number(amount);

      if (cashbackType === "INRDeals") {
        // Process INRDeals cashback withdrawal
        await processINRDealsWithdrawal(numAmount);
      } else {
        // Process regular shop cashback withdrawal
        await processRegularWithdrawal(numAmount);
      }

      toast.success("Withdrawal request submitted successfully!");
      setAmount("");
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsProcessingWithdrawal(false);
    }
  };

  const processRegularWithdrawal = async (numAmount) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Error fetching user data");
    }

    const userData = docSnap.data();
    const availableCashback = userData.collectedCashback || 0;

    if (numAmount > availableCashback) {
      throw new Error("Insufficient cashback balance");
    }

    // Store the withdrawal request with status "Pending"
    await addDoc(collection(db, "WithdrawCashback"), {
      userId,
      userName: user.fname + " " + user.lname,
      userEmail: user.email,
      amount: numAmount,
      selectedPayment,
      status: "Pending",
      cashbackType: "shops",
      requestedAt: new Date().toISOString(),
    });

    // Update Firestore
    await updateDoc(docRef, {
      collectedCashback: increment(-numAmount),
      pendingCashback: increment(numAmount),
    });

    // Add notification to adminNotifications collection
    await addDoc(collection(db, "adminNotifications"), {
      message: `New Withdrawal request from ${user.fname} ${user.lname} for amount ${numAmount}.`,
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
  };

  const processINRDealsWithdrawal = async (numAmount) => {
    // Query transactions collection for verified INRDeals transactions
    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", user.uid),
      where("status", "==", "verified")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No verified INRDeals transactions found");
    }

    // Get all transactions with commission and sort by commission amount
    const transactions = [];
    let totalAvailableCommission = 0;

    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      let commission = 0;
      
      // Check for commission in different possible locations
      if (transaction.inrdeals && typeof transaction.inrdeals.commission === 'number') {
        commission = transaction.inrdeals.commission;
      } else if (typeof transaction.commission === 'number') {
        commission = transaction.commission;
      } else if (typeof transaction.inrdealsCommission === 'number') {
        commission = transaction.inrdealsCommission;
      }

      if (commission > 0) {
        totalAvailableCommission += commission;
        transactions.push({
          id: doc.id,
          commission: commission,
          data: transaction
        });
      }
    });

    if (numAmount > totalAvailableCommission) {
      throw new Error(`Insufficient INRDeals cashback balance. Available: ${totalAvailableCommission}, Requested: ${numAmount}`);
    }

    // Store the withdrawal request with status "Pending"
    await addDoc(collection(db, "WithdrawCashback"), {
      userId,
      userName: user.fname + " " + user.lname,
      userEmail: user.email,
      amount: numAmount,
      selectedPayment,
      status: "Pending",
      cashbackType: "INRDeals",
      requestedAt: new Date().toISOString(),
    });

    // Update user document to track pending INRDeals cashback separately
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      pendingInrDealsCashback: increment(numAmount),
    });

    // Deduct the amount from transaction commissions, spreading across multiple transactions if needed
    let remainingAmount = numAmount;
    
    // Sort transactions by commission amount (descending)
    transactions.sort((a, b) => b.commission - a.commission);
    
    for (const transaction of transactions) {
      if (remainingAmount <= 0) break;
      
      const transactionRef = doc(db, "transactions", transaction.id);
      const amountToDeduct = Math.min(remainingAmount, transaction.commission);
      
      // Determine which field to update based on where the commission is stored
      const data = transaction.data;
      if (data.inrdeals && typeof data.inrdeals.commission === 'number') {
        await updateDoc(transactionRef, {
          "inrdeals.commission": increment(-amountToDeduct),
          "inrdeals.withdrawnCommission": increment(amountToDeduct)
        });
      } else if (typeof data.commission === 'number') {
        await updateDoc(transactionRef, {
          "commission": increment(-amountToDeduct),
          "withdrawnCommission": increment(amountToDeduct)
        });
      } else if (typeof data.inrdealsCommission === 'number') {
        await updateDoc(transactionRef, {
          "inrdealsCommission": increment(-amountToDeduct),
          "withdrawnInrdealsCommission": increment(amountToDeduct)
        });
      }
      
      remainingAmount -= amountToDeduct;
    }

    // Add notification to adminNotifications collection
    await addDoc(collection(db, "adminNotifications"), {
      message: `New INRDeals Withdrawal request from ${user.fname} ${user.lname} for amount ${numAmount}.`,
      createdAt: new Date().toISOString(),
      read: false,
    });

    // Update Redux state immediately with the new pending INRDeals cashback
    const updatedUser = {
      ...user,
      pendingInrDealsCashback: (user.pendingInrDealsCashback || 0) + numAmount,
    };
    dispatch(userExist(updatedUser));
  };

  return (
    <div className="relative">
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-2">Cashback Type</label>
          <select
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            value={cashbackType}
            onChange={(e) => setCashbackType(e.target.value)}
          >
            <option value="shops">Shops</option>
            <option value="INRDeals">INRDeals</option>
          </select>
        </div>

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
                    <span className="text-sm">{`${card.cardHolder
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