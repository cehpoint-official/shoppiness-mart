import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../../../../../firebase";

// Main FAQ Management Component
const AllFaqs = () => {
  const [currentView, setCurrentView] = useState("allfaqs");
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState(null);

  // Fetch FAQs from Firebase on component mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  // Function to check if a collection exists in Firestore
  const collectionExists = async (collectionName) => {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      // Even if collection exists but is empty, it won't throw an error
      return true;
    } catch (error) {
      console.error('Error checking collection:', error);
      return false;
    }
  };

  // Function to create a collection with an initial document if it doesn't exist
  const createFaqCollection = async () => {
    try {
      // Create a sample FAQ document to initialize the collection
      await addDoc(collection(db, "FAQ"), {
        question: "What is this FAQ section?",
        answer: "This is a section where you can find answers to commonly asked questions.",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("FAQ collection created successfully!");
      return true;
    } catch (error) {
      console.error('Error creating FAQ collection:', error);
      return false;
    }
  };

  // Function to fetch all FAQs from Firebase
  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      
      // Check if the FAQ collection exists
      const exists = await collectionExists("FAQ");
      
      if (!exists) {
        // Create the collection if it doesn't exist
        const created = await createFaqCollection();
        if (!created) {
          toast("Failed to initialize FAQ system. Please try again.");
          setIsLoading(false);
          return;
        }
      }
      
      // Now fetch the FAQs
      const faqCollection = collection(db, "FAQ");
      const faqSnapshot = await getDocs(faqCollection);
      const faqList = faqSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setFaqs(faqList);
      
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast("Failed to load FAQs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a FAQ
  const deleteFaq = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const faqDoc = doc(db, "FAQ", id);
        await deleteDoc(faqDoc);
        setFaqs((prevFaqs) => prevFaqs.filter(faq => faq.id !== id));
        toast("FAQ deleted successfully!");
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast("Failed to delete FAQ. Please try again.");
      }
    }
  };

  // Function to handle the edit action
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setCurrentView("editFaq");
  };

  // Function to handle adding or updating a FAQ
  const handleFaqSubmit = async (faq, isEditing = false) => {
    try {
      if (isEditing) {
        const faqDoc = doc(db, "FAQ", faq.id);
        await updateDoc(faqDoc, {
          question: faq.question,
          answer: faq.answer,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, "FAQ"), {
          question: faq.question,
          answer: faq.answer,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      fetchFaqs();
      setCurrentView("allfaqs");
      toast(`FAQ ${isEditing ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} FAQ:`, error);
      toast(`Failed to ${isEditing ? 'update' : 'add'} FAQ. Please try again.`);
    }
  };

  // Show AddFaq component if currentView is "addFaq"
  if (currentView === "addFaq") {
    return (
      <AddFaq 
        onBack={() => setCurrentView("allfaqs")} 
        onSubmit={(faq) => handleFaqSubmit(faq, false)}
      />
    );
  }

  // Show EditFaq component if currentView is "editFaq"
  if (currentView === "editFaq" && editingFaq) {
    return (
      <EditFaq 
        faq={editingFaq}
        onBack={() => setCurrentView("allfaqs")} 
        onSubmit={(faq) => handleFaqSubmit(faq, true)}
      />
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        {/* FAQ QUES  */}
        <div className="p-6 bg-gray-100 flex-1">
          <div>
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">FAQs</h1>

                <button
                  onClick={() => setCurrentView("addFaq")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  + ADD NEW FAQ
                </button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                  <p className="mt-2">Loading FAQs...</p>
                </div>
              ) : faqs.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center rounded-lg">
                  <p className="text-gray-500">No FAQs found. Add a new one to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{faq.question}</h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{faq.answer}</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleEdit(faq)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteFaq(faq.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
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

// Component for adding a new FAQ
const AddFaq = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-7/12">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-2xl hover:text-gray-700 mb-4"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-center mb-6">ADD FAQ</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="question"
                  >
                    Add Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    value={formData.question}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.question ? 'border-red-500' : ''
                    }`}
                    placeholder="Type your question here"
                  />
                  {errors.question && (
                    <p className="text-red-500 text-xs mt-1">{errors.question}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="answer"
                  >
                    Add Answer
                  </label>
                  <textarea
                    id="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 ${
                      errors.answer ? 'border-red-500' : ''
                    }`}
                    placeholder="Type your answer here"
                  ></textarea>
                  {errors.answer && (
                    <p className="text-red-500 text-xs mt-1">{errors.answer}</p>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                    }`}
                  >
                    {isSubmitting ? 'ADDING...' : 'ADD NEW FAQ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for editing an existing FAQ
const EditFaq = ({ faq, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: faq.id,
    question: faq.question,
    answer: faq.answer
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-7/12">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-2xl hover:text-gray-700 mb-4"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-center mb-6">EDIT FAQ</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="question"
                  >
                    Edit Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    value={formData.question}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.question ? 'border-red-500' : ''
                    }`}
                    placeholder="Type your question here"
                  />
                  {errors.question && (
                    <p className="text-red-500 text-xs mt-1">{errors.question}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="answer"
                  >
                    Edit Answer
                  </label>
                  <textarea
                    id="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 ${
                      errors.answer ? 'border-red-500' : ''
                    }`}
                    placeholder="Type your answer here"
                  ></textarea>
                  {errors.answer && (
                    <p className="text-red-500 text-xs mt-1">{errors.answer}</p>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                  >
                    {isSubmitting ? 'UPDATING...' : 'UPDATE FAQ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFaqs;