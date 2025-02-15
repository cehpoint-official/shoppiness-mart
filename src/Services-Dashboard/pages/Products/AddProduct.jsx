import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { db, storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { FaImage, FaSpinner } from "react-icons/fa"; // Import icons from react-icons

const AddProduct = ({ onBack, onProductAdded }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    discountType: "",
    discount: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // State for image upload loading

  // Validate file format
  const validateFileFormat = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedFormats.includes(file.type)) {
      toast.error("Only .png, .jpeg, and .jpg formats are allowed.");
      return false;
    }
    return true;
  };
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));

      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.businessId === id) {
          data.push({ ...doc.data() });
        }
      });
      setCategories(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file format
    if (!validateFileFormat(file)) {
      return;
    }

    setIsUploading(true); // Start loading
    setImage(file);

    try {
      await uploadFile(file); // Upload the file
    } catch (error) {
      toast.error("Failed to upload image: " + error.message);
      setImage(null); // Reset image on error
    } finally {
      setIsUploading(false); // Stop loading
    }
  };

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const metadata = {
        contentType: file.type, // Use the file's MIME type
      };
      const storageRef = ref(storage, "products/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              reject("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              reject("User canceled the upload");
              break;
            case "storage/unknown":
              reject("Unknown error occurred, inspect error.serverResponse");
              break;
            default:
              reject("An error occurred");
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.price || !formData.category) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const imageUrl = image ? await uploadFile(image) : "";

      await addDoc(collection(db, "productDetails"), {
        ...formData,
        imageUrl,
        businessId: id,
        createdDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      toast.success("Product added successfully!");
      onProductAdded();
      onBack(); 
    } catch (error) {
      toast.error("Failed to add product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 mt-[30px] flex flex-col gap-[30px]">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-2xl hover:text-gray-700"
      >
        ← Back
      </button>

      <div className="bg-white rounded-[20px] p-8">
        <h1 className="text-2xl mb-8 text-center">Add Product/Service</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-24 max-w-7xl mx-auto"
        >
          <div className="w-full md:w-[300px] flex flex-col gap-4">
            <div className="bg-gray-100 rounded-lg aspect-square flex flex-col items-center justify-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : isUploading ? (
                <div className="text-gray-400 mb-2">
                  <FaSpinner className="w-12 h-12 animate-spin" />{" "}
                  {/* Loader icon */}
                </div>
              ) : (
                <div className="text-gray-400 mb-2">
                  <FaImage className="w-12 h-12" /> {/* Placeholder icon */}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center">
              (Upload your Item image,
              <br />
              Format - jpg, png,jpeg ; )
            </p>
            <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 text-center">
              {isUploading ? "Uploading..." : "Upload"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading} // Disable input during upload
              />
            </label>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Product/Service Name</label>
              <input
                type="text"
                placeholder="Add name"
                className="border rounded-md p-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Price</label>
              <input
                type="number"
                placeholder="Add price"
                className="border rounded-md p-2"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Select Category</label>
              <select
                className="border rounded-md p-2 appearance-none bg-white"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                required
              >
                <option value="">Select one</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Discount Type</label>
              <select
                className="border rounded-md p-2 appearance-none bg-white"
                value={formData.discountType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountType: e.target.value,
                  }))
                }
              >
                <option value="">Select one</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Discount</label>
              <input
                type="number"
                placeholder="Add discount"
                className="border rounded-md p-2"
                value={formData.discount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, discount: e.target.value }))
                }
              />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-start gap-4">
              <label className="text-gray-600">Product Description</label>
              <textarea
                placeholder="Explain about your item"
                className="border rounded-md p-2 h-[100px] resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex  mt-4">
              <button
                type="submit"
                className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? "Adding..." : "Add new Product/Service"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
