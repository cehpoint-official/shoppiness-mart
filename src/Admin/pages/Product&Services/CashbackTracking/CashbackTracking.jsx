import React, { useState, useEffect } from "react";
import { db } from '../../../../../firebase';// Import your Firebase config
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./CashbackTracking.css";  // Styling

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cashback-tracking">
      <h2>Cashback Requests</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cashbacks.map((cb) => (
            <tr key={cb.id}>
              <td>{cb.id}</td>
              <td>{cb.userName}</td>
              <td>₹{cb.paidAmount}</td>
              <td>
                <select
                  value={cb.status}
                  onChange={(e) => handleStatusChange(cb.id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>{cb.requestedAt}</td>
              <td>
                <button onClick={() => handleStatusChange(cb.id, "Approved")}>
                  Approve
                </button>
                <button onClick={() => handleStatusChange(cb.id, "Rejected")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashbackTracking;
