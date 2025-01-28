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
import EditProductDialog from "../../components/Product/EditProductDialog"; // Import the EditProductDialog
import toast from "react-hot-toast";

// Skeleton Component
const ProductSkeleton = () => {
  return (
    <div className="relative flex justify-between border text-[18px] p-3 rounded-[15px] animate-pulse">
      <div className="w-[100px] h-[100px] bg-gray-200 rounded-[10px]"></div>
      <div className="flex flex-col gap-2.5">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="flex gap-5">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex flex-col gap-2.5 items-center">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="w-[35px] h-[35px] bg-gray-200 rounded-full"></div>
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

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      fetchData(); // Refresh the product list
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
      fetchData(); // Refresh the product list
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error("Failed to delete product: " + error.message);
    }
  };

  if (currentView === "addProduct") {
    return <AddProduct onBack={() => setCurrentView("products")} onProductAdded={fetchData}/>;
  }

  if (currentView === "addCategory") {
    return <AddCategory onBack={() => setCurrentView("products")} />;
  }

  return (
    <div className="p-10 mt-[30px] flex flex-col gap-[30px]">
      <div className="flex justify-between">
        <div className="text-[22px]">Add product/Service</div>
        <div className="flex gap-5">
          <button
            className="bg-green-600 rounded-md text-white px-5 py-2 min-w-[170px]"
            onClick={() => setCurrentView("addCategory")}
          >
            +Add Category
          </button>
          <button
            className="bg-blue-600 rounded-md text-white px-5 py-2 min-w-[170px]"
            onClick={() => setCurrentView("addProduct")}
          >
            +Add New
          </button>
        </div>
      </div>
      <div className="max-h-[500px] overflow-auto p-5 bg-white rounded-[20px] flex flex-col gap-10 scrollbar-hide">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : products.map((product, index) => (
              <div
                key={index}
                className="relative flex justify-between border text-[18px] p-3 rounded-[15px] hover:bg-gray-100 transition-colors"
              >
                <div className="w-[100px] h-[100px]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <p>{product.name}</p>
                  <div className="flex gap-5">
                    <p className="font-medium">₹{product.price}</p>
                    <p className="text-green-600">{product.discount}% off</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <p>Category</p>
                  <p>{product.category}</p>
                </div>

                <div className="flex flex-col gap-2.5 items-center">
                  <p>Action</p>
                  <button
                    className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-black/5 cursor-pointer hover:bg-black/10"
                    onClick={() => toggleActionMenu(product)}
                  >
                    <IoMdMore className="text-[27px]" />
                  </button>
                </div>
                {selectedProduct === product && (
                  <div className="absolute w-[200px] top-1 right-0 mt-2 bg-white shadow-md rounded-md p-3 z-10">
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <IoMdClose className="text-[24px]" />
                      </button>
                    </div>
                    <button
                      className="block w-full text-left text-blue-500 px-3 py-2 rounded-md hover:bg-blue-50"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="block w-full text-left text-red-500 px-3 py-2 rounded-md hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
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
