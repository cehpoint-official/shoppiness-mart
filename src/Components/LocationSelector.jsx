import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const LocationSelector = ({ onLocationSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  const detectCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK") {
              const locations = [];

              results.forEach((result) => {
                // Extract city component
                const cityComponent = result.address_components.find(
                  (component) => component.types.includes("locality")
                );

                if (
                  cityComponent &&
                  !locations.some((loc) => loc.city === cityComponent.long_name)
                ) {
                  locations.push({
                    name: cityComponent.long_name,
                    city: cityComponent.long_name,
                    fullLocation: result.formatted_address,
                  });
                }
              });

              // Remove duplicates
              const uniqueLocations = Array.from(
                new Set(locations.map((loc) => loc.name))
              ).map((name) => locations.find((loc) => loc.name === name));

            //   console.log("Detected locations:", uniqueLocations);
              setNearbyLocations(uniqueLocations);
              setCurrentLocation(
                uniqueLocations[0]?.name || "Current Location"
              );
              setLoading(false);
            } else {
              console.error("Geocoder failed due to: " + status);
              setLoading(false);
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    }
  };

  const handleLocationSelect = (location) => {
    // console.log("Selected location:", location);
    onLocationSelect(location);
    setCurrentLocation(location.name);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaMapMarkerAlt className="text-gray-500 mr-2" />
        <span className="text-gray-500">
          {currentLocation || "Select Location"}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-72 bg-white rounded-lg shadow-lg z-50 mt-2">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Select Location</h3>
              <FaTimes
                className="cursor-pointer text-gray-500"
                onClick={() => setIsOpen(false)}
              />
            </div>

            <button
              className="w-full bg-teal-600 text-white rounded-lg py-3 px-4 mb-4 flex items-center justify-center gap-2"
              onClick={detectCurrentLocation}
              disabled={loading}
            >
              <FaMapMarkerAlt />
              {loading ? (
                <span className="animate-pulse">Detecting location...</span>
              ) : (
                <>Auto-detect current location</>
              )}
            </button>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {nearbyLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleLocationSelect(location)}
                >
                  <FaMapMarkerAlt className="text-teal-600" />
                  <span className="text-gray-700">{location.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
