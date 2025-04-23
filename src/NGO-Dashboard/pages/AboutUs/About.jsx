import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

const About = () => {
  const { id } = useParams();
  const [causeData, setCauseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCauseDetails = async () => {
      try {
        if (!id) {
          setError("No cause ID provided");
          setLoading(false);
          return;
        }

        const causeDocRef = doc(db, "causeDetails", id);
        const causeSnapshot = await getDoc(causeDocRef);
        
        if (causeSnapshot.exists()) {
          setCauseData(causeSnapshot.data());
        } else {
          setError("Cause not found");
        }
      } catch (err) {
        console.error("Error fetching cause details:", err);
        setError("Failed to load cause details");
      } finally {
        setLoading(false);
      }
    };

    fetchCauseDetails();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center">
        <p className="text-xl">Loading cause details...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-2xl mb-10">About This Cause</h1>
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="text-red-500">{error}</p>
          <div className="mt-8">
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-700 underline text-xl"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-10">About This Cause</h1>
      <div className="px-4 sm:px-6 lg:px-8">
        <div 
          className="mt-8 text-xl"
          dangerouslySetInnerHTML={{ __html: causeData?.aboutCause || "" }}
        />
      </div>
    </div>
  );
};

export default About;