import React, { useState, useEffect } from "react";

interface Location {
  locationId: string | number;
  locationName: string;
  locationAddress: string;
  locationUrl: string;
}

interface LocationSectionProps {
  locations: Location[];
}

const LocationSection: React.FC<LocationSectionProps> = ({ locations }) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [locationUrl, setLocationUrl] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && locations.length > 0 && !activeId) {
      setActiveId(locations[0].locationId);
      setLocationUrl(locations[0].locationUrl);
    }
  }, [loading, locations, activeId]);

  return (
    <section className="w-full bg-[#fffbf3] py-30 font-sans h-[630px]">
      <h2 className="text-gray-600 mb-6 text-[22px] font-medium text-left">
        (OUR LOCATIONS)
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 h-[calc(630px-70px)]">

        <div className="lg:w-1/3 h-full overflow-y-auto pr-1 space-y-3 scrollbar-hide">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-3 rounded-md bg-gray-200 space-y-2"
              >
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
              </div>
            ))
            : locations.map((data) => (
              <div
                key={data.locationId}
                onClick={() => {
                  console.log(data)
                  setActiveId(data.locationId);
                  setLocationUrl(data.locationUrl);
                }}
                className={`p-3 rounded-md transition cursor-pointer ${data.locationId === activeId
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 border-b border-gray-200"
                  }`}
              >
                <p className="font-semibold text-base">{data.locationName}</p>
                <p className="text-sm">{data.locationAddress}</p>
              </div>
            ))}
        </div>

        {/* Map */}
        <div className="lg:w-2/3 h-full">
          {loading ? (
            <div className="animate-pulse w-full h-full bg-gray-200 rounded-md"></div>
          ) : (
            <iframe
              title="Location Map"
              className="w-full h-full rounded-md"
              frameBorder="0"
              loading="lazy"
              allowFullScreen
              src={locationUrl}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
