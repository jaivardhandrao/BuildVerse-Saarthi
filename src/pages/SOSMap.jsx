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

// Create pulsating circle icon based on urgency
const createPulsatingIcon = (urgency) => {
  const getColorConfig = () => {
    switch(urgency?.toLowerCase()) {
      case 'critical': 
        return { 
          color: '#dc2626', 
          bgColor: 'rgba(220, 38, 38, 0.3)',
          pulseClass: 'pulse-critical'
        };
      case 'high': 
        return { 
          color: '#ea580c', 
          bgColor: 'rgba(234, 88, 12, 0.3)',
          pulseClass: 'pulse-high'
        };
      case 'medium': 
        return { 
          color: '#ca8a04', 
          bgColor: 'rgba(202, 138, 4, 0.3)',
          pulseClass: 'pulse-medium'
        };
      case 'low': 
        return { 
          color: '#16a34a', 
          bgColor: 'rgba(22, 163, 74, 0.3)',
          pulseClass: 'pulse-low'
        };
      default: 
        return { 
          color: '#6b7280', 
          bgColor: 'rgba(107, 114, 128, 0.3)',
          pulseClass: 'pulse-default'
        };
    }
  };

  const config = getColorConfig();
  
  const cssStyle = `
    width: 16px;
    height: 16px;
    background: ${config.color};
    border: 2px solid ${config.color};
    border-radius: 50%;
    box-shadow: 0 0 0 0 ${config.bgColor};
  `;

  return L.divIcon({
    html: `<span style="${cssStyle}" class="pulse-marker ${config.pulseClass}"></span>`,
    className: 'custom-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Current location icon (different style)
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

const SOSMap = () => {
  const [sosRequests, setSOSRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const mapRef = useRef(null);

  // Google Sheets CSV URL
  const GOOGLE_SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL;
  // Get current location
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
          
          if (mapRef.current) {
            const map = mapRef.current;
            map.flyTo([newLocation.lat, newLocation.lng], 14, {
              duration: 2,
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

  // Load CSV data from Google Sheets
  useEffect(() => {
    const loadSOSData = async () => {
      try {
        setLoading(true);
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        
        if (!response.ok) {
          throw new Error('Failed to load SOS request data');
        }
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setSOSRequests(parsedData);
        setFilteredRequests(parsedData);
      } catch (err) {
        console.error('Error loading CSV:', err);
        setError('Failed to load SOS request data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSOSData();
    
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadSOSData, 30000);
    return () => clearInterval(interval);
  }, []);

  // CSV Parser function
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    
    return lines.slice(1).map((line, index) => {
      const values = parseCSVLine(line);
      const request = {};
      
      headers.forEach((header, i) => {
        request[header] = values[i] ? values[i].trim().replace(/"/g, '') : '';
      });
      
      // Map the data to our structure
      const lat = parseFloat(request.Latitude);
      const lng = parseFloat(request.Longitude);
      
      // Only include requests with valid coordinates
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        return null;
      }
      
      return {
        id: request.id || index + 1,
        requestTime: request.Request_Time || 'Unknown',
        location: request.Request_Location || 'Location not available',
        lat: lat,
        lng: lng,
        phoneNumber: request.Phone_Number || 'Not available',
        status: request.Status || 'Pending',
        description: request.Description || 'No description',
        urgency: request.Urgency || 'Medium',
        issueType: request.Issue_Type || 'Unknown'
      };
    }).filter(request => request !== null);
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

  // Get unique urgency levels and statuses for filters
  const urgencyLevels = ['All', ...new Set(sosRequests.map(req => req.urgency))];
  const statusTypes = ['All', ...new Set(sosRequests.map(req => req.status))];

  // Filter requests based on selected filters
  useEffect(() => {
    let filtered = sosRequests;
    
    if (filterUrgency !== 'All') {
      filtered = filtered.filter(req => req.urgency === filterUrgency);
    }
    
    if (filterStatus !== 'All') {
      filtered = filtered.filter(req => req.status === filterStatus);
    }
    
    setFilteredRequests(filtered);
  }, [filterUrgency, filterStatus, sosRequests]);

  // Handle marker click - open Google Maps
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${request.lat},${request.lng}&query_place_id=${encodeURIComponent(request.description)}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Map click handler to clear selection
  const MapEvents = () => {
    useMapEvents({
      click: () => {
        setSelectedRequest(null);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Unknown') return 'Unknown';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🆘</div>
          <div className="text-xl font-semibold text-red-600 mb-2">Loading SOS Requests...</div>
          <div className="text-gray-600">Please wait while we fetch emergency requests</div>
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
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Custom CSS for pulsating markers */}
      <style jsx>{`
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        
        .pulse-marker {
          display: block;
          cursor: pointer;
          animation: pulse 2s infinite;
        }
        
        .pulse-critical {
          animation: pulse-critical 1.5s infinite;
        }
        
        .pulse-high {
          animation: pulse-high 1.8s infinite;
        }
        
        .pulse-medium {
          animation: pulse-medium 2.2s infinite;
        }
        
        .pulse-low {
          animation: pulse-low 2.5s infinite;
        }
        
        .pulse-default {
          animation: pulse-default 2s infinite;
        }
        
        @keyframes pulse-critical {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
        
        @keyframes pulse-high {
          0% {
            box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.7);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(234, 88, 12, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(234, 88, 12, 0);
          }
        }
        
        @keyframes pulse-medium {
          0% {
            box-shadow: 0 0 0 0 rgba(202, 138, 4, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(202, 138, 4, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(202, 138, 4, 0);
          }
        }
        
        @keyframes pulse-low {
          0% {
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(22, 163, 74, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
          }
        }
        
        @keyframes pulse-default {
          0% {
            box-shadow: 0 0 0 0 rgba(107, 114, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(107, 114, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(107, 114, 128, 0);
          }
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          padding: 0;
          max-width: 320px;
          min-width: 280px;
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
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Live SOS Requests Map
          </h1>
          <p className="text-gray-700 text-lg">
            Real-time emergency requests which you can serve. Red = Critical, Orange = High, Yellow = Medium, Green = Low urgency.
          </p>
        </div>

        {/* Filters and Current Location */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filter by Urgency
              </label>
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                {urgencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredRequests.length}
              </div>
              <div className="text-gray-600">
                Active Requests
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
              center={[20.5937, 78.9629]} // Center of India
              zoom={5}
              style={{ height: '100%', width: '100%' ,zIndex: 1  }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapEvents />
              <MapController />
              
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
              
              {/* SOS Request Markers with Pulsating Circles */}
              {filteredRequests.map((request) => (
                <Marker
                  key={request.id}
                  position={[request.lat, request.lng]}
                  icon={createPulsatingIcon(request.urgency)}
                  eventHandlers={{
                    click: () => handleRequestClick(request),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">
                          SOS Request #{request.id}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          request.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                          request.urgency === 'High' ? 'bg-orange-100 text-orange-700' :
                          request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          request.urgency === 'Low' ? 'bg-green-100 text-green-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {request.urgency}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-start">
                          <span className="text-gray-400 mr-2">🕒</span>
                          <span className="flex-1">{formatDate(request.requestTime)}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 mr-2">📍</span>
                          <span className="flex-1">{request.location}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">📞</span>
                          <span>{request.phoneNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">📋</span>
                          <span>{request.issueType}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 mr-2">💬</span>
                          <span className="flex-1">{request.description}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">🚨</span>
                          <span className={`font-semibold ${
                            request.status === 'Pending' ? 'text-yellow-600' :
                            request.status === 'Resolved' ? 'text-green-600' :
                            'text-blue-600'
                          }`}>{request.status}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRequestClick(request)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
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
        {/* Request List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-red-600 mb-6">Active SOS Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`bg-white rounded-lg shadow-md p-6 border transition-all cursor-pointer hover:shadow-lg ${
                  selectedRequest?.id === request.id
                    ? 'border-red-500 ring-2 ring-red-200'
                    : 'border-gray-200 hover:border-red-300'
                }`}
                onClick={() => handleRequestClick(request)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Request #{request.id}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    request.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                    request.urgency === 'High' ? 'bg-orange-100 text-orange-700' :
                    request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    request.urgency === 'Low' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {request.urgency}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">🕒</span> {formatDate(request.requestTime)}</p>
                  <p><span className="font-medium">📍</span> {request.location}</p>
                  <p><span className="font-medium">📞</span> {request.phoneNumber}</p>
                  <p><span className="font-medium">📋</span> {request.issueType}</p>
                  <p><span className="font-medium">💬</span> {request.description}</p>
                  <p><span className="font-medium">🚨</span> 
                    <span className={`ml-1 font-semibold ${
                      request.status === 'Pending' ? 'text-yellow-600' :
                      request.status === 'Resolved' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>{request.status}</span>
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestClick(request);
                  }}
                  className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                >
                  View on Google Maps
                </button>
              </div>
            ))}
          </div>
        </div>

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

export default SOSMap;

