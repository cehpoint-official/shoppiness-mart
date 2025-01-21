import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { MdModeEdit, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase";
import {
  businessUserExist,
  setLoading,
} from "../../../redux/reducer/businessUserReducer";

const ShopInfo = () => {
  const { user} = useSelector((state) => state.businessUserReducer);
  const { id } = useParams();
  const dispatch = useDispatch();

  // State for password visibility and modal
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("All fields are required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match");
      return;
    }

    if (passwords.new.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Check if current password matches
    if (passwords.current !== user.password) {
      setError("Current password is incorrect");
      return;
    }

    dispatch(setLoading(true));

    try {
      // Update the Firestore document with the new password
      await setDoc(
        doc(db, "businessDetails", id),
        { password: passwords.new },
        { merge: true }
      );

      // Dispatch the updated user data to Redux
      dispatch(businessUserExist({ ...user, password: passwords.new }));

      // Close modal and reset form
      setShowPasswordModal(false);
      setPasswords({ current: "", new: "", confirm: "" });
      console.log("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl mx-auto">
        {/* SHOP Info */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={user.bannerUrl}
              alt={user.businessName}
              className="w-1/3 h-48 rounded-lg object-fit"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center justify-center py-1 rounded-full bg-green-200 gap-2 mb-1">
                    <span className="text-md text-green-600 text-verified">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.logoUrl}
                      alt="Shop Logo"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h1 className="text-xl font-semibold text-textPrimary">
                        {user.businessName}
                      </h1>
                      <p className="text-sm text-textSecondary">{user.cat}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-textSecondary mb-1">Shop ID</p>
                  <p className="text-blue-700 font-semibold">{id}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-textSecondary mb-1">
                    Description
                  </h2>
                  <p className="text-textPrimary">{user.shortDesc}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-textSecondary mb-1">
                    Location
                  </h2>
                  <p className="text-textPrimary">{user.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-sm font-medium text-textSecondary mb-1">
                      Phone Number
                    </h2>
                    <p className="text-textPrimary">{user.mobileNumber}</p>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-textSecondary mb-1">
                      Email ID
                    </h2>
                    <p className="text-textPrimary">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button className="flex bg-blue-600 items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors">
              <MdModeEdit className="w-4 h-4" />
              Edit Shop Info
            </button>
          </div>
        </div>

        {/* SHOP DETAILS */}
        <div className="bg-white rounded-xl shadow-card p-6 mt-6">
          <h2 className="text-lg font-semibold text-textPrimary mb-6">
            SHOP DETAILS
          </h2>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side - Input fields */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-textSecondary mb-2">
                    Business/Services Owner Name
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md text-textPrimary">
                    {user.owner}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-textSecondary mb-2">
                    Business/Services type
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md text-textPrimary">
                    {user.cat}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-textSecondary mb-2">Email</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-textPrimary">
                    {user.email}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-textSecondary mb-2">
                    Shop Category
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md text-textPrimary">
                    {user.cat}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-textSecondary mb-2">
                    Commission rate
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md text-textPrimary">
                    5%
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-textSecondary mb-2">Password</h3>
                  <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                    <span className="text-textPrimary">
                      {showPassword ? user.password : "••••••••"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-primary text-blue-500 text-sm flex items-center gap-1"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="text-primary text-blue-500 text-sm"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side - Logo */}
            <div className="lg:w-64">
              <h3 className="text-sm text-textSecondary mb-2">Logo</h3>
              <div className="flex items-center justify-center ">
                <img
                  src={user.logoUrl}
                  alt="Shop Logo"
                  className="max-w-full h-48 object-contain"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button className="flex bg-blue-600 items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors">
              <MdModeEdit className="w-4 h-4" />
              Edit Shop Details
            </button>
          </div>
        </div>
      </div>
      {/* Custom Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Make your new password strong!
              </p>

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm text-gray-600" htmlFor="current">
                    Current Password
                  </label>
                  <input
                    id="current"
                    name="current"
                    type="password"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600" htmlFor="new">
                    New Password
                  </label>
                  <input
                    id="new"
                    name="new"
                    type="password"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600" htmlFor="confirm">
                    Confirm Password
                  </label>
                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswords({ current: "", new: "", confirm: "" });
                      setError("");
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;
