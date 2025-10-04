import React, { useState } from "react";
import DropDown from "../Inputs/DropDown";

// Updated LocationOption interface to match the location object structure
interface LocationProps {
  location: {
    pickupLocationId: string;
    dropoffLocationId: string;
  };
  setLocation: React.Dispatch<React.SetStateAction<{
    pickupLocationId: string;
    dropoffLocationId: string;
  }>>;
  locations: LocationOption[];
  allowedLocationIds: string[];
}

export interface LocationOption {
  locationId: string; 
  locationName: string;
  locationAddress: string;
  locationImageUrl: string;
}

const Location: React.FC<LocationProps> = ({ location, setLocation, locations, allowedLocationIds }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    field: "pickupLocationId" | "dropoffLocationId",
    value: string
  ) => {
    setLocation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getLocationDetails = (id: string) => {
    return locations.find((loc) => loc.locationId === id);
  };

  const pickup = getLocationDetails(location.pickupLocationId);
  const dropoff = getLocationDetails(location.dropoffLocationId);

  // Filtering locations based on allowedLocationIds using _id
  const filteredLocations = locations.filter((loc) =>
    allowedLocationIds.includes(loc.locationId)
  );

  return (
    <>
      <h2 className="text-2xl font-semibold mb-3">Location</h2>
      <div className="mb-6 border-[2px] border-black p-3 rounded-md relative">
        <button
          className="absolute top-3 right-3 text-black text-sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Done" : "Change"}
        </button>

        <div className="mb-4">
          <p className="text-gray-400 text-xs">Pick-up location:</p>
          {isEditing ? (
            <div className="p-2">
              <DropDown
                label=""
                options={filteredLocations.map(location => ({
                  value: location.locationId,  // Using locationId for dropdown value
                  label: location.locationName,  // Display the location name
                }))}
                placeholder={
                  pickup?.locationName || "Select a location"
                }
                onchange={value => handleChange("pickupLocationId", value[0])}
              />
            </div>
          ) : (
            <p className="text-lg">{pickup?.locationName}</p>
          )}
        </div>

        <div>
          <p className="text-gray-400 text-xs">Drop-off location:</p>
          {isEditing ? (
            <div className="p-2">
              <DropDown
                label=""
                options={filteredLocations.map(location => ({
                  value: location.locationId,  // Using locationId for dropdown value
                  label: location.locationName,  // Display the location name
                }))}
                placeholder={
                  dropoff?.locationName || "Select a location"
                }
                onchange={value => handleChange("dropoffLocationId", value[0])}
              />
            </div>
          ) : (
            <p className="text-lg">{dropoff?.locationName}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Location;
