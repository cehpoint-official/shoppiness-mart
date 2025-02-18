import { collection, getDocs, query, where } from "firebase/firestore";
import  { useCallback, useEffect, useState, useMemo } from "react";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";
import InvoiceUpdate from "./InvoiceUpdate";

const UpdatePos = ({ invoiceDetails, onBack, onUpdate }) => {
  const { id } = useParams();
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [matchedCoupon, setMatchedCoupon] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generateInvoice, setGenerateInvoice] = useState(null);

  // Initialize state with validated data
  const [customerInfo] = useState({
    customerName: invoiceDetails?.customerName || "",
    phoneNumber: invoiceDetails?.customerPhoneNumber || "",
    email: invoiceDetails?.customerEmail || "",
    billerName: invoiceDetails?.billerName || "",
    billingDate: invoiceDetails?.billingDate || "",
    dueDate: invoiceDetails?.dueDate || "",
  });

  // Validate and initialize products
  const [products] = useState(
    Array.isArray(invoiceDetails?.products) ? invoiceDetails.products : []
  );

  // Initialize with validated numbers, rounded to 1 decimal place
  const taxPercentage = useMemo(() => {
    const tax = parseFloat(invoiceDetails?.taxRate);
    return isNaN(tax) ? 0 : Number(tax.toFixed(1));
  }, [invoiceDetails?.taxRate]);

  const cashCollected = useMemo(() => {
    const cash = parseFloat(invoiceDetails?.paidAmount);
    return isNaN(cash) ? 0 : Number(cash.toFixed(1));
  }, [invoiceDetails?.paidAmount]);

  // Helper function to round numbers to 1 decimal place
  const roundToOneDecimal = (num) => {
    return Number(parseFloat(num).toFixed(1));
  };

  // Memoize calculations with one decimal place
  const { totalItems, totalPrice, taxAmount, grandTotal, dueAmount } =
    useMemo(() => {
      const totalItems = products.length;

      // Calculate total price with validated subtotals
      const totalPrice = roundToOneDecimal(
        products.reduce((sum, product) => {
          const subtotal = parseFloat(product.subtotal);
          return sum + (isNaN(subtotal) ? 0 : subtotal);
        }, 0)
      );

      // Calculate tax amount rounded to one decimal
      const taxAmount = roundToOneDecimal((totalPrice * taxPercentage) / 100);

      // Calculate grand total rounded to one decimal
      const grandTotal = roundToOneDecimal(totalPrice + taxAmount);

      // Calculate due amount rounded to one decimal
      const dueAmount = roundToOneDecimal(grandTotal - cashCollected);

      return {
        totalItems,
        totalPrice,
        taxAmount,
        grandTotal,
        dueAmount,
      };
    }, [products, taxPercentage, cashCollected]);

  // Rest of the component logic...
  const fetchCoupons = useCallback(async () => {
    if (!id) return;

    try {
      const couponQuery = query(
        collection(db, "coupons"),
        where("businessId", "==", id),
        where("status", "==", "Pending")
      );

      const querySnapshot = await getDocs(couponQuery);
      const couponsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCoupons(couponsData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleVerify = useCallback(async () => {
    if (!couponCode.trim()) return;

    setIsVerifying(true);
    try {
      const matchedCoupon = coupons.find(
        (coupon) => coupon.code?.toLowerCase() === couponCode.toLowerCase()
      );
      setMatchedCoupon(matchedCoupon || null);
    } catch (error) {
      console.error("Error verifying coupon:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [couponCode, coupons]);

  const getOfferText = useCallback((coupon) => {
    if (!coupon) return "";

    const baseText = `Name: ${coupon.fullName || ""}, Email: ${
      coupon.email || ""
    }, Phone No. ${coupon.phoneNumber || ""}`;

    if (coupon.productDiscount) {
      return `${baseText}, will get ${roundToOneDecimal(
        coupon.productDiscount
      )}% Off In-Store ${coupon.productName} Purchase + ${roundToOneDecimal(
        coupon.userCashback
      )}% Cashback at Shoppiness Mart!`;
    }

    return `For all purchase from your shop ${baseText}, will get ${roundToOneDecimal(
      coupon.userCashback
    )}% Cashback at Shoppiness Mart!`;
  }, []);

  const handleGenerateInvoice = useCallback(() => {
    if (!invoiceDetails?.id) return;

    const invoiceData = {
      ...customerInfo,
      ...invoiceDetails,
      updateTime: new Date().toLocaleTimeString(),
      ...(matchedCoupon || {}),
      businessId: id,
      docId: invoiceDetails.id,
      totalPrice,
      taxAmount,
      grandTotal,
      dueAmount,
    };
    setGenerateInvoice(invoiceData);
  }, [
    customerInfo,
    invoiceDetails,
    matchedCoupon,
    id,
    totalPrice,
    taxAmount,
    grandTotal,
    dueAmount,
  ]);

  const handleBackToInvoices = useCallback(() => {
    setGenerateInvoice(null);
  }, []);

  if (generateInvoice) {
    return (
      <InvoiceUpdate
        updatedData={generateInvoice}
        updateTable={onUpdate}
        back={handleBackToInvoices}
      />
    );
  }
  return (
    <div className="flex flex-col gap-6 p-10">
      <button
        onClick={onBack}
        className="text-lg flex items-center gap-2"
        aria-label="Go back"
      >
        ← Back
      </button>
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between">
          <div className="w-[550px]">
            <h2 className="text-md mb-2">Verify coupon</h2>
            <div className="relative w-full">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full border border-black rounded-md shadow-sm py-2 pl-2 pr-20"
                placeholder="Enter coupon code"
              />
              <button
                onClick={handleVerify}
                className="absolute inset-y-0 right-0 px-4 text-blue-500 hover:text-blue-700"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
          <div className="bg-[#00639A26] text-[#0E2744] w-1/2 p-4">
            {matchedCoupon ? (
              <p>{getOfferText(matchedCoupon)}</p>
            ) : (
              <p>
                {isVerifying
                  ? "Verifying..."
                  : "No coupon details to display. Please verify a valid coupon code."}
              </p>
            )}
          </div>
        </div>

        {/* Customer Info Form (Disabled) */}
        <form className="space-y-4 mt-10">
          <div className="grid grid-cols-3 gap-4 text-black font-medium">
            <div className="flex flex-col gap-3">
              <span>Customer Name:</span>
              <input
                type="text"
                value={customerInfo.customerName}
                disabled
                className="bg-gray-50 rounded px-2 py-2"
              />
            </div>
            <div className="flex flex-col gap-3">
              <span>Phone No.:</span>
              <input
                type="text"
                value={customerInfo.phoneNumber}
                disabled
                className="bg-gray-50 rounded px-2 py-2"
              />
            </div>
            <div className="flex flex-col gap-3">
              <span>Email:</span>
              <input
                type="text"
                value={customerInfo.email}
                disabled
                className="bg-gray-50 rounded px-2 py-2"
              />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-black font-medium">
              <div className="flex flex-col gap-3">
                <span>Biller Name:</span>
                <input
                  type="text"
                  value={customerInfo.billerName}
                  disabled
                  className="bg-gray-50 rounded px-2 py-2"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span>Billing Date:</span>
                <input
                  type="date"
                  value={customerInfo.billingDate}
                  disabled
                  className="bg-gray-50 rounded px-2 py-2"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span>Due Date:</span>
                <input
                  type="date"
                  value={customerInfo.dueDate}
                  disabled
                  className="bg-gray-50 rounded px-2 py-2"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Selected Products Table */}
      <div className="flex gap-4 bg-white shadow-md rounded-xl p-6">
        <div className="bg-gray-50 w-[500px] p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold mb-4">Add Product</h2>
          <form>
            <div className="relative mb-4">
              <label
                htmlFor="productName"
                className="block text-gray-700 font-medium mb-2"
              >
                Product Name*
              </label>
              <input
                type="text"
                id="productName"
                disabled
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search product name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-gray-700 font-medium mb-2"
              >
                Quantity*
              </label>
              <div className="mb-4 w-full flex justify-between bg-white items-center">
                <button
                  type="button"
                  disabled
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                >
                  -
                </button>
                <span className="mx-4 text-gray-700 font-medium">
                  {products.length}X
                </span>
                <button
                  type="button"
                  disabled
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
                disabled
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
                disabled
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
                disabled
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter discount"
              />
            </div>
            <button
              type="button"
              disabled
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Add
            </button>
          </form>
        </div>
        <div className="max-w-5xl mx-auto p-6 bg-white">
          <h1 className="text-xl font-bold mb-6">SELECTED PRODUCTS</h1>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 font-semibold">PRODUCT</th>
                  <th className="text-left py-4 font-semibold">PRICE</th>
                  <th className="text-left py-4 font-semibold">QUANTITY</th>
                  <th className="text-left py-4 font-semibold">DISCOUNT</th>
                  <th className="text-left py-4 font-semibold">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-4">{product.name}</td>
                    <td className="py-4">Rs. {product.price}</td>
                    <td className="py-4">{product.quantity}X</td>
                    <td className="py-4">{product.discount}%</td>
                    <td className="py-4">Rs. {product.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Total Items</p>
                <p className="text-xl font-semibold">{totalItems}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Total Price:</p>
                <p className="text-xl font-semibold">Rs. {totalPrice}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Tax:</p>
                <p className="text-xl font-semibold">Rs. {taxAmount}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Cash Collected:</p>
                <p className="text-xl font-semibold">Rs. {cashCollected}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Grand Total:</p>
                <p className="text-xl font-semibold">Rs. {grandTotal}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Due Amount:</p>
                <p className="text-xl font-semibold">Rs. {dueAmount}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateInvoice}
            className={`w-full mt-6 py-4 rounded-lg transition-colors ${"bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePos;
