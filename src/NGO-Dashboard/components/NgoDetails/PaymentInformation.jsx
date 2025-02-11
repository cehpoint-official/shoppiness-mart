import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import toast from "react-hot-toast";

const PaymentInformation = () => {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const { user} = useSelector(
    (state) => state.ngoUserReducer
  );

  // State for existing payments
  const [existingPayments, setExistingPayments] = useState({
    bankAccounts: [],
    cardDetails: [],
    upiDetails: [],
  });

  // Loading states
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for new payment methods
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

  // Check if any payment method exists
  const hasExistingPaymentMethod = () => {
    return (
      existingPayments.upiDetails.length > 0 ||
      existingPayments.bankAccounts.length > 0 ||
      existingPayments.cardDetails.length > 0
    );
  };

  // Handle Add Payment Method button click
  const handleAddPaymentClick = () => {
    if (hasExistingPaymentMethod()) {
      toast.error(
        "Please delete existing payment method before adding a new one"
      );
      return;
    }
    setShowPaymentMethods(!showPaymentMethods);
  };

  const updateUserPaymentDetails = async (type, details) => {
    try {
      const userDocRef = doc(db, "causeDetails", user?.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        let updatedPaymentDetails = userData.paymentDetails || {};

        // Initialize payment details object if it doesn't exist
        if (!updatedPaymentDetails[type]) {
          updatedPaymentDetails[type] = [];
        }

        // Add new payment details
        updatedPaymentDetails[type].push(details);

        // Update the user document
        await updateDoc(userDocRef, {
          paymentDetails: updatedPaymentDetails,
        });
      }
    } catch (error) {
      console.error("Error updating user payment details:", error);
      throw error;
    }
  };

  // Remove payment details from user data
  const removeUserPaymentDetails = async (type, id) => {
    try {
      const userDocRef = doc(db, "causeDetails", user?.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        let updatedPaymentDetails = userData.paymentDetails || {};

        if (updatedPaymentDetails[type]) {
          // Remove the payment detail with matching id
          updatedPaymentDetails[type] = updatedPaymentDetails[type].filter(
            (item) => item.id !== id
          );

          // Update the user document
          await updateDoc(userDocRef, {
            paymentDetails: updatedPaymentDetails,
          });
        }
      }
    } catch (error) {
      console.error("Error removing user payment details:", error);
      throw error;
    }
  };

  const saveUpiDetails = async () => {
    if (!upiId.trim() || !user?.uid) return;

    setIsSaving(true);
    try {
      const userPaymentRef = doc(db, "ngoPaymentDetails", user.uid);
      const upiRef = collection(userPaymentRef, "upiDetails");

      const docRef = await addDoc(upiRef, { upiId: upiId.trim() });
      const newUpiDetail = { id: docRef.id, upiId: upiId.trim() };

      // Update user's payment details in causeDetails
      await updateUserPaymentDetails("upiDetails", newUpiDetail);

      setExistingPayments((prev) => ({
        ...prev,
        upiDetails: [...prev.upiDetails, newUpiDetail],
      }));

      setUpiId("");
      setShowPaymentMethods(false);
      toast.success("UPI details saved successfully");
    } catch (error) {
      console.error("Error saving UPI:", error);
      toast.error("Failed to save UPI details");
    } finally {
      setIsSaving(false);
    }
  };

  // Modified saveBankDetails function
  const saveBankDetails = async () => {
    if (!bankDetails.accountNumber || !bankDetails.accountName || !user?.uid)
      return;

    setIsSaving(true);
    try {
      const userPaymentRef = doc(db, "ngoPaymentDetails", user.uid);
      const bankRef = collection(userPaymentRef, "bankAccounts");

      const docRef = await addDoc(bankRef, bankDetails);
      const newBankDetail = { id: docRef.id, ...bankDetails };

      // Update user's payment details in causeDetails
      await updateUserPaymentDetails("bankAccounts", newBankDetail);

      setExistingPayments((prev) => ({
        ...prev,
        bankAccounts: [...prev.bankAccounts, newBankDetail],
      }));

      setBankDetails({
        accountName: "",
        ifscCode: "",
        accountNumber: "",
      });
      setShowPaymentMethods(false);
      toast.success("Bank details saved successfully");
    } catch (error) {
      console.error("Error saving bank details:", error);
      toast.error("Failed to save bank details");
    } finally {
      setIsSaving(false);
    }
  };

  // Modified saveCardDetails function
  const saveCardDetails = async () => {
    if (!cardDetails.cardNumber || !cardDetails.cardHolder || !user?.uid)
      return;

    setIsSaving(true);
    try {
      const userPaymentRef = doc(db, "ngoPaymentDetails", user.uid);
      const cardRef = collection(userPaymentRef, "cardDetails");

      const docRef = await addDoc(cardRef, cardDetails);
      const newCardDetail = { id: docRef.id, ...cardDetails };

      // Update user's payment details in causeDetails
      await updateUserPaymentDetails("cardDetails", newCardDetail);

      setExistingPayments((prev) => ({
        ...prev,
        cardDetails: [...prev.cardDetails, newCardDetail],
      }));

      setCardDetails({
        cardHolder: "",
        cardNumber: "",
        validThru: "",
        cvv: "",
      });
      setShowPaymentMethods(false);
      toast.success("Card details saved successfully");
    } catch (error) {
      console.error("Error saving card details:", error);
      toast.error("Failed to save card details");
    } finally {
      setIsSaving(false);
    }
  };

  // Modified deletePaymentMethod function
  const deletePaymentMethod = async (type, id) => {
    if (!user?.uid) return;

    setIsDeleting(true);
    try {
      const userPaymentRef = doc(db, "ngoPaymentDetails", user.uid);
      await deleteDoc(doc(collection(userPaymentRef, type), id));

      // Remove payment details from user's causeDetails
      await removeUserPaymentDetails(type, id);

      setExistingPayments((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== id),
      }));

      toast.success("Payment method deleted successfully");
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Failed to delete payment method");
    } finally {
      setIsDeleting(false);
    }
  };
  // Fetch existing payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user?.uid) return;

      setIsFetching(true);
      try {
        // First check if user has payment details in causeDetails
        const userDocRef = doc(db, "causeDetails", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (!userData.paymentDetails) {
            // Initialize payment details if they don't exist
            await updateDoc(userDocRef, {
              paymentDetails: {
                upiDetails: [],
                bankAccounts: [],
                cardDetails: [],
              },
            });
          }
        }
        const userPaymentRef = doc(db, "ngoPaymentDetails", user.uid);

        // Fetch bank accounts
        const bankSnapshot = await getDocs(
          collection(userPaymentRef, "bankAccounts")
        );
        const banks = bankSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch card details
        const cardSnapshot = await getDocs(
          collection(userPaymentRef, "cardDetails")
        );
        const cards = cardSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch UPI details
        const upiSnapshot = await getDocs(
          collection(userPaymentRef, "upiDetails")
        );
        const upis = upiSnapshot.docs.map((doc) => ({
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
        toast.error("Failed to fetch payment methods");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPaymentMethods();
  }, [user?.uid]);
  const maskCardNumber = (number) => {
    return `****${number.slice(-4)}`;
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl p-4">
      {/* Notice Banner */}
      <div className="bg-[#FFB93921] p-3 mb-6 rounded">
        <p className="text-sm text-[#C5830B]">
          If supporters donate to your NGO or cause, the funds will be
          transferred to your account after deducting a 2% platform fee. Only
          one payment method is allowed at a time.
        </p>
      </div>

      {/* Existing Payment Methods */}
      {isFetching ? (
        <SkeletonLoader />
      ) : (
        <>
          {existingPayments.upiDetails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">UPI Details</h3>
              {existingPayments.upiDetails.map((upi) => (
                <div
                  key={upi.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"
                >
                  <span className="text-sm">{upi.upiId}</span>
                  <button
                    onClick={() => deletePaymentMethod("upiDetails", upi.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaTrash className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {existingPayments.bankAccounts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Bank Accounts</h3>
              {existingPayments.bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"
                >
                  <div>
                    <p className="text-sm font-medium">{bank.accountName}</p>
                    <p className="text-xs text-gray-600">
                      Acc: {bank.accountNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePaymentMethod("bankAccounts", bank.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaTrash className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {existingPayments.cardDetails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Cards</h3>
              {existingPayments.cardDetails.map((card) => (
                <div
                  key={card.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"
                >
                  <div>
                    <p className="text-sm font-medium">{card.cardHolder}</p>
                    <p className="text-xs text-gray-600">
                      {maskCardNumber(card.cardNumber)}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePaymentMethod("cardDetails", card.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaTrash className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State Message */}
          {existingPayments.upiDetails.length === 0 &&
            existingPayments.bankAccounts.length === 0 &&
            existingPayments.cardDetails.length === 0 && (
              <p className="text-sm text-gray-600">
                No payment methods have been added yet. Please add a payment
                method to get donation.
              </p>
            )}
        </>
      )}

      {/* Add New Payment Method Button - Always visible */}
      <button
        onClick={handleAddPaymentClick}
        className="bg-blue-600 mt-4 py-1 px-4 rounded flex items-center gap-2 text-white mb-6"
      >
        <FaPlus className="w-4 h-4" />
        <span>Add Payment Method</span>
      </button>

      {/* Payment Method Forms */}
      {showPaymentMethods && (
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
                    <label className="block text-sm text-gray-600 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter UPI ID"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2 border rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={saveUpiDetails}
                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm whitespace-nowrap self-end"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <FaSpinner className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "Save"
                    )}
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
                  <label className="block text-sm text-gray-600 mb-1">
                    Account Name
                  </label>
                  <input
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
                  <label className="block text-sm text-gray-600 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    value={bankDetails.ifscCode}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        ifscCode: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Account Number
                  </label>
                  <input
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
                  <button
                    onClick={saveBankDetails}
                    className="px-4 py-2 bg-orange-400 text-white rounded text-sm"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <FaSpinner className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "Save"
                    )}
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
              <span className="ml-2 text-sm">Credit/Debit Card</span>
            </label>

            {paymentMethod === "card" && (
              <div className="pl-6 space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    value={cardDetails.cardHolder}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardHolder: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value,
                      })
                    }
                    maxLength={16}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Valid Thru
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="w-20 p-2 border rounded text-sm"
                        value={cardDetails.validThru.split("/")[0] || ""}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            validThru: `${e.target.value}/${
                              cardDetails.validThru.split("/")[1] || ""
                            }`,
                          })
                        }
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
                        className="w-20 p-2 border rounded text-sm"
                        value={cardDetails.validThru.split("/")[1] || ""}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            validThru: `${
                              cardDetails.validThru.split("/")[0] || ""
                            }/${e.target.value}`,
                          })
                        }
                      >
                        <option value="">YY</option>
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() + i
                        ).map((year) => (
                          <option key={year} value={year.toString().slice(-2)}>
                            {year.toString().slice(-2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      maxLength={3}
                      className="w-24 p-2 border rounded text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={saveCardDetails}
                    className="px-4 py-2 bg-orange-400 text-white rounded text-sm"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <FaSpinner className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInformation;
