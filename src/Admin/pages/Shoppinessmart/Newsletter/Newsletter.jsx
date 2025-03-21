import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "../../../../../firebase";

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortOptions] = useState(["newest", "oldest", "name"]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subscriberStats, setSubscriberStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0
  });
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fetch subscribers on component mount and when sort order changes
  useEffect(() => {
    fetchSubscribers();
  }, [sortOrder]);

  // Function to check if newsletter collection exists and create it if not
  const ensureNewsletterCollection = async () => {
    try {
      const newsletterRef = collection(db, "newsletter");
      const snapshot = await getDocs(newsletterRef);
      
      // If no error was thrown, collection exists (even if empty)
      // But if it's empty, we might want to add sample data (optional)
      if (snapshot.empty) {
        console.log("Newsletter collection exists but is empty");
      }
      
      return true;
    } catch (error) {
      console.error("Error checking newsletter collection:", error);
      
      // Try to create the collection with an initial document
      try {
        await addDoc(collection(db, "newsletter"), {
          name: "Sample Subscriber",
          email: "sample@example.com",
          date: new Date(),
          createdAt: new Date()
        });
        console.log("Newsletter collection created successfully");
        return true;
      } catch (createError) {
        console.error("Error creating newsletter collection:", createError);
        toast.error("Failed to initialize newsletter database");
        return false;
      }
    }
  };

  // Calculate subscriber statistics
  const calculateStats = (subscribersList) => {
    const total = subscribersList.length;
    
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay());
    
    const thisMonthCount = subscribersList.filter(
      sub => new Date(sub.date) >= thisMonth
    ).length;
    
    const thisWeekCount = subscribersList.filter(
      sub => new Date(sub.date) >= thisWeek
    ).length;
    
    setSubscriberStats({
      total,
      thisMonth: thisMonthCount,
      thisWeek: thisWeekCount
    });
  };

  // Fetch subscribers from Firebase
  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      
      // Ensure the collection exists
      const collectionExists = await ensureNewsletterCollection();
      if (!collectionExists) {
        setIsLoading(false);
        return;
      }
      
      // Create query based on sort order
      let subscribersQuery;
      if (sortOrder === "newest") {
        subscribersQuery = query(collection(db, "newsletter"), orderBy("date", "desc"));
      } else if (sortOrder === "oldest") {
        subscribersQuery = query(collection(db, "newsletter"), orderBy("date", "asc"));
      } else if (sortOrder === "name") {
        subscribersQuery = query(collection(db, "newsletter"), orderBy("name", "asc"));
      } else {
        subscribersQuery = collection(db, "newsletter");
      }
      
      const querySnapshot = await getDocs(subscribersQuery);
      
      const subscribersList = querySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        // Format date for display (if it's a timestamp)
        date: doc.data().date instanceof Date 
          ? doc.data().date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          : new Date(doc.data().date.seconds * 1000)
              .toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
        // Add displayIndex for table numbering
        displayIndex: index + 1
      }));
      
      setSubscribers(subscribersList);
      calculateStats(subscribersList);
      
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load newsletter subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort order change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Add new subscriber
  const addSubscriber = async (newSubscriber) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newSubscriber.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
      
      // Check if email already exists
      const querySnapshot = await getDocs(
        query(collection(db, "newsletter"), where("email", "==", newSubscriber.email))
      );
      
      if (!querySnapshot.empty) {
        toast.error("This email is already subscribed to the newsletter");
        return false;
      }
      
      // Add the new subscriber
      await addDoc(collection(db, "newsletter"), {
        name: newSubscriber.name,
        email: newSubscriber.email,
        date: new Date(),
        createdAt: new Date()
      });
      
      toast.success("Subscriber added successfully");
      fetchSubscribers();
      return true;
      
    } catch (error) {
      console.error("Error adding subscriber:", error);
      toast.error("Failed to add subscriber");
      return false;
    }
  };

  // Update existing subscriber
  const updateSubscriber = async (updatedSubscriber) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updatedSubscriber.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
      
      // Check if email already exists (skip checking the current subscriber)
      const querySnapshot = await getDocs(
        query(collection(db, "newsletter"), where("email", "==", updatedSubscriber.email))
      );
      
      const emailExists = querySnapshot.docs.some(doc => doc.id !== updatedSubscriber.id);
      if (emailExists) {
        toast.error("This email is already used by another subscriber");
        return false;
      }
      
      // Update the subscriber
      const subscriberRef = doc(db, "newsletter", updatedSubscriber.id);
      await updateDoc(subscriberRef, {
        name: updatedSubscriber.name,
        email: updatedSubscriber.email,
        updatedAt: new Date()
      });
      
      toast.success("Subscriber updated successfully");
      fetchSubscribers();
      return true;
      
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast.error("Failed to update subscriber");
      return false;
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (id) => {
    try {
      await deleteDoc(doc(db, "newsletter", id));
      toast.success("Subscriber deleted successfully");
      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to delete subscriber");
    }
  };

  // Modal component for adding/editing subscribers
  const SubscriberFormModal = ({ subscriber = null, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: subscriber?.name || "",
      email: subscriber?.email || "",
    });
    
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    };
    
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      let success;
      if (subscriber) {
        success = await onSubmit({
          ...formData,
          id: subscriber.id
        });
      } else {
        success = await onSubmit(formData);
      }
      
      if (success) {
        onClose();
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {subscriber ? "Edit Subscriber" : "Add New Subscriber"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Enter name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {subscriber ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Delete confirmation modal
  const DeleteConfirmModal = ({ subscriber, onCancel, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete <strong>{subscriber.name}</strong> ({subscriber.email})
          from the newsletter subscribers?
        </p>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex">
        <div className="flex-1 flex flex-col">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pb-0">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500 text-sm">Total Subscribers</h3>
              <p className="text-2xl font-bold">{subscriberStats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500 text-sm">New This Month</h3>
              <p className="text-2xl font-bold">{subscriberStats.thisMonth}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500 text-sm">New This Week</h3>
              <p className="text-2xl font-bold">{subscriberStats.thisWeek}</p>
            </div>
          </div>

          {/* Newsletter Management */}
          <div className="p-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Newsletter Subscribers</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="bg-gray-200 p-2 rounded"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">By Name</option>
                  </select>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    + Add New
                  </button>
                </div>
              </div>

              {/* Subscribers Table */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2">Loading subscribers...</p>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center rounded-lg">
                  <p className="text-gray-500">No subscribers found. Add your first subscriber to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 bg-gray-200 text-left">#</th>
                        <th className="py-2 px-4 bg-gray-200 text-left">Name</th>
                        <th className="py-2 px-4 bg-gray-200 text-left">Date Added</th>
                        <th className="py-2 px-4 bg-gray-200 text-left">Email</th>
                        <th className="py-2 px-4 bg-gray-200 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-4">{subscriber.displayIndex}.</td>
                          <td className="py-2 px-4">{subscriber.name}</td>
                          <td className="py-2 px-4">{subscriber.date}</td>
                          <td className="py-2 px-4">
                            <a href={`mailto:${subscriber.email}`} className="text-blue-500 hover:underline">
                              {subscriber.email}
                            </a>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => setEditingSubscriber(subscriber)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(subscriber)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <SubscriberFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addSubscriber}
        />
      )}

      {/* Edit Modal */}
      {editingSubscriber && (
        <SubscriberFormModal
          subscriber={editingSubscriber}
          onClose={() => setEditingSubscriber(null)}
          onSubmit={updateSubscriber}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          subscriber={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            deleteSubscriber(showDeleteConfirm.id);
            setShowDeleteConfirm(null);
          }}
        />
      )}
    </div>
  );
};

export default Newsletter;