import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../../../../firebase";
import ContactMessage from "./ContactMessage";
import { toast } from "react-toastify"; // For notifications (optional)

const ContactInfo = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  
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

  // Setup initial database structure if needed
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // Check if organizationInfo exists
        const orgInfoSnapshot = await getDocs(collection(db, "organizationInfo"));
        
        // If organizationInfo doesn't exist, create it
        // if (orgInfoSnapshot.empty) {
        //   await addDoc(collection(db, "organizationInfo"), {
        //     email: "email@gmail.com",
        //     phone: "9578288298",
        //     location: "Lorem ipsum dolor sit amet consecteturvoluptrecusandae impedit Kolkata. Sahanagar Kolkata; 700026",
        //     description: "Lorem ipsum dolor sit amet consecteturvoluptrecusandae impeditLorem ipsum dolor sit am",
        //     createdAt: serverTimestamp(),
        //     updatedAt: serverTimestamp()
        //   });
        //   console.log("Created organizationInfo collection");
        // }
        
        // Initialize contacts collection with sample data if it doesn't exist
        const contactsSnapshot = await getDocs(collection(db, "contacts"));
        if (contactsSnapshot.empty) {
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
          const contactsData = snapshot.docs.map(doc => ({
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

    // Fetch organization info
    const fetchOrgInfo = async () => {
      try {
        const orgSnapshot = await getDocs(collection(db, "organizationInfo"));
        if (!orgSnapshot.empty) {
          const orgData = orgSnapshot.docs[0].data();
          setContactInfo({
            email: orgData.email || "",
            phone: orgData.phone || "",
            location: orgData.location || "",
            description: orgData.description || ""
          });
        }
      } catch (error) {
        console.error("Error fetching organization info:", error);
        toast.error("Failed to load organization information");
      }
    };

    fetchContacts();
    fetchOrgInfo();
  }, [sortOrder]);

  // Handle updating organization info
  const updateOrgInfo = async (field) => {
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
      const orgDocsSnapshot = await getDocs(collection(db, "organizationInfo"));
      if (!orgDocsSnapshot.empty) {
        const docRef = doc(db, "organizationInfo", orgDocsSnapshot.docs[0].id);
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
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Contact Info</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md w-full md:w-1/2">
              <h2 className="text-xl font-bold mb-4">Edit Contact Info</h2>
              
              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                {editingField === "email" ? (
                  <div className="flex">
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button 
                      className="ml-2 bg-green-500 text-white px-3 py-1 rounded-md"
                      onClick={() => updateOrgInfo("email")}
                    >
                      Save
                    </button>
                    <button 
                      className="ml-2 bg-gray-500 text-white px-3 py-1 rounded-md"
                      onClick={() => setEditingField(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="w-full px-3 py-2 border rounded-md">
                      {contactInfo.email}
                    </span>
                    <button 
                      className="ml-2 text-blue-500"
                      onClick={() => startEditing("email", contactInfo.email)}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
              
              {/* Phone Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Phone number:</label>
                {editingField === "phone" ? (
                  <div className="flex">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button 
                      className="ml-2 bg-green-500 text-white px-3 py-1 rounded-md"
                      onClick={() => updateOrgInfo("phone")}
                    >
                      Save
                    </button>
                    <button 
                      className="ml-2 bg-gray-500 text-white px-3 py-1 rounded-md"
                      onClick={() => setEditingField(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="w-full px-3 py-2 border rounded-md">
                      {contactInfo.phone}
                    </span>
                    <button 
                      className="ml-2 text-blue-500"
                      onClick={() => startEditing("phone", contactInfo.phone)}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
              
              {/* Location Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Add location Details:</label>
                {editingField === "location" ? (
                  <div className="flex">
                    <textarea
                      className="w-full px-3 py-2 border rounded-md"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                    />
                    <div className="flex flex-col ml-2">
                      <button 
                        className="bg-green-500 text-white px-3 py-1 rounded-md mb-2"
                        onClick={() => updateOrgInfo("location")}
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
                  <div className="flex items-center">
                    <span className="w-full px-3 py-2 border rounded-md">
                      {contactInfo.location}
                    </span>
                    <button 
                      className="ml-2 text-blue-500"
                      onClick={() => startEditing("location", contactInfo.location)}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
              
              {/* Description Field */}
              <div>
                <label className="block text-gray-700">Short description:</label>
                {editingField === "description" ? (
                  <div className="flex">
                    <textarea
                      className="w-full px-3 py-2 border rounded-md"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                    />
                    <div className="flex flex-col ml-2">
                      <button 
                        className="bg-green-500 text-white px-3 py-1 rounded-md mb-2"
                        onClick={() => updateOrgInfo("description")}
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
                  <div className="flex items-center">
                    <span className="w-full px-3 py-2 border rounded-md">
                      {contactInfo.description}
                    </span>
                    <button 
                      className="ml-2 text-blue-500"
                      onClick={() => startEditing("description", contactInfo.description)}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages Section */}
            <div className="p-6 bg-white rounded-lg shadow-md w-full md:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Messages</h2>
                <div className="flex space-x-2">
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
                    Sort by: {sortOrder === "newest" ? "Newest" : "Oldest"}
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
                <div className="overflow-x-auto">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;