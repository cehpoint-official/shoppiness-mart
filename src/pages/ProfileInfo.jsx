import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { userExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { db } from "../../firebase";
import { FaSpinner } from "react-icons/fa"; 

const ProfileInfo = ({ userData }) => {
  const dispatch = useDispatch();

  // Initialize formData with all fields from userData
  const [formData, setFormData] = useState({ ...userData });

  const [isLoading, setIsLoading] = useState(false); 
  const [editProfileInfo, setEditProfileInfo] = useState(false); 
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSave = async () => {
    setIsLoading(true); 
    try {
      // Ensure userData.uid is defined
      if (!userData?.uid) {
        throw new Error("User ID is undefined.");
      }


      // Update the Firestore document with the new data
      await setDoc(doc(db, "users", userData.uid), formData, { merge: true });

  
      dispatch(userExist(formData));

      console.log("User data updated successfully!");

      setEditProfileInfo(false);
      setEditEmail(false);
      setEditPhone(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      <div className="max-w-8xl mx-auto">
        {/* Profile Information Section */}
        <div className="mb-8">
          <div className="flex gap-3 items-center mb-4">
            <h2 className="text-xl font-medium">Profile Information</h2>
            <button
              onClick={() => setEditProfileInfo(!editProfileInfo)}
              className="text-blue-600 hover:text-blue-700 text-md font-medium"
            >
              {editProfileInfo ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 font-medium">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                name="fname"
                value={formData.fname || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded"
                disabled={!editProfileInfo}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="lname"
                value={formData.lname || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded"
                disabled={!editProfileInfo}
              />
            </div>
          </div>

          <div className="mt-4 font-medium">
            <label className="block text-sm mb-2">Your Gender</label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleGenderChange}
                  className="mr-2"
                  disabled={!editProfileInfo}
                />
                <span className="text-sm">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleGenderChange}
                  className="mr-2"
                  disabled={!editProfileInfo}
                />
                <span className="text-sm">Female</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Others"
                  checked={formData.gender === "Others"}
                  onChange={handleGenderChange}
                  className="mr-2"
                  disabled={!editProfileInfo}
                />
                <span className="text-sm">Others</span>
              </label>
            </div>
          </div>
        </div>

        {/* Email Address Section */}
        <div className="mb-8">
          <div className="flex gap-3 items-center mb-4">
            <h2 className="text-xl font-medium">Email Address</h2>
            <button
              onClick={() => setEditEmail(!editEmail)}
              className="text-blue-600 hover:text-blue-700 text-md font-medium"
            >
              {editEmail ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="w-1/2">
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-200 rounded"
              disabled={!editEmail}
            />
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="mb-8">
          <div className="flex gap-3 items-center mb-4">
            <h2 className="text-xl font-medium">Phone Number</h2>
            <button
              onClick={() => setEditPhone(!editPhone)}
              className="text-blue-600 hover:text-blue-700 text-md font-medium"
            >
              {editPhone ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="w-1/2">
            <label className="block text-sm mb-1 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-200 rounded"
              disabled={!editPhone}
            />
          </div>
        </div>

        {/* Save Button at the Bottom */}
        {(editProfileInfo || editEmail || editPhone) && (
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
