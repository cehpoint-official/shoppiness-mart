// Products.jsx
import { useCallback, useEffect, useState } from "react";
import { IoMdMore, IoMdClose } from "react-icons/io";
import "./Products.scss";
import AddProduct from "./AddProduct";
import AddCategory from "./AddCategory";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";
import EditProductDialog from "../../components/Product/EditProductDialog";
import toast from "react-hot-toast";

const ProductSkeleton = () => {
  return (
    <div className="product-skeleton animate-pulse">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );
};

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        if (productData.businessId === id) {
          data.push({ id: doc.id, ...productData });
        }
      });
      setProducts(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleActionMenu = (product) => {
    setSelectedProduct(selectedProduct === product ? null : product);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async (updatedData) => {
    try {
      await setDoc(doc(db, "productDetails", productToEdit.id), updatedData, {
        merge: true,
      });
      toast.success("Product updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error("Failed to update product.");
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      await deleteDoc(doc(db, "productDetails", productId));
      toast.success("Product deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error("Failed to delete product: " + error.message);
    }
  };

  if (currentView === "addProduct") {
    return (
      <AddProduct
        onBack={() => setCurrentView("products")}
        onProductAdded={fetchData}
      />
    );
  }

  if (currentView === "addCategory") {
    return <AddCategory onBack={() => setCurrentView("products")} />;
  }

  return (
    <div className="products">
      <div className="top-section">
        <div className="title">Add Product/Service</div>
        <div className="buttons">
          <button
            className="category-btn"
            onClick={() => setCurrentView("addCategory")}
          >
            +Add Category
          </button>
          <button
            className="product-btn"
            onClick={() => setCurrentView("addProduct")}
          >
            +Add New
          </button>
        </div>
      </div>

      <div className="bottom-section">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : products.length === 0 ? (
          <div className="no-products">No products listed yet.</div>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <span>Image</span>
              <span>Name & Price</span>
              <span>Category</span>
              <span>Date</span>
              <span>Action</span>
            </div>
            {products.map((product, index) => (
              <div key={index} className="table-row">
                <div className="sec-1">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="sec-2">
                  <p className="product-name">{product.name}</p>
                  <div className="price-sec">
                    <p>₹{product.price}</p>
                    <p className="discount">
                      {product.discountType === "percentage"
                        ? `${product.discount}% off`
                        : `₹${product.discount} off`}
                    </p>
                  </div>
                </div>
                <div className="sec-3">
                  <span className="label">Category:</span>
                  <p>{product.category}</p>
                </div>
                <div className="sec-4">
                  <span className="label">Created:</span>
                  <p>{product.createdDate}</p>
                </div>
                <div className="sec-5">
                  <button
                    className="more"
                    onClick={() => toggleActionMenu(product)}
                  >
                    <IoMdMore />
                  </button>
                  {selectedProduct === product && (
                    <div className="action-menu">
                      <button
                        className="close-btn"
                        onClick={() => setSelectedProduct(null)}
                      >
                        <IoMdClose />
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditDialogOpen && (
        <EditProductDialog
          productData={productToEdit}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default Products;