import  { useState, useEffect } from "react";
import { db } from '../../../../../firebase';
import {   
  collection,   
  getDocs,   
  doc,   
  updateDoc, 
} from "firebase/firestore";

const CashbackTracking = () => {
  const [cashbacks, setCashbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cashback data from Firestore
  useEffect(() => {
    const fetchCashbacks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "onlineCashbackRequests"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCashbacks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cashbacks:", error);
        setLoading(false);
      }
    };
    
    fetchCashbacks();
  }, []);

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      const docRef = doc(db, "onlineCashbackRequests", id);
      await updateDoc(docRef, { status: newStatus });
      
      // Update the UI instantly (optimistic update)
      setCashbacks((prev) =>
        prev.map((cb) => (cb.id === id ? { ...cb, status: newStatus } : cb))
      );
      
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Cashback Requests</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                {['ID', 'User', 'Amount', 'Status', 'Date', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cashbacks.map((cb) => (
                <tr key={cb.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cb.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cb.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{cb.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={cb.status}
                      onChange={(e) => handleStatusChange(cb.id, e.target.value)}
                      className={`
                        form-select block w-full rounded-md border-gray-300 
                        ${getStatusColor(cb.status)} 
                        focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                      `}
                    >
                      <option value="New">New</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cb.requestedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleStatusChange(cb.id, "Approved")}
                        className="text-green-600 hover:text-green-900 
                          bg-green-100 hover:bg-green-200 
                          px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(cb.id, "Rejected")}
                        className="text-red-600 hover:text-red-900 
                          bg-red-100 hover:bg-red-200 
                          px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cashbacks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No cashback requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CashbackTracking;