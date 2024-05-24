import React, { useEffect, useState } from "react";
import axios from "axios";

const DataFetchingComponent = () => {
  const [data, setData] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const url = "https://inrdeals.com/fetch/stores?token=2c3f5a1662f83d1db90c9441012d4b3ffc21bbfb&id=maa443089855";


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        console.log("Response:", response);
        setData(response); // Set response data correctly
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching from URL:", url);
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Fetched Data</h1>
      <ul>
        {data.map((item) => (
          <div key={item.id}>
            <li>{item.title}</li>
            <p>{item.description}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default DataFetchingComponent;
