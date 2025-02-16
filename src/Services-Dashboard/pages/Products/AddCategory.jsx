import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const CategoryModal = ({ isOpen, onClose, editingCategory = null, onSave }) => {
  const [categoryName, setCategoryName] = useState(editingCategory?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
    } else {
      setCategoryName("");
    }
  }, [editingCategory]);

  useEffect(() => {
    if (!isOpen) {
      setCategoryName(""); // Reset categoryName when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!categoryName.trim()) {
        toast.error("Please enter a category name");
        return;
      }

      if (editingCategory) {
        const categoryRef = doc(db, "categories", editingCategory.id);
        await updateDoc(categoryRef, {
          name: categoryName,
        });
        toast.success("Category updated successfully!");
        onSave({ id: editingCategory.id, name: categoryName, businessId: id });
      } else {
        const docRef = await addDoc(collection(db, "categories"), {
          name: categoryName,
          businessId: id,
        });
        toast.success("Category added successfully!");
        onSave({ id: docRef.id, name: categoryName, businessId: id });
      }

      setCategoryName(""); // Reset categoryName after successful save
      onClose();
    } catch (error) {
      toast.error(
        `Failed to ${editingCategory ? "update" : "add"} category: ${
          error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">
              {editingCategory ? "Update Category" : "Add a new Category"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <IoMdClose size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full border rounded-md p-2 mb-6"
              disabled={isSubmitting}
              autoFocus
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  {editingCategory ? "UPDATING..." : "SAVING..."}
                </>
              ) : (
                "SAVE"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <tr className="border animate-pulse">
    <td className="py-4 px-4">
      <div className="h-4 w-4 bg-gray-200 rounded" />
    </td>
    <td className="py-4 px-4">
      <div className="h-4 w-48 bg-gray-200 rounded" />
    </td>
    <td className="py-4 px-4">
      <div className="flex gap-2">
        <div className="h-5 w-5 bg-gray-200 rounded" />
        <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>
    </td>
  </tr>
);

const AddCategory = ({ onBack }) => {
  const [categories, setCategories] = useState([]);
  const [entriesCount, setEntriesCount] = useState("10");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "categories"));

      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.businessId === id) {
          data.push({ id: doc.id, ...doc.data() });
        }
      });
      setCategories(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: categoryData.name }
            : category
        )
      );
    } else {
      setCategories((prevCategories) => [...prevCategories, categoryData]);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (docId) => {
    try {
      await deleteDoc(doc(db, "categories", docId));
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== docId)
      );
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category: " + error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Calculate number of skeletons to show based on entries count
  const skeletonCount = Math.min(
    parseInt(entriesCount),
    categories.length || parseInt(entriesCount)
  );

  return (
    <div className="p-10 mt-[30px] flex flex-col gap-[30px]">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-2xl hover:text-gray-700"
        >
          ← Back
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          +Add Category
        </button>
      </div>

      <div className="bg-white rounded-[20px] p-8">
        <div className="flex items-center gap-2 mb-6">
          <span>Show</span>
          <select
            value={entriesCount}
            onChange={(e) => setEntriesCount(e.target.value)}
            className="border rounded px-2 py-1 w-[70px]"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium"># ↕</th>
                <th className="text-left py-4 px-4 font-medium">
                  Category name
                </th>
                <th className="text-left py-4 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: skeletonCount }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No categories have been added yet.
                  </td>
                </tr>
              ) : (
                categories
                  .slice(0, parseInt(entriesCount))
                  .map((category, index) => (
                    <tr key={category.id} className="border hover:bg-gray-50">
                      <td className="py-4 px-4">{index + 1}.</td>
                      <td className="py-4 px-4">{category.name}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(category)}
                          >
                            <FiEdit size={20} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(category.id)}
                          >
                            <RiDeleteBinLine size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingCategory={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AddCategory;
