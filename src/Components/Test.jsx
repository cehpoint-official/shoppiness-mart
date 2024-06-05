import React, { useEffect, useState } from "react";
import axios from "axios";

const DataFetchingComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      // const stores = "https://proxy-server-1-qaao.onrender.com/";
      const offers = "https://proxy-server-1-qaao.onrender.com/offers";

      try {
        const response = await axios.get(offers);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        console.error('Error:', error);
      }
      
    };
    
    fetchData();
  }, []);
   console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Fetched Data</h1>
      <ul>
        {/* {data.map((item) => (
            <div key={item.id}>
              <li>{item.title}</li>
              <p>{item.description}</p>
            </div>
          ))} */}
      </ul>
    </div>
  );
};

export default DataFetchingComponent;
