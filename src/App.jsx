import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Contexts/ThemeContext';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import SOSRequest from './pages/SOSRequest';
import Map from './pages/SOSMap';
import Shelters from './pages/Shelters';
import Volunteer from './pages/Volunteer';
import SOSTools from './pages/SOSTools';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sos" element={<SOSRequest />} />
            <Route path="/volunteers" element={<Map />} />
            {/* <Route path="/volunteer" element={<Volunteer />} /> */}
            <Route path="/shelters" element={<Shelters />} />
            <Route path="/sos-tools" element={<SOSTools />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
