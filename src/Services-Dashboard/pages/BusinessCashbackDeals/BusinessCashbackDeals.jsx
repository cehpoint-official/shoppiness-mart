import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { FaPlus, FaPercent, FaTag, FaGift, FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const BusinessCashbackDeals = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [cashbackAmount, setCashbackAmount] = useState('');
  const [cashbackType, setCashbackType] = useState('percentage');
  const [deals, setDeals] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shopMode, setShopMode] = useState(''); 
  const [shopBanner, setShopBanner] = useState(null);
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchDeals();
    fetchShopMode();
  }, [id]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory, products]);

  const fetchShopMode = async () => {
    try {
      const businessDocRef = doc(db, "businessDetails", id);
      const businessDocSnap = await getDoc(businessDocRef);
      
      if (businessDocSnap.exists()) {
        const businessData = businessDocSnap.data();
        setShopMode(businessData.mode || 'Offline');
        setShopBanner(businessData.bannerUrl);
        setShopName(businessData.businessName);
      } else {
        console.log("No business document found!");
        setShopMode('Offline');
      }
    } catch (error) {
      console.error("Error fetching shop mode:", error);
      setShopMode('Offline');
    }
  };

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, "productDetails"), where("businessId", "==", id));
      const querySnapshot = await getDocs(q);
      
      const productsData = [];
      const categoriesSet = new Set();
      
      querySnapshot.forEach((doc) => {
        const productData = { id: doc.id, ...doc.data() };
        productsData.push(productData);
        if (productData.category) {
          categoriesSet.add(productData.category);
        }
      });
      
      setProducts(productsData);
      setCategories(Array.from(categoriesSet));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchDeals = async () => {
    try {
      const q = query(collection(db, "cashbackDeals"), where("businessId", "==", id));
      const querySnapshot = await getDocs(q);
      
      const dealsData = [];
      
      querySnapshot.forEach((doc) => {
        dealsData.push({ id: doc.id, ...doc.data() });
      });
      
      setDeals(dealsData);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  const handleCreateDeal = async () => {
    if (!selectedProduct || !cashbackAmount) {
      alert("Please select a product and enter a cashback amount");
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedProductData = products.find(p => p.id === selectedProduct);
      
      const dealData = {
        businessId: id,
        shopName: shopName,
        shopBanner: shopBanner,
        productId: selectedProduct,
        productName: selectedProductData.name,
        productPrice: selectedProductData.price,
        productImage: selectedProductData.imageUrl,
        productCategory: selectedProductData.category,
        cashbackAmount: cashbackAmount,
        cashbackType: cashbackType,
        shopMode: shopMode,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, "cashbackDeals"), dealData);
      
      setDeals([...deals, { id: docRef.id, ...dealData }]);
      
      setSelectedCategory('');
      setSelectedProduct('');
      setCashbackAmount('');
      setShowModal(false);
    } catch (error) {
      console.error("Error creating deal:", error);
      alert("Failed to create cashback deal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initDeleteDeal = (deal) => {
    setDealToDelete(deal);
    setShowDeleteConfirm(true);
  };

  const handleDeleteDeal = async () => {
    if (!dealToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await deleteDoc(doc(db, "cashbackDeals", dealToDelete.id));
      setDeals(deals.filter(deal => deal.id !== dealToDelete.id));
      
      setShowDeleteConfirm(false);
      setDealToDelete(null);
    } catch (error) {
      console.error("Error deleting deal:", error);
      alert("Failed to delete cashback deal. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCashback = (amount, type) => {
    return type === 'percentage' ? `${amount}%` : `₹${amount}`;
  };

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Cashback Deals</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#048c7e] hover:bg-[#037c6e] text-white py-2 px-4 rounded-lg shadow transition duration-300"
        >
          <FaPlus /> Add New Deal
        </button>
      </div>

      {/* Deals grid */}
      {deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
              {/* Delete button */}
              <button 
                onClick={() => initDeleteDeal(deal)}
                className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                title="Delete Deal"
              >
                <FaTrash size={14} />
              </button>

              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {deal.productImage ? (
                  <img 
                    src={deal.productImage} 
                    alt={deal.productName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <FaTag className="text-gray-500 text-5xl" />
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-red-500 text-white font-bold py-1 px-3 rounded-br-lg">
                  {formatCashback(deal.cashbackAmount, deal.cashbackType)} Cashback
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-800 truncate">{deal.productName}</h3>
                <p className="text-gray-600 text-sm mb-2">{deal.productCategory}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-xl text-gray-800">{formatPrice(deal.productPrice)}</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <FaGift />
                    <span className="font-semibold">{formatCashback(deal.cashbackAmount, deal.cashbackType)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FaGift className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Cashback Deals Yet</h3>
          <p className="text-gray-500 mb-4">Create your first cashback deal to attract more customers.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#048c7e] hover:bg-[#037c6e] text-white py-2 px-4 rounded-lg inline-flex items-center gap-2"
          >
            <FaPlus /> Create Deal
          </button>
        </div>
      )}

      {/* Add Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Create Cashback Deal</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category
                </label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#048c7e]"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disabled={!selectedCategory}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#048c7e]"
                >
                  <option value="">Select a product</option>
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.price)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Cashback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cashback Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cashbackType"
                      value="percentage"
                      checked={cashbackType === 'percentage'}
                      onChange={() => setCashbackType('percentage')}
                      className="mr-2 text-[#048c7e] focus:ring-[#048c7e]"
                    />
                    Percentage (%)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cashbackType"
                      value="fixed"
                      checked={cashbackType === 'fixed'}
                      onChange={() => setCashbackType('fixed')}
                      className="mr-2 text-[#048c7e] focus:ring-[#048c7e]"
                    />
                    Fixed Amount (₹)
                  </label>
                </div>
              </div>
              
              {/* Cashback Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cashback Amount
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={cashbackAmount}
                    onChange={(e) => setCashbackAmount(e.target.value)}
                    placeholder={cashbackType === 'percentage' ? "e.g. 10" : "e.g. 500"}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#048c7e]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {cashbackType === 'percentage' ? <FaPercent className="text-gray-400" /> : <span className="text-gray-400">₹</span>}
                  </div>
                </div>
                {cashbackType === 'percentage' && (
                  <p className="text-sm text-gray-500 mt-1">Enter a value between 1-100</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeal}
                disabled={isLoading}
                className={`px-4 py-2 bg-[#048c7e] text-white rounded hover:bg-[#037c6e] transition-colors flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>Create Deal</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && dealToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaTrash className="text-red-500 text-xl" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Cashback Deal</h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the cashback deal for <span className="font-semibold">{dealToDelete.productName}</span>? This action cannot be undone.
              </p>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-1/2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDeal}
                  disabled={isDeleting}
                  className={`w-1/2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete Deal'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCashbackDeals;