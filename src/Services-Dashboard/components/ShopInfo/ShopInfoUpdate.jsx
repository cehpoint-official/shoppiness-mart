import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FaSpinner, FaImage } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../../../firebase"; // Import your Firestore instance
import { useDispatch, useSelector } from "react-redux";
import { businessUserExist } from "../../../redux/reducer/businessUserReducer";

const ShopInfoUpdate = ({ onBack, shopData }) => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.businessUserReducer);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    businessName: shopData.businessName || "",
    mobileNumber: shopData.mobileNumber || "",
    cat: shopData.cat || "",
    mode: shopData.mode || "",
    location: shopData.location || "",
    owner: shopData.owner || "",
    shortDesc: shopData.shortDesc || "",
    logoUrl: shopData.logoUrl || "",
    bannerUrl: shopData.bannerUrl || "",
    businessEmail: shopData.businessEmail || "",
    pincode: shopData.pincode || "",
    rate: shopData.rate || "0",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const validateFileFormat = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormats.includes(file.type)) {
      toast.error("Only .png, .jpeg, and .jpg formats are allowed.");
      return false;
    }
    return true;
  };

  const handleFileChangeLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFileFormat(file)) return;

    setIsUploadingLogo(true);
    try {
      const downloadURL = await uploadFile(file);
      setFormData((prev) => ({ ...prev, logoUrl: downloadURL }));
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading logo: " + error.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFileChangeBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFileFormat(file)) return;

    setIsUploadingBanner(true);
    try {
      const downloadURL = await uploadFile(file);
      setFormData((prev) => ({ ...prev, bannerUrl: downloadURL }));
      toast.success("Banner uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading banner: " + error.message);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const metadata = { contentType: file.type };
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const shopRef = doc(db, "businessDetails", id);
      await updateDoc(shopRef, formData);

      // Dispatch the updated user data to Redux
      dispatch(businessUserExist({ ...user, ...formData }));

      toast.success("Shop information updated successfully!");
      onBack();
    } catch (error) {
      toast.error("Error updating shop information: " + error.message);
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
        <h1 className="text-2xl mb-8 text-center">Update Shop Information</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Information */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Business Name</label>
                <input
                  type="text"
                  className="border rounded-md p-2"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Business Email</label>
                <input
                  type="email"
                  className="border rounded-md p-2"
                  value={formData.businessEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessEmail: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Mobile Number</label>
                <input
                  type="tel"
                  className="border rounded-md p-2"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mobileNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Owner Name</label>
                <input
                  type="text"
                  className="border rounded-md p-2"
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, owner: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Commission Rate (%)</label>
                <input
                  type="text"
                  className="border rounded-md p-2 bg-gray-100"
                  value={formData.rate}
                  disabled
                />
                <p className="text-sm text-gray-500">
                  Important: To change the commission rate, please contact
                  Shoppinessmart.
                </p>
              </div>
            </div>

            {/* Location and Category */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Category</label>
                <select
                  className="border rounded-md p-2"
                  value={formData.cat}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cat: e.target.value }))
                  }
                  required
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sport">Sport</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Mode</label>
                <select
                  className="border rounded-md p-2"
                  value={formData.mode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mode: e.target.value }))
                  }
                  required
                >
                  <option value="">Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Location</label>
                <input
                  type="text"
                  className="border rounded-md p-2"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Pincode</label>
                <input
                  type="text"
                  className="border rounded-md p-2"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-600">Short Description</label>
            <textarea
              className="border rounded-md p-2 h-24 resize-none"
              value={formData.shortDesc}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shortDesc: e.target.value }))
              }
              required
            />
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="flex flex-col gap-4">
              <label className="text-gray-600">Logo</label>
              <div className="bg-gray-100 rounded-lg aspect-square flex flex-col items-center justify-center">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : isUploadingLogo ? (
                  <FaSpinner className="w-12 h-12 animate-spin text-gray-400" />
                ) : (
                  <FaImage className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 text-center">
                {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChangeLogo}
                  disabled={isUploadingLogo}
                />
              </label>
            </div>

            {/* Banner Upload */}
            <div className="flex flex-col gap-4">
              <label className="text-gray-600">Banner</label>
              <div className="bg-gray-100 rounded-lg aspect-square flex flex-col items-center justify-center">
                {formData.bannerUrl ? (
                  <img
                    src={formData.bannerUrl}
                    alt="Banner"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : isUploadingBanner ? (
                  <FaSpinner className="w-12 h-12 animate-spin text-gray-400" />
                ) : (
                  <FaImage className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 text-center">
                {isUploadingBanner ? "Uploading..." : "Upload Banner"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChangeBanner}
                  disabled={isUploadingBanner}
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
              disabled={isSubmitting || isUploadingLogo || isUploadingBanner}
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Update Shop Information"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopInfoUpdate;
