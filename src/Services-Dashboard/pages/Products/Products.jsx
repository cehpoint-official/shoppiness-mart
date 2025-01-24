import { useState } from "react";
import { IoMdMore, IoMdClose } from "react-icons/io";
import "./Products.scss";
import AddProduct from "./AddProduct";
import AddCategory from "./AddCategory";

const data = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Hair cutting service",
    price: 500,
    discount: "20%",
    createdOn: "20/05/2024",
    category: "Cosmetic",
    status: "Active",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Hair Coloring",
    price: 750,
    discount: "15%",
    createdOn: "15/05/2024",
    category: "Cosmetic",
    status: "Active",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    name: "Styling Treatment",
    price: 650,
    discount: "10%",
    createdOn: "10/05/2024",
    category: "Cosmetic",
    status: "Active",
  },
];

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState("products"); // 'products', 'addProduct', 'addCategory'

  const toggleActionMenu = (product) => {
    setSelectedProduct(selectedProduct === product ? null : product);
  };

  if (currentView === "addProduct") {
    return <AddProduct onBack={() => setCurrentView("products")} />;
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
        {data.map((product) => (
          <div
            key={product.id}
            className="relative flex justify-between border text-[18px] p-3 rounded-[15px] hover:bg-gray-100 transition-colors"
          >
            <div className="w-[100px] h-[100px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <p>{product.name}</p>
              <div className="flex gap-5">
                <p className="font-medium">${product.price}</p>
                <p className="text-green-600">{product.discount} off</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <p>Created On</p>
              <p>{product.createdOn}</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p>Category</p>
              <p>{product.category}</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p>Status</p>
              <p className="text-green-600">{product.status}</p>
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
                <button className="block w-full text-left text-blue-500 px-3 py-2 rounded-md hover:bg-blue-50">
                  Edit
                </button>
                <button className="block w-full text-left text-red-500 px-3 py-2 rounded-md hover:bg-red-50">
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
