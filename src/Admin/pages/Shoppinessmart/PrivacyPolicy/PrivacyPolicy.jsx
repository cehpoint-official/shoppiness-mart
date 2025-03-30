import { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineSave, AiOutlineLoading3Quarters, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

const PrivacyPolicy = () => {
  const [currentView, setCurrentView] = useState("privacypolicy");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPolicy, setEditPolicy] = useState(null);

  // Fetch policies from Firebase
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const policyCollection = collection(db, "privacyPolicies");
      const policySnapshot = await getDocs(policyCollection);
      const policyList = policySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort policies by createdAt in ascending order (oldest first)
      const sortedPolicies = policyList.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      
      setPolicies(sortedPolicies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  // Delete a policy
  const handleDeletePolicy = async (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deleteDoc(doc(db, "privacyPolicies", id));
        toast.success("Policy deleted successfully");
        fetchPolicies(); // Refresh the list
      } catch (error) {
        console.error("Error deleting policy:", error);
        toast.error(`Failed to delete policy: ${error.message}`);
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (policy) => {
    setEditPolicy(policy);
    setCurrentView("addPrivacy");
  };

  // Initial data fetch
  useEffect(() => {
    fetchPolicies();
  }, []);

  if (currentView === "addPrivacy") {
    return (
      <AddPrivacyPolicy 
        onBack={() => {
          setCurrentView("privacypolicy");
          setEditPolicy(null);
        }} 
        onPolicyAdded={fetchPolicies}
        editPolicy={editPolicy}
      />
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-gray-100 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Privacy Policies</h1>

                <button
                  onClick={() => setCurrentView("addPrivacy")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  + ADD NEW POLICY
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 flex items-center justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    Loading policies...
                  </p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No privacy policies found. Add one to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div
                      key={policy.id}
                      className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">{policy.title}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditClick(policy)}
                          className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                        >
                          <AiOutlineEdit className="mr-1" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePolicy(policy.id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                        >
                          <AiOutlineDelete className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddPrivacyPolicy = ({ onBack, onPolicyAdded, editPolicy }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Prefill form if editing
  useEffect(() => {
    if (editPolicy) {
      setTitle(editPolicy.title || "");
      setContent(editPolicy.content || "");
    }
  }, [editPolicy]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!content.trim()) errors.content = "Policy content is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      if (editPolicy) {
        // Update existing policy
        const policyRef = doc(db, "privacyPolicies", editPolicy.id);
        await updateDoc(policyRef, {
          title,
          content,
          updatedAt: new Date().toISOString()
        });
        toast.success("Policy updated successfully");
      } else {
        // Add new policy
        await addDoc(collection(db, "privacyPolicies"), {
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success("Policy added successfully");
      }
      
      onPolicyAdded();
      onBack();
    } catch (error) {
      console.error("Error saving policy:", error);
      toast.error(`Failed to ${editPolicy ? 'update' : 'add'} policy: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <div className="flex-1">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-2xl hover:text-gray-700 mb-6"
              disabled={submitting}
            >
              ← Back
            </button>

            <h2 className="text-xl font-bold mb-6">
              {editPolicy ? "Edit Privacy Policy" : "Add New Privacy Policy"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                  Policy Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`shadow appearance-none border ${
                    validationErrors.title ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Add title"
                  disabled={submitting}
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-gray-700 mb-2">
                  Policy Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`shadow appearance-none border ${
                    validationErrors.content ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-64`}
                  placeholder="Write policy"
                  disabled={submitting}
                ></textarea>
                {validationErrors.content && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  disabled={submitting || (!title.trim() && !content.trim())}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center min-w-[100px]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <AiOutlineSave className="mr-1" /> Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;