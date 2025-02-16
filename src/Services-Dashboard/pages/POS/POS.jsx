import { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon

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
      console.log("Error getting documents: ", error);
    }
  }, [id]);

  const filteredProducts = listedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
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
      console.log("Error getting documents: ", error);
    }
  }, [id]);

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
    const found = coupons.find((coupon) => coupon.code === couponCode);
    setTimeout(() => {
      setMatchedCoupon(found || null);
      setIsVerifying(false);
    }, 1000); // Simulate a delay for verification
  };

  const getOfferText = (coupon) => {
    if (coupon.productDiscount) {
      return `Name: ${coupon.fullName}, Email: ${coupon.email}, Phone No. ${coupon.phoneNumber}, will get  ${coupon.productDiscount}% Off In-Store ${coupon.productName} Purchase + ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
    }
    return `For all purchase from your shop  Name: ${coupon.fullName}, Email: ${coupon.email}, Phone No. ${coupon.phoneNumber}, will get ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
  };

  const handleGenerateInvoice = () => {
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
      ...matchedCoupon,
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
  const validateForm = useCallback(() => {
    const isCustomerInfoValid =
      customerInfo.customerName.trim() !== "" &&
      customerInfo.phoneNumber.trim() !== "" &&
      customerInfo.email.trim() !== "" &&
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
  // Update tax amount when tax percentage changes
  useEffect(() => {
    const calculatedTax = (totalPrice * taxPercentage) / 100;
    setTaxAmount(parseFloat(calculatedTax.toFixed(1)));
  }, [taxPercentage, totalPrice]);

  // Calculate grand total
  const grandTotal = totalPrice + taxAmount;
  const dueAmount = grandTotal - cashCollected;

  return (
    <div className="flex flex-col gap-6 p-10">
      <div className=" bg-white shadow-md rounded-xl p-6">
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
                {isVerifying ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Verify"
                )}
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

        <form className="space-y-4 mt-10">
          <div className="grid grid-cols-3 gap-4 text-black font-medium">
            <div className="flex flex-col gap-3">
              <span className="">Customer Name:</span>
              <input
                type="text"
                required
                name="customerName"
                value={customerInfo.customerName}
                onChange={handleCustomerInfoChange}
                className="bg-gray-50 rounded px-2 py-2"
              />
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-medium">Phone No.:</span>
              <input
                type="text"
                required
                name="phoneNumber"
                value={customerInfo.phoneNumber}
                onChange={handleCustomerInfoChange}
                className="bg-gray-50 rounded px-2 py-2"
              />
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-medium">Email:</span>
              <input
                type="text"
                name="email"
                required
                value={customerInfo.email}
                onChange={handleCustomerInfoChange}
                className="bg-gray-50 rounded px-2 py-2"
              />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-black font-medium">
              <div className="flex flex-col gap-3">
                <span className="font-medium">Biller Name:</span>
                <input
                  type="text"
                  required
                  name="billerName"
                  value={customerInfo.billerName}
                  onChange={handleCustomerInfoChange}
                  className="bg-gray-50 rounded px-2 py-2"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-medium">Billing Date:</span>
                <input
                  type="date"
                  name="billingDate"
                  value={customerInfo.billingDate}
                  onChange={handleCustomerInfoChange}
                  className="bg-gray-50 rounded px-2 py-2"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-medium">Due Date:</span>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={customerInfo.dueDate}
                  onChange={handleCustomerInfoChange}
                  className="bg-gray-50 rounded px-2 py-2"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className=" flex gap-4 bg-white shadow-md rounded-xl p-6">
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
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedProduct(null); // Clear selected product when user types
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
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
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
                  onClick={() =>
                    setProductQuantity(Math.max(1, productQuantity - 1))
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                >
                  -
                </button>
                <span className="mx-4 text-gray-700 font-medium">
                  {productQuantity}X
                </span>
                <button
                  type="button"
                  onClick={() => setProductQuantity(productQuantity + 1)}
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
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
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
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
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
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter discount"
              />
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
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
                    <td className="py-4">Rs. {product.price}</td>
                    <td className="py-4">{product.quantity}X</td>
                    <td className="py-4">{product.discount}%</td>
                    <td className="py-4">Rs. {product.subtotal}</td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
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
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Total Items</p>
                <p className="text-2xl font-semibold">{totalItems}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Total Price:</p>
                <p className="text-2xl font-semibold">
                  Rs. {totalPrice.toFixed(1)}
                </p>
              </div>
              <div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-gray-600">TAX:%</p>
                  <input
                    type="number"
                    value={taxPercentage}
                    onChange={(e) =>
                      setTaxPercentage(parseFloat(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-600">Cash collected:</p>
                  <input
                    type="number"
                    value={cashCollected}
                    onChange={(e) =>
                      setCashCollected(parseFloat(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-semibold">Grand Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rs. {grandTotal.toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-semibold">Due Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {dueAmount.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Generate Invoice Button */}
          <button
            onClick={handleGenerateInvoice}
            disabled={!isFormValid}
            className={`w-full mt-6 py-4 rounded-lg transition-colors ${
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
