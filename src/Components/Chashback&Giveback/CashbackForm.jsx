import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
const CashbackForm = () => {
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
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [couponCode, setCouponCode] = useState(""); // New state for coupon code
  const [uploadedPdf, setUploadedPdf] = useState(null); // New state for uploaded PDF
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.status === "Active" && shopData.mode === "Online") {
          data.push({ shopId: doc.id, ...shopData });
        }
      });
      setShops(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
  };

  const handlePaidAmountChange = (e) => {
    setPaidAmount(e.target.value);
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedPdf(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const uploadPdf = async (file) => {
    const metadata = {
      contentType: "application/pdf",
    };
    const storageRef = ref(storage, `online-receipts/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Failed to get download URL:", error);
            // Delete the uploaded file if we can't get its URL
            try {
              await deleteObject(storageRef);
            } catch (deleteError) {
              console.error("Failed to delete incomplete upload:", deleteError);
            }
            reject(error);
          }
        }
      );
    });
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
    setIsLoading(true);
    try {
      // Upload PDF to Firebase Storage
      const pdfUrl = await uploadPdf(uploadedPdf);

      // Find the selected shop details
      const selectedShopDetails = shops.find(
        (shop) => shop.businessName === selectedShop
      );

      const formData = {
        shopId: selectedShopDetails.shopId,
        shopName: selectedShopDetails.businessName,
        shopEmail: selectedShopDetails.email,
        shopPhone: selectedShopDetails.mobileNumber,
        shopOwnerName: selectedShopDetails.owner,
        paidAmount,
        selectedPayment,
        couponCode,
        invoiceName: uploadedPdf?.name,
        invoiceUrl: pdfUrl,
        userName: user.fname + " " + user.lname,
        userEmail: user.email,
        status: "New",
        requestedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
      console.log(formData);

      await addDoc(collection(db, "onlineCashbackRequests"), formData);
      toast.success("Dispute request submitted successfully!");
      // Reset form fields
      setSelectedShop("");
      setPaidAmount("");
      setCouponCode("");
      setUploadedPdf(null);
    } catch (error) {
      console.error("Error submitting dispute request:", error);
      toast.error("Failed to submit dispute request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Disclaimer */}
      <p className="text-sm text-yellow-800 bg-yellow-100 p-3 rounded-md border border-yellow-400 font-semibold mb-2">
        ⚠️ <strong>Important:</strong>
        {/* <p>
          1. If you have received a bill or invoice but have not received the
          cashback in your wallet, please upload the invoice along with the shop
          name and the paid amount for verification.
        </p> */}
        <p>
          For online purchases, follow these steps before clicking the
          &quot;Claim Cashback&quot; button to ensure a successful cashback
          request:
        </p>
        <p>1. Select the shop from which you redeemed the coupon.</p>
        <p>2. Enter the total bill amount.</p>
        <p>
          3. Go to the &quot;My Coupons&quot; section, copy the coupon code, and
          enter it in the required field.
        </p>
        <p>4. Upload the invoice as proof of purchase.</p>
      </p>

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

        <div>
          <label className="block text-sm mb-2">Coupon Code</label>
          <input
            type="text"
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            value={couponCode}
            onChange={handleCouponCodeChange}
            required
            placeholder="Enter coupon code"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Upload PDF</label>
          <input
            required
            type="file"
            accept="application/pdf"
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            onChange={handlePdfUpload}
          />
          {uploadedPdf && (
            <p className="text-sm text-gray-600 mt-1">
              Uploaded PDF: {uploadedPdf.name}
            </p>
          )}
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
          className="w-full bg-blue-700 flex justify-center text-white rounded py-2 text-md mt-6"
          disabled={isLoading}
        >
          {" "}
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            "Claim Cashback"
          )}
        </button>
      </form>
    </div>
  );
};

export default CashbackForm;
