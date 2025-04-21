import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, onSnapshot, query, orderBy, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../../firebase";
import ContactMessage from "./ContactMessage";
import toast from "react-hot-toast";

const ContactInfo = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [infoDocId, setInfoDocId] = useState(null);
  
  // Contact info state
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    location: "",
    description: ""
  });
  
  // Edit states
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Setup initial database structure if needed
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // Check if info document exists in contacts collection
        const infoQuerySnapshot = await getDocs(collection(db, "contacts"));
        let infoDoc = infoQuerySnapshot.docs.find(doc => doc.id === "info");
        
        // If info document doesn't exist, create it
        if (!infoDoc) {
          await setDoc(doc(db, "contacts", "info"), {
            email: "email@gmail.com",
            phone: "9578288298",
            location: "Lorem ipsum dolor sit amet consecteturvoluptrecusandae impedit Kolkata. Sahanagar Kolkata; 700026",
            description: "Lorem ipsum dolor sit amet consecteturvoluptrecusandae impeditLorem ipsum dolor sit am",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          setInfoDocId("info");
          console.log("Created info document in contacts collection");
        } else {
          setInfoDocId("info");
        }
        
        // Initialize contacts collection with sample data if it doesn't exist
        const contactsSnapshot = await getDocs(collection(db, "contacts"));
        if (contactsSnapshot.docs.length <= 1) {  // Only the info document exists
          await addDoc(collection(db, "contacts"), {
            name: "Sauhardya Chakraborty",
            email: "sauhardya@gmail.com",
            phone: "8729890478",
            subject: "I want to list my cause",
            message: "I want to list my cause",
            role: "NGO volunteer",
            timestamp: serverTimestamp(),
            read: false,
            replied: false
          });
          console.log("Created contacts collection with sample data");
        }
      } catch (error) {
        console.error("Error setting up database:", error);
      }
    };
    
    setupDatabase();
  }, []);

  // Fetch contacts from Firebase
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsRef = collection(db, "contacts");
        
        // Create a query with orderBy if possible
        let q;
        try {
          q = query(contactsRef, orderBy("timestamp", sortOrder === "newest" ? "desc" : "asc"));
        } catch (error) {
          console.warn("Error creating query with orderBy. Using collection reference instead:", error);
          q = contactsRef;
        }
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const contactsData = snapshot.docs
            .filter(doc => doc.id !== "info") // Exclude the info document
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Handle timestamps that might be null or undefined
              timestamp: doc.data().timestamp || { toDate: () => new Date() }
            }));
          setContacts(contactsData);
          setLoading(false);
        }, (error) => {
          console.error("Error in onSnapshot:", error);
          setLoading(false);
          toast.error("Failed to load contacts");
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
        toast.error("Failed to load contacts");
      }
    };

    // Fetch contact info from the "info" document
    const fetchContactInfo = async () => {
      try {
        const infoDocRef = doc(db, "contacts", "info");
        const unsubscribe = onSnapshot(infoDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const infoData = docSnapshot.data();
            setContactInfo({
              email: infoData.email || "",
              phone: infoData.phone || "",
              location: infoData.location || "",
              description: infoData.description || ""
            });
            setInfoDocId("info");
          }
        }, (error) => {
          console.error("Error in info onSnapshot:", error);
          toast.error("Failed to load contact information");
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching contact info:", error);
        toast.error("Failed to load contact information");
      }
    };

    fetchContacts();
    fetchContactInfo();
  }, [sortOrder]);

  // Handle field change
  const handleFieldChange = (field, value) => {
    setEditValue(value);
    setHasUnsavedChanges(true);
  };

  // Handle updating contact info field
  const updateContactInfoField = async (field) => {
    try {
      setEditingField(null);
      
      // Validation
      if (field === "email" && !validateEmail(editValue)) {
        toast.error("Please enter a valid email address");
        return;
      }
      
      if (field === "phone" && !validatePhone(editValue)) {
        toast.error("Please enter a valid phone number");
        return;
      }
      
      // Update state
      setContactInfo({
        ...contactInfo,
        [field]: editValue
      });
      
      // Update in Firebase
      if (infoDocId) {
        const docRef = doc(db, "contacts", infoDocId);
        await updateDoc(docRef, {
          [field]: editValue,
          updatedAt: serverTimestamp()
        });
        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    }
  };

  // Save all contact info at once
  const saveAllContactInfo = async () => {
    try {
      if (infoDocId) {
        const docRef = doc(db, "contacts", infoDocId);
        await updateDoc(docRef, {
          ...contactInfo,
          updatedAt: serverTimestamp()
        });
        setHasUnsavedChanges(false);
        toast.success("Contact information saved successfully");
      } else {
        // Create new info document if it doesn't exist
        await setDoc(doc(db, "contacts", "info"), {
          ...contactInfo,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setInfoDocId("info");
        setHasUnsavedChanges(false);
        toast.success("Contact information created successfully");
      }
    } catch (error) {
      console.error("Error saving contact information:", error);
      toast.error("Failed to save contact information");
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  // Start editing a field
  const startEditing = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  // Add a new contact (for testing)
  const addTestContact = async () => {
    try {
      await addDoc(collection(db, "contacts"), {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        subject: "Test Subject",
        message: "This is a test message",
        role: "Tester",
        timestamp: serverTimestamp(),
        read: false,
        replied: false
      });
      toast.success("Test contact added successfully");
    } catch (error) {
      console.error("Error adding test contact:", error);
      toast.error("Failed to add test contact");
    }
  };

  // Render editable field - updated for better mobile responsiveness
  const renderEditableField = (field, value, isTextarea = false) => {
    return editingField === field ? (
      <div className="flex flex-col sm:flex-row">
        {isTextarea ? (
          <textarea
            className="w-full px-3 py-2 border rounded-md mb-2 sm:mb-0"
            value={editValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            rows={3}
          />
        ) : (
          <input
            type={field === "email" ? "email" : "text"}
            className="w-full px-3 py-2 border rounded-md mb-2 sm:mb-0"
            value={editValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        )}
        <div className="flex sm:flex-col sm:ml-2">
          <button 
            className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 sm:mr-0 sm:mb-2"
            onClick={() => {
              updateContactInfoField(field);
              setHasUnsavedChanges(true);
              setContactInfo({...contactInfo, [field]: editValue});
            }}
          >
            Save
          </button>
          <button 
            className="bg-gray-500 text-white px-3 py-1 rounded-md"
            onClick={() => setEditingField(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row sm:items-center">
        <span className="w-full px-3 py-2 border rounded-md mb-2 sm:mb-0 break-words">
          {value}
        </span>
        <button 
          className="bg-blue-500 text-white px-3 py-1 rounded-md sm:ml-2 self-start"
          onClick={() => startEditing(field, value)}
        >
          Edit
        </button>
      </div>
    );
  };

  // If a contact is selected, show the ContactMessage component
  if (selectedContact) {
    return (
      <ContactMessage
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        db={db}
      />
    );
  }

  // Otherwise, show the ContactInfo component
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Info</h1>
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Edit Contact Info Section */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Edit Contact Info</h2>
              </div>
              
              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email:</label>
                {renderEditableField("email", contactInfo.email)}
              </div>
              
              {/* Phone Field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Phone number:</label>
                {renderEditableField("phone", contactInfo.phone)}
              </div>
              
              {/* Location Field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Add location Details:</label>
                {renderEditableField("location", contactInfo.location, true)}
              </div>
              
              {/* Description Field */}
              <div>
                <label className="block text-gray-700 mb-1">Short description:</label>
                {renderEditableField("description", contactInfo.description, true)}
              </div>
            </div>
            
            {/* Messages Section */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-bold">All Messages</h2>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="bg-blue-500 text-white p-2 rounded text-sm"
                    onClick={addTestContact}
                  >
                    Add Test Contact
                  </button>
                  <button 
                    className="bg-gray-200 p-2 rounded flex items-center"
                    onClick={toggleSortOrder}
                  >
                    Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-4">Loading messages...</div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-4">No messages received yet</div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="block sm:hidden">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="border-t p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium flex items-center">
                            {contact.name}
                            {!contact.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                            onClick={() => setSelectedContact(contact)}
                          >
                            View
                          </button>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Email:</span> {contact.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span> {contact.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 bg-gray-200">Name</th>
                          <th className="py-2 px-4 bg-gray-200">Email</th>
                          <th className="py-2 px-4 bg-gray-200">Phone No.</th>
                          <th className="py-2 px-4 bg-gray-200">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact) => (
                          <tr key={contact.id} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-4">
                              {contact.name}
                              {!contact.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </td>
                            <td className="py-2 px-4">{contact.email}</td>
                            <td className="py-2 px-4">{contact.phone}</td>
                            <td className="py-2 px-4">
                              <button
                                className="text-blue-500 hover:underline"
                                onClick={() => setSelectedContact(contact)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;