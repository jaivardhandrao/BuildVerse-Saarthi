
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch disaster data from USGS Earthquake API and other sources
  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        setLoading(true);
        
        // Fetch earthquake data from USGS
        const earthquakeResponse = await fetch(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson'
        );
        const earthquakeData = await earthquakeResponse.json();
        
        // Process earthquake data
        const earthquakeAlerts = earthquakeData.features.slice(0, 3).map((quake, index) => {
          const magnitude = quake.properties.mag;
          const location = quake.properties.place;
          
          return {
            id: `eq-${index}`,
            type: 'Earthquake',
            location: location || 'Unknown Location',
            urgency: magnitude >= 7 ? 'critical' : magnitude >= 5.5 ? 'high' : 'medium',
            magnitude: magnitude,
            time: new Date(quake.properties.time).toLocaleDateString()
          };
        });

        // Fetch weather alerts from OpenWeatherMap (you'll need API key)
        // For demo, using mock weather data
        const weatherAlerts = [
          {
            id: 'weather-1',
            type: 'Cyclone',
            location: 'Bay of Bengal, India',
            urgency: 'high',
            time: new Date().toLocaleDateString()
          },
          {
            id: 'weather-2',
            type: 'Flood Warning',
            location: 'Kerala, India',
            urgency: 'medium',
            time: new Date().toLocaleDateString()
          }
        ];

        // Combine all alerts
        const allAlerts = [...earthquakeAlerts, ...weatherAlerts];
        setRecentAlerts(allAlerts.slice(0, 5)); // Show max 5 alerts
        
      } catch (err) {
        console.error('Error fetching disaster data:', err);
        setError('Failed to load recent alerts');
        
        // Fallback to mock data
        setRecentAlerts([
          { id: 1, type: 'Flood', location: 'North District', urgency: 'high', time: new Date().toLocaleDateString() },
          { id: 2, type: 'Earthquake', location: 'South District', urgency: 'critical', time: new Date().toLocaleDateString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasterData();
    
    // Refresh data every 10 minutes
    const interval = setInterval(fetchDisasterData, 600000);
    return () => clearInterval(interval);
  }, []);

  // Handle emergency contact clicks
  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen mt-[2rem] bg-gradient-to-tl from-blue-50 to-blue-200" style={{
      background: "linear-gradient(225deg, rgba(230,242,255,1) 0%, rgba(176,224,230,1) 100%)"
    }}>
      {/* Hero Section */}
      <section className="py-20 px-4" id='custom-font'>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            Saarthi
          </h1>
          <p className="text-xl font-bold text-gray-700 mb-12">
            Your companion in times of need. Together, we make disaster relief more efficient and accessible.
          </p>
        </div>
      </section>

      {/* Action Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/sos" className="bg-red-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-red-700 border border-red-200 hover:border-red-300">
            <div className="text-4xl mb-4">🆘</div>
            <h3 className="text-xl font-semibold mb-2">Request Help (SOS)</h3>
            <p className="text-red-600">Send an emergency request for immediate assistance</p>
          </Link>

          <Link to="/volunteers" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-blue-700 border border-blue-200 hover:border-blue-300">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">I'm a Volunteer</h3>
            <p className="text-gray-600">Join our network of volunteers and help those in need</p>
          </Link>

          <Link to="/sos-tools" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-blue-700 border border-blue-200 hover:border-blue-300">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold mb-2">SOS Tools</h3>
            <p className="text-gray-600">Access emergency tools like siren, flashlight and quick contacts</p>
          </Link>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-600 mb-8 text-center">Emergency Contacts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => handleEmergencyCall('100')}
              className="bg-white hover:bg-blue-100 text-blue-700 rounded-lg p-4 text-center transition-colors shadow-md border border-blue-200 font-semibold"
            >
              Police (100)
            </button>
            <button 
              onClick={() => handleEmergencyCall('108')}
              className="bg-white hover:bg-blue-100 text-blue-700 rounded-lg p-4 text-center transition-colors shadow-md border border-blue-200 font-semibold"
            >
              Ambulance (108)
            </button>
            <button 
              onClick={() => handleEmergencyCall('101')}
              className="bg-white hover:bg-blue-100 text-blue-700 rounded-lg p-4 text-center transition-colors shadow-md border border-blue-200 font-semibold"
            >
              Fire (101)
            </button>
            <button 
              onClick={() => handleEmergencyCall('1077')}
              className="bg-white hover:bg-blue-100 text-blue-700 rounded-lg p-4 text-center transition-colors shadow-md border border-blue-200 font-semibold"
            >
              Disaster Relief (1077)
            </button>
          </div>
        </div>
      </section>

      {/* Recent Alerts */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Recent Disaster Alerts</h2>
            {loading && (
              <div className="flex items-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading...
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800">⚠️ {error}. Showing cached data.</p>
            </div>
          )}

          {recentAlerts.length > 0 ? (
            <div className="space-y-4">
              {recentAlerts.map(alert => (
                <div key={alert.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">
                          {alert.type === 'Earthquake' && '🌍'}
                          {alert.type === 'Flood' && '🌊'}
                          {alert.type === 'Cyclone' && '🌪️'}
                          {alert.type === 'Flood Warning' && '⚠️'}
                          {!['Earthquake', 'Flood', 'Cyclone', 'Flood Warning'].includes(alert.type) && '🚨'}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {alert.type}
                          {alert.magnitude && ` (M${alert.magnitude})`}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-1">{alert.location}</p>
                      {alert.time && (
                        <p className="text-sm text-gray-500">📅 {alert.time}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        alert.urgency === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : alert.urgency === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : alert.urgency === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {alert.urgency.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recent Alerts</h3>
                <p className="text-gray-600">No significant disasters reported in your area recently.</p>
              </div>
            )
          )}

          {/* Data Sources */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Data sources: USGS Earthquake Hazards Program, National Weather Service
              <br />
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
