// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom shelter icon (smaller and more aesthetic)
// const shelterIcon = new L.Icon({
//   iconUrl: 'data:image/svg+xml;base64,' + btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="24" height="24">
//       <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
//     </svg>
//   `),
//   iconSize: [24, 24],
//   iconAnchor: [12, 24],
//   popupAnchor: [0, -24],
// });

// // Current location icon (different color and style)
// const currentLocationIcon = new L.Icon({
//   iconUrl: 'data:image/svg+xml;base64,' + btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="24" height="24">
//       <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
//       <circle cx="12" cy="12" r="3" fill="white"/>
//     </svg>
//   `),
//   iconSize: [20, 20],
//   iconAnchor: [10, 10],
//   popupAnchor: [0, -10],
// });

// const Shelters = () => {
//   const [shelterData, setShelterData] = useState([]);
//   const [filteredShelters, setFilteredShelters] = useState([]);
//   const [selectedShelter, setSelectedShelter] = useState(null);
//   const [filterType, setFilterType] = useState('All');
//   const [filterState, setFilterState] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(false);

//   // Get current location
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//           setLocationLoading(false);
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//           setLocationLoading(false);
//           alert('Unable to get your current location');
//         }
//       );
//     } else {
//       setLocationLoading(false);
//       alert('Geolocation is not supported by this browser');
//     }
//   };

//   // Load CSV data
//   useEffect(() => {
//     const loadCSVData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/shelters_data.csv');
        
//         if (!response.ok) {
//           throw new Error('Failed to load shelter data');
//         }
        
//         const csvText = await response.text();
//         const parsedData = parseCSV(csvText);
//         setShelterData(parsedData);
//         setFilteredShelters(parsedData);
//       } catch (err) {
//         console.error('Error loading CSV:', err);
//         setError('Failed to load shelter data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCSVData();
//   }, []);

//   // CSV Parser function
//   const parseCSV = (csvText) => {
//     const lines = csvText.trim().split('\n');
//     const headers = lines[0].split(',').map(header => header.trim());
    
//     return lines.slice(1).map((line, index) => {
//       const values = parseCSVLine(line);
//       const shelter = {};
      
//       headers.forEach((header, i) => {
//         shelter[header] = values[i] ? values[i].trim() : '';
//       });
      
//       return {
//         id: index + 1,
//         name: shelter.ngo_shelter_name || 'Unknown Shelter',
//         lat: parseFloat(shelter.latitude) || 0,
//         lng: parseFloat(shelter.longitude) || 0,
//         address: shelter.address || 'Address not available',
//         capacity: parseInt(shelter.capacity) || 0,
//         type: shelter.shelter_type || 'Emergency Shelter',
//         state: shelter.state || 'Unknown',
//         city: shelter.city || 'Unknown',
//         phone: shelter.phone || 'Not available',
//         email: shelter.email || 'Not available',
//         services: shelter.services_offered || 'General assistance'
//       };
//     }).filter(shelter => shelter.lat !== 0 && shelter.lng !== 0);
//   };

//   // Helper function to parse CSV line with proper comma handling
//   const parseCSVLine = (line) => {
//     const result = [];
//     let current = '';
//     let inQuotes = false;
    
//     for (let i = 0; i < line.length; i++) {
//       const char = line[i];
      
//       if (char === '"') {
//         inQuotes = !inQuotes;
//       } else if (char === ',' && !inQuotes) {
//         result.push(current);
//         current = '';
//       } else {
//         current += char;
//       }
//     }
    
//     result.push(current);
//     return result;
//   };

//   // Get unique states and shelter types for filters
//   const states = ['All', ...new Set(shelterData.map(shelter => shelter.state))];
//   const shelterTypes = ['All', ...new Set(shelterData.map(shelter => shelter.type))];

//   // Filter shelters based on selected filters
//   useEffect(() => {
//     let filtered = shelterData;
    
//     if (filterType !== 'All') {
//       filtered = filtered.filter(shelter => shelter.type === filterType);
//     }
    
//     if (filterState !== 'All') {
//       filtered = filtered.filter(shelter => shelter.state === filterState);
//     }
    
//     setFilteredShelters(filtered);
//   }, [filterType, filterState, shelterData]);

//   // Handle marker click - open Google Maps
//   const handleShelterClick = (shelter) => {
//     setSelectedShelter(shelter);
//     const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${shelter.lat},${shelter.lng}&query_place_id=${encodeURIComponent(shelter.name)}`;
//     window.open(googleMapsUrl, '_blank');
//   };

//   // Map click handler to clear selection
//   const MapEvents = () => {
//     useMapEvents({
//       click: () => {
//         setSelectedShelter(null);
//       },
//     });
//     return null;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-4xl mb-4">🏠</div>
//           <div className="text-xl font-semibold text-blue-600 mb-2">Loading Shelter Data...</div>
//           <div className="text-gray-600">Please wait while we fetch shelter information</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
//           <div className="text-4xl mb-4">❌</div>
//           <div className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</div>
//           <div className="text-gray-600 mb-4">{error}</div>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       {/* Custom CSS for popup styling */}
//       <style jsx>{`
//         .custom-popup .leaflet-popup-content-wrapper {
//           background: white;
//           border-radius: 8px;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
//           border: 1px solid #e5e7eb;
//           padding: 0;
//           max-width: 280px;
//           min-width: 250px;
//         }
        
//         .custom-popup .leaflet-popup-content {
//           margin: 0;
//           padding: 0;
//         }
        
//         .custom-popup .leaflet-popup-tip {
//           background: white;
//           border: 1px solid #e5e7eb;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//         }
        
//         .current-location-popup .leaflet-popup-content-wrapper {
//           background: #3b82f6;
//           color: white;
//           border-radius: 8px;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//           border: 2px solid #1d4ed8;
//           max-width: 200px;
//         }
        
//         .current-location-popup .leaflet-popup-tip {
//           background: #3b82f6;
//           border: 2px solid #1d4ed8;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-blue-600 mb-4">
//             Emergency Shelters Across India
//           </h1>
//           <p className="text-gray-700 text-lg">
//             Find nearby emergency shelters and relief centers. Click on any marker to open location in Google Maps.
//           </p>
//         </div>

//         {/* Filters and Current Location */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Filter by Type
//               </label>
//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//               >
//                 {shelterTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Filter by State
//               </label>
//               <select
//                 value={filterState}
//                 onChange={(e) => setFilterState(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//               >
//                 {states.map(state => (
//                   <option key={state} value={state}>{state}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="text-center">
//               <div className="text-2xl font-bold text-blue-600">
//                 {filteredShelters.length}
//               </div>
//               <div className="text-gray-600">
//                 Shelters Available
//               </div>
//             </div>

//             <div className="text-center">
//               <button
//                 onClick={getCurrentLocation}
//                 disabled={locationLoading}
//                 className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
//                   locationLoading
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//               >
//                 {locationLoading ? '📍 Finding...' : '📍 My Location'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Map Container */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
//           <div style={{ height: '600px', width: '100%' }}>
//             <MapContainer
//               center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [20.5937, 78.9629]}
//               zoom={currentLocation ? 10 : 5}
//               style={{ height: '100%', width: '100%' }}
//               scrollWheelZoom={true}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
              
//               <MapEvents />
              
//               {/* Current Location Marker */}
//               {currentLocation && (
//                 <Marker
//                   position={[currentLocation.lat, currentLocation.lng]}
//                   icon={currentLocationIcon}
//                 >
//                   <Popup className="current-location-popup">
//                     <div className="p-3 text-center">
//                       <div className="font-bold text-lg mb-1">📍 Your Location</div>
//                       <div className="text-sm">You are here</div>
//                     </div>
//                   </Popup>
//                 </Marker>
//               )}
              
//               {/* Shelter Markers */}
//               {filteredShelters.map((shelter) => (
//                 <Marker
//                   key={shelter.id}
//                   position={[shelter.lat, shelter.lng]}
//                   icon={shelterIcon}
//                   eventHandlers={{
//                     click: () => handleShelterClick(shelter),
//                   }}
//                 >
//                   <Popup className="custom-popup">
//                     <div className="p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-bold text-gray-800 text-lg leading-tight">
//                           {shelter.name}
//                         </h3>
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           shelter.type === 'Emergency Shelter' ? 'bg-red-100 text-red-700' :
//                           shelter.type === 'Medical Care' ? 'bg-green-100 text-green-700' :
//                           shelter.type === 'Food' ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-blue-100 text-blue-700'
//                         }`}>
//                           {shelter.type}
//                         </span>
//                       </div>
                      
//                       <div className="space-y-2 text-sm text-gray-600 mb-4">
//                         <div className="flex items-start">
//                           <span className="text-gray-400 mr-2">📍</span>
//                           <span className="flex-1">{shelter.address}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="text-gray-400 mr-2">🏛️</span>
//                           <span>{shelter.city}, {shelter.state}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="text-gray-400 mr-2">👥</span>
//                           <span>Capacity: {shelter.capacity} people</span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="text-gray-400 mr-2">📞</span>
//                           <span>{shelter.phone}</span>
//                         </div>
//                       </div>
                      
//                       <button
//                         onClick={() => handleShelterClick(shelter)}
//                         className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
//                       >
//                         Open in Google Maps
//                       </button>
//                     </div>
//                   </Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>
//         </div>


//         {/* Emergency Contact */}
//         <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-200">
//           <div className="text-center">
//             <h3 className="text-xl font-bold text-red-600 mb-2">
//               Emergency Contact
//             </h3>
//             <p className="text-gray-700 mb-4">
//               For immediate assistance, contact the National Disaster Response Force
//             </p>
//             <a
//               href="tel:112"
//               className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
//             >
//               Call 112 - Emergency Services
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Shelters;

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom shelter icon (smaller and more aesthetic)
const shelterIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="24" height="24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

// Current location icon (different color and style)
const currentLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

const Shelters = () => {
  const [shelterData, setShelterData] = useState([]);
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const mapRef = useRef(null); // Add map reference

  // Get current location with automatic zoom
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCurrentLocation(newLocation);
          setLocationLoading(false);
          
          // Automatically zoom to current location with smooth animation
          if (mapRef.current) {
            const map = mapRef.current;
            map.flyTo([newLocation.lat, newLocation.lng], 14, {
              duration: 2, // Animation duration in seconds
              easeLinearity: 0.25
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Unable to get your current location');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocation is not supported by this browser');
    }
  };

  // Load CSV data
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/shelters_data.csv');
        
        if (!response.ok) {
          throw new Error('Failed to load shelter data');
        }
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setShelterData(parsedData);
        setFilteredShelters(parsedData);
      } catch (err) {
        console.error('Error loading CSV:', err);
        setError('Failed to load shelter data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCSVData();
  }, []);

  // CSV Parser function
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).map((line, index) => {
      const values = parseCSVLine(line);
      const shelter = {};
      
      headers.forEach((header, i) => {
        shelter[header] = values[i] ? values[i].trim() : '';
      });
      
      return {
        id: index + 1,
        name: shelter.ngo_shelter_name || 'Unknown Shelter',
        lat: parseFloat(shelter.latitude) || 0,
        lng: parseFloat(shelter.longitude) || 0,
        address: shelter.address || 'Address not available',
        capacity: parseInt(shelter.capacity) || 0,
        type: shelter.shelter_type || 'Emergency Shelter',
        state: shelter.state || 'Unknown',
        city: shelter.city || 'Unknown',
        phone: shelter.phone || 'Not available',
        email: shelter.email || 'Not available',
        services: shelter.services_offered || 'General assistance'
      };
    }).filter(shelter => shelter.lat !== 0 && shelter.lng !== 0);
  };

  // Helper function to parse CSV line with proper comma handling
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  // Get unique states and shelter types for filters
  const states = ['All', ...new Set(shelterData.map(shelter => shelter.state))];
  const shelterTypes = ['All', ...new Set(shelterData.map(shelter => shelter.type))];

  // Filter shelters based on selected filters
  useEffect(() => {
    let filtered = shelterData;
    
    if (filterType !== 'All') {
      filtered = filtered.filter(shelter => shelter.type === filterType);
    }
    
    if (filterState !== 'All') {
      filtered = filtered.filter(shelter => shelter.state === filterState);
    }
    
    setFilteredShelters(filtered);
  }, [filterType, filterState, shelterData]);

  // Handle marker click - open Google Maps
  const handleShelterClick = (shelter) => {
    setSelectedShelter(shelter);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${shelter.lat},${shelter.lng}&query_place_id=${encodeURIComponent(shelter.name)}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Map click handler to clear selection
  const MapEvents = () => {
    useMapEvents({
      click: () => {
        setSelectedShelter(null);
      },
    });
    return null;
  };

  // Component to handle map reference
  const MapController = () => {
    const map = useMapEvents({});
    
    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏠</div>
          <div className="text-xl font-semibold text-blue-600 mb-2">Loading Shelter Data...</div>
          <div className="text-gray-600">Please wait while we fetch shelter information</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Custom CSS for popup styling */}
      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          padding: 0;
          max-width: 280px;
          min-width: 250px;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .current-location-popup .leaflet-popup-content-wrapper {
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid #1d4ed8;
          max-width: 200px;
        }
        
        .current-location-popup .leaflet-popup-tip {
          background: #3b82f6;
          border: 2px solid #1d4ed8;
        }
      `}</style>

      <div className="max-w-7xl mx-auto mt-[5rem]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Emergency Shelters Across India
          </h1>
          <p className="text-gray-700 text-lg">
            Find nearby emergency shelters and relief centers. Click on any marker to open location in Google Maps.
          </p>
        </div>

        {/* Filters and Current Location */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {shelterTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filter by State
              </label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredShelters.length}
              </div>
              <div className="text-gray-600">
                Shelters Available
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                  locationLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {locationLoading ? '📍 Finding...' : '📍 My Location'}
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div style={{ height: '600px', width: '100%' }}>
            <MapContainer
              center={[20.5937, 78.9629]} // Always start with India center
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapEvents />
              <MapController /> {/* Add map controller to get map reference */}
              
              {/* Current Location Marker */}
              {currentLocation && (
                <Marker
                  position={[currentLocation.lat, currentLocation.lng]}
                  icon={currentLocationIcon}
                >
                  <Popup className="current-location-popup">
                    <div className="p-3 text-center">
                      <div className="font-bold text-lg mb-1">📍 Your Location</div>
                      <div className="text-sm">You are here</div>
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Shelter Markers */}
              {filteredShelters.map((shelter) => (
                <Marker
                  key={shelter.id}
                  position={[shelter.lat, shelter.lng]}
                  icon={shelterIcon}
                  eventHandlers={{
                    click: () => handleShelterClick(shelter),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">
                          {shelter.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          shelter.type === 'Emergency Shelter' ? 'bg-red-100 text-red-700' :
                          shelter.type === 'Medical Care' ? 'bg-green-100 text-green-700' :
                          shelter.type === 'Food' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {shelter.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-start">
                          <span className="text-gray-400 mr-2">📍</span>
                          <span className="flex-1">{shelter.address}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">🏛️</span>
                          <span>{shelter.city}, {shelter.state}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">👥</span>
                          <span>Capacity: {shelter.capacity} people</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">📞</span>
                          <span>{shelter.phone}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleShelterClick(shelter)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Open in Google Maps
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Rest of your component remains the same... */}
        {/* Shelter List */}
        {/* <div className="mt-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Available Shelters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShelters.map((shelter) => (
              <div
                key={shelter.id}
                className={`bg-white rounded-lg shadow-md p-6 border transition-all cursor-pointer hover:shadow-lg ${
                  selectedShelter?.id === shelter.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleShelterClick(shelter)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {shelter.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    shelter.type === 'Emergency Shelter' ? 'bg-red-100 text-red-700' :
                    shelter.type === 'Medical Care' ? 'bg-green-100 text-green-700' :
                    shelter.type === 'Food' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {shelter.type}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">📍</span> {shelter.address}</p>
                  <p><span className="font-medium">🏛️</span> {shelter.city}, {shelter.state}</p>
                  <p><span className="font-medium">👥</span> Capacity: {shelter.capacity} people</p>
                  <p><span className="font-medium">📞</span> {shelter.phone}</p>
                  <p><span className="font-medium">🛠️</span> {shelter.services}</p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShelterClick(shelter);
                  }}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  View on Google Maps
                </button>
              </div>
            ))}
          </div>
        </div> */}

        {/* Emergency Contact */}
        <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-600 mb-2">
              Emergency Contact
            </h3>
            <p className="text-gray-700 mb-4">
              For immediate assistance, contact the National Disaster Response Force
            </p>
            <a
              href="tel:112"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Call 112 - Emergency Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shelters;

