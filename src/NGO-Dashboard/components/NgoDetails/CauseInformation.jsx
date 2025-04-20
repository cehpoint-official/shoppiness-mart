import { doc, setDoc } from "firebase/firestore";
import {useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase";
import {
  ngoUserExist,
  setLoading,
} from "../../../redux/reducer/ngoUserReducer";
import { FaSpinner } from "react-icons/fa";
const CauseInformation = () => {
  const { user, loading } = useSelector((state) => state.ngoUserReducer);


  const { id } = useParams();

  const [formData, setFormData] = useState({
    ...user,
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    dispatch(setLoading(true));

    try {
      // Update the Firestore document with the new data
      await setDoc(doc(db, "causeDetails", id), formData, {
        merge: true,
      });

      // Dispatch the updated user data to Redux
      dispatch(ngoUserExist(formData));

      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      dispatch(setLoading(false)); // Set loading state to false
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mb-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category<span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-2 border border-gray-300 "
            value={formData.cat || ""}
            onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
          >
            <option value="">Please Select</option>
            <option value="one">One</option>
            <option value="two">Two</option>
            <option value="three">Three</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub Category<span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-2 border border-gray-300 "
            value={formData.subCategory || ""}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
          >
            <option value="">Please Select</option>
            <option value="one">One</option>
            <option value="two">Two</option>
            <option value="three">Three</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About your cause<span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 h-32"
            placeholder="Tell about your cause/NGO"
            value={formData.aboutCause || ""}
            onChange={(e) =>
              setFormData({ ...formData, aboutCause: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className="w-full p-2 border border-gray-300"
            value={formData.mobileNumber || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pin Code<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300"
            value={formData.pincode || ""}
            onChange={(e) =>
              setFormData({ ...formData, pincode: e.target.value })
            }
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#FFB939] py-2 px-4 hover:bg-[#f5c161] flex items-center justify-center"
        disabled={loading}
      >
        {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default CauseInformation;
