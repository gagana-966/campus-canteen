import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { MapPin, Navigation } from "lucide-react";

interface AddressMapProps {
  onLocationSelect?: (address: string, lat: number, lng: number) => void;
}

// Demo API key - Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Default location: Campus area (example coordinates for a university campus in India)
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // Delhi, India

const CAMPUS_LOCATIONS = [
  { name: "Dormitory Block A", lat: 28.6139, lng: 77.2090 },
  { name: "Library Building", lat: 28.6145, lng: 77.2095 },
  { name: "Main Canteen", lat: 28.6135, lng: 77.2085 },
  { name: "Sports Complex", lat: 28.6150, lng: 77.2100 },
  { name: "Academic Block", lat: 28.6142, lng: 77.2088 },
];

export function AddressMap({ onLocationSelect }: AddressMapProps) {
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_CENTER);
  const [markerPosition, setMarkerPosition] = useState(DEFAULT_CENTER);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        
        // Use reverse geocoding to get address (simplified)
        const address = `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        onLocationSelect?.(address, lat, lng);
      }
    },
    [onLocationSelect]
  );

  const handleQuickLocationSelect = (location: { name: string; lat: number; lng: number }) => {
    setMarkerPosition({ lat: location.lat, lng: location.lng });
    setSelectedLocation({ lat: location.lat, lng: location.lng });
    onLocationSelect?.(location.name, location.lat, location.lng);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition({ lat, lng });
          setSelectedLocation({ lat, lng });
          const address = `Current Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          onLocationSelect?.(address, lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your current location. Please select manually.");
        }
      );
    }
  };

  // If no API key, show placeholder with quick location selection
  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="space-y-4">
        {/* Map Placeholder */}
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <MapPin size={48} className="mx-auto text-orange-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                <strong>Interactive Map Preview</strong>
              </p>
              <p className="text-xs text-gray-500">
                Add your Google Maps API key to enable map functionality
              </p>
            </div>
          </div>
          {/* Simulated map background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="#e5e7eb" />
              <path d="M20,30 Q30,20 40,30 T60,30" stroke="#9ca3af" strokeWidth="0.5" fill="none" />
              <path d="M10,60 Q20,50 30,60 T50,60" stroke="#9ca3af" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="2" fill="#f97316" />
            </svg>
          </div>
        </div>

        {/* Quick Location Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Quick Select Location</label>
            <button
              onClick={handleGetCurrentLocation}
              className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              <Navigation size={14} />
              Use Current Location
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CAMPUS_LOCATIONS.map((location) => (
              <button
                key={location.name}
                onClick={() => handleQuickLocationSelect(location)}
                className="flex items-center gap-2 p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors text-left"
              >
                <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                <span className="text-gray-700">{location.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> To enable full map functionality, add your Google Maps API key in{" "}
            <code className="bg-blue-100 px-1 rounded">AddressMap.tsx</code>
          </p>
        </div>
      </div>
    );
  }

  // Full map implementation with API key
  return (
    <div className="space-y-4">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
          <Map
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={15}
            mapId="campus-canteen-map"
            onClick={handleMapClick}
          >
            <AdvancedMarker position={markerPosition}>
              <Pin background="#f97316" borderColor="#ea580c" glyphColor="#fff" />
            </AdvancedMarker>
          </Map>
        </div>
      </APIProvider>

      {/* Quick Location Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Quick Select Location</label>
          <button
            onClick={handleGetCurrentLocation}
            className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            <Navigation size={14} />
            Use Current Location
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CAMPUS_LOCATIONS.map((location) => (
            <button
              key={location.name}
              onClick={() => handleQuickLocationSelect(location)}
              className="flex items-center gap-2 p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors text-left"
            >
              <MapPin size={16} className="text-orange-500 flex-shrink-0" />
              <span className="text-gray-700">{location.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
