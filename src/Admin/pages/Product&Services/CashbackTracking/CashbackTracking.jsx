import React, { useState, useEffect } from "react";
import "./CashbackTracking.css";  // Add styling here if needed
import axios from "axios";

const CashbackTracking = () => {
  const [cashbacks, setCashbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCashbacks = async () => {
      try {
        const response = await axios.get("https://your-backend-url.com/api/cashbacks");
        setCashbacks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cashbacks:", error);
        setLoading(false);
      }
    };

    fetchCashbacks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cashback-tracking">
      <h2>Cashback Tracking</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {cashbacks.map((cb) => (
            <tr key={cb.id}>
              <td>{cb.id}</td>
              <td>{cb.user}</td>
              <td>${cb.amount}</td>
              <td>{cb.status}</td>
              <td>{new Date(cb.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashbackTracking;
