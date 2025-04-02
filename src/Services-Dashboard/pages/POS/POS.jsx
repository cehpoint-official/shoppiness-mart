import { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

const POS = ({ onGenerateInvoice }) => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [matchedCoupon, setMatchedCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [listedProducts, setListedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const { id } = useParams();

  // Tax and Cash Collected State
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [cashCollected, setCashCollected] = useState(0);

  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    billerName: "",
    billingDate: "",
    dueDate: "",
  });

  // Spinner state for coupon verification
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle customer info form changes
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (couponsData.businessId === id && couponsData.status === "Pending") {
          data.push({ id: doc.id, ...couponsData });
        }
      });
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to fetch coupons. Please try again.");
    }
  }, [id]);

  const fetchProductData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        if (productData.businessId === id) {
          data.push({ id: doc.id, ...productData });
        }
      });
      setListedProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    }
  }, [id]);

  const filteredProducts = listedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  useEffect(() => {
    fetchData();
    fetchProductData();
  }, [fetchData, fetchProductData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".relative") === null) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const found = coupons.find((coupon) => coupon.code === couponCode);
      if (!found) {
        toast.error("Invalid coupon code");
        setMatchedCoupon(null);
        return;
      }
      setMatchedCoupon(found);
    } catch (error) {
      console.error("Error verifying coupon:", error);
      toast.error("Failed to verify coupon. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const getOfferText = (coupon) => {
    if (coupon.productDiscount) {
      return `Name: ${coupon.fullName}, Email: ${coupon.email}, Phone No. ${coupon.phoneNumber}, will get  ${coupon.productDiscount}% Off In-Store ${coupon.productName} Purchase + ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
    }
    return `For all purchase from your shop  Name: ${coupon.fullName}, Email: ${coupon.email}, Phone No. ${coupon.phoneNumber}, will get ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
  };

  const handleGenerateInvoice = () => {
    if (!isFormValid) {
      toast.error("Please fill all required fields and ensure data is valid.");
      return;
    }

    const invoiceData = {
      ...customerInfo,
      products: products,
      totalItems,
      totalPrice: totalPrice.toFixed(1),
      grandTotal: grandTotal.toFixed(1),
      taxAmount: taxAmount.toFixed(1),
      cashCollected: cashCollected.toFixed(1),
      dueAmount: dueAmount.toFixed(1),
      time: new Date().toLocaleTimeString(),
      invoiceId: `IN-${Math.floor(Math.random() * 100000)}`,
      couponCode: matchedCoupon?.code || "",
      userCashback: matchedCoupon?.userCashback || 0,
      platformEarnings: matchedCoupon?.platformEarnings || 0,
      customerId: matchedCoupon?.userId || "",
      couponId: matchedCoupon?.id || "",
      businessId: id,
    };

    onGenerateInvoice(invoiceData);
  };

  const handleProductSelect = (product) => {
    setProductName(product.name);
    setSearchTerm(product.name);
    setProductPrice(product.price.toString());
    setDiscountType(product.discountType || "percentage");
    setDiscountValue(product.discount?.toString() || "0");
    setSelectedProduct(product);
    setIsDropdownOpen(false);
  };

  const handleAddProduct = () => {
    const price = parseFloat(productPrice);
    const quantity = productQuantity;
    const discount = parseFloat(discountValue) || 0;

    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid product price.");
      return;
    }
    if (isNaN(quantity)) {
      toast.error("Please enter a valid quantity.");
      return;
    }
    if (isNaN(discount)) {
      toast.error("Please enter a valid discount.");
      return;
    }

    let subtotal = price * quantity;
    if (discountType === "percentage") {
      subtotal -= (subtotal * discount) / 100;
    } else {
      subtotal -= discount;
    }

    const newProduct = {
      id: products.length + 1,
      name: productName,
      price: price.toFixed(1),
      quantity: quantity,
      discount: discount.toFixed(1),
      discountType: discountType,
      subtotal: subtotal.toFixed(1),
    };

    setProducts([...products, newProduct]);

    // Reset form fields and selected product
    setProductName("");
    setSearchTerm("");
    setProductPrice("");
    setProductQuantity(1);
    setDiscountType("percent");
    setDiscountValue("");
    setSelectedProduct(null);
  };

  // Calculate totals
  const totalItems = products.length;
  const totalPrice = products.reduce(
    (sum, product) => sum + parseFloat(product.subtotal),
    0
  );

  // FIX: Calculate tax amount when either totalPrice or taxPercentage changes
  useEffect(() => {
    const calculatedTaxAmount = (totalPrice * taxPercentage) / 100;
    setTaxAmount(calculatedTaxAmount);
  }, [totalPrice, taxPercentage]);

  const validateForm = useCallback(() => {
    const isCustomerInfoValid =
      customerInfo.customerName.trim() !== "" &&
      /^\d{10}$/.test(customerInfo.phoneNumber) &&
      /\S+@\S+\.\S+/.test(customerInfo.email) &&
      customerInfo.billerName.trim() !== "" &&
      customerInfo.billingDate !== "" &&
      customerInfo.dueDate !== "";

    const isProductsValid = products.length > 0;

    const isCashValid = !isNaN(cashCollected) && cashCollected >= 0;

    const isTaxValid = !isNaN(taxPercentage) && taxPercentage >= 0;

    setIsFormValid(
      isCustomerInfoValid && isProductsValid && isCashValid && isTaxValid
    );
  }, [customerInfo, products, cashCollected, taxPercentage]);

  // Run validation whenever relevant fields change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Calculate grand total
  const grandTotal = totalPrice + taxAmount;
  const dueAmount = grandTotal - cashCollected;

  // FIX: Handle tax percentage input field
  const handleTaxPercentageChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setTaxPercentage(0);
    } else {
      setTaxPercentage(parseFloat(value));
    }
  };

  // FIX: Handle cash collected input field
  const handleCashCollectedChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setCashCollected(0);
    } else {
      setCashCollected(parseFloat(value));
    }
  };
  //console.log(matchedCoupon);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-10 min-h-screen">
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 w-full">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-[550px]">
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
                {isVerifying ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
          <div className="bg-[#00639A26] text-[#0E2744] w-full md:w-1/2 p-4">
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

        <form className="space-y-4 mt-6 sm:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black font-medium">
            <div className="flex flex-col gap-3">
              <span>Customer Name:</span>
              <input
                type="text"
                required
                name="customerName"
                value={customerInfo.customerName}
                onChange={handleCustomerInfoChange}
                className="bg-gray-50 rounded px-2 py-2 w-full"
              />
            </div>
            <div className="flex flex-col gap-3">
              <span>Phone No.:</span>
              <input
                type="text"
                required
                name="phoneNumber"
                value={customerInfo.phoneNumber}
                onChange={handleCustomerInfoChange}
                className="bg-gray-50 rounded px-2 py-2 w-full"
              />
            </div>
            <div className="flex flex-col gap-3">
              <span>Email:</span>
              <input
                type="text"
                name="email"
                required
                value={customerInfo.email}
                onChange={handleCustomerInfoChange}
                className="bg-gray-50 rounded px-2 py-2 w-full"
              />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black font-medium">
              <div className="flex flex-col gap-3">
                <span>Biller Name:</span>
                <input
                  type="text"
                  required
                  name="billerName"
                  value={customerInfo.billerName}
                  onChange={handleCustomerInfoChange}
                  className="bg-gray-50 rounded px-2 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span>Billing Date:</span>
                <input
                  type="date"
                  name="billingDate"
                  value={customerInfo.billingDate}
                  onChange={handleCustomerInfoChange}
                  className="bg-gray-50 rounded px-2 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span>Due Date:</span>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={customerInfo.dueDate}
                  onChange={handleCustomerInfoChange}
                  className="bg-gray-50 rounded px-2 py-2 w-full"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 bg-white shadow-md rounded-xl p-4 sm:p-6">
        <div className="bg-gray-50 w-full lg:w-[500px] p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Add Product</h2>
          <form className="space-y-4">
            <div className="relative">
              <label
                htmlFor="productName"
                className="block text-gray-700 font-medium mb-2"
              >
                Product Name*
              </label>
              <input
                type="text"
                id="productName"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedProduct(null);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search product name"
              />
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-gray-700 font-medium mb-2"
              >
                Quantity*
              </label>
              <div className="flex items-center justify-between bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setProductQuantity(Math.max(1, productQuantity - 1))
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 sm:px-4 rounded-md"
                >
                  -
                </button>
                <span className="mx-2 sm:mx-4 text-gray-700 font-medium">
                  {productQuantity}X
                </span>
                <button
                  type="button"
                  onClick={() => setProductQuantity(productQuantity + 1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 sm:px-4 rounded-md"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="discountType"
                className="block text-gray-700 font-medium mb-2"
              >
                Price*
              </label>
              <input
                type="number"
                id="price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product price"
              />
            </div>
            <div>
              <label
                htmlFor="discountType"
                className="block text-gray-700 font-medium mb-2"
              >
                Discount Type*
              </label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percent">Percentage</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="discount"
                className="block text-gray-700 font-medium mb-2"
              >
                Discount*
              </label>
              <input
                type="number"
                id="discount"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter discount"
              />
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Add
            </button>
          </form>
        </div>

        <div className="w-full p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
            SELECTED PRODUCTS
          </h1>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 sm:py-4 font-semibold">
                    PRODUCT
                  </th>
                  <th className="text-left py-2 sm:py-4 font-semibold">
                    PRICE
                  </th>
                  <th className="text-left py-2 sm:py-4 font-semibold">QTY</th>
                  <th className="text-left py-2 sm:py-4 font-semibold">DISC</th>
                  <th className="text-left py-2 sm:py-4 font-semibold">
                    SUBTOTAL
                  </th>
                  <th className="text-left py-2 sm:py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2 sm:py-4">{product.name}</td>
                    <td className="py-2 sm:py-4">Rs. {product.price}</td>
                    <td className="py-2 sm:py-4">{product.quantity}X</td>
                    <td className="py-2 sm:py-4">{product.discount}%</td>
                    <td className="py-2 sm:py-4">Rs. {product.subtotal}</td>
                    <td className="py-2 sm:py-4">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RxCross2 size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 sm:mt-8 bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-6">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">
                  Total Items
                </p>
                <p className="text-lg sm:text-2xl font-semibold">
                  {totalItems}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">
                  Total Price
                </p>
                <p className="text-lg sm:text-2xl font-semibold">
                  Rs. {totalPrice.toFixed(1)}
                </p>
              </div>
              <div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-gray-600 text-sm sm:text-base">TAX:%</p>
                  <input
                    type="number"
                    value={
                      taxPercentage === 0 &&
                      document.activeElement ===
                        document.getElementById("tax-input")
                        ? ""
                        : taxPercentage
                    }
                    id="tax-input"
                    onChange={handleTaxPercentageChange}
                    onFocus={(e) => e.target.value === "0" && e.target.select()}
                    className="w-full border border-gray-300 rounded-md py-1 sm:py-2 px-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Cash collected
                  </p>
                  <input
                    type="number"
                    value={
                      cashCollected === 0 &&
                      document.activeElement ===
                        document.getElementById("cash-input")
                        ? ""
                        : cashCollected
                    }
                    id="cash-input"
                    onChange={handleCashCollectedChange}
                    onFocus={(e) => e.target.value === "0" && e.target.select()}
                    className="w-full border border-gray-300 rounded-md py-1 sm:py-2 px-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm sm:text-lg font-semibold">Grand Total</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  Rs. {grandTotal.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm sm:text-lg font-semibold">Due Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">
                  Rs. {dueAmount.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateInvoice}
            disabled={!isFormValid}
            className={`w-full mt-4 sm:mt-6 py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
