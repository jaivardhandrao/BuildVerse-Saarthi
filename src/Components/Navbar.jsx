
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../Contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleEmergencyClick = () => {
    setShowCallPopup(true);
  };

  const handleCall = () => {
    window.location.href = 'tel:112';
    setShowCallPopup(false);
  };

  const handleCancel = () => {
    setShowCallPopup(false);
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-slate-900 shadow-xl border-b-2 border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img className="h-8 mx-[5px]" src="/public/logo.png" alt="our_logo"/>
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span id='custom-font' className="text-2xl font-bold text-orange-400">Saarthi</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-200 hover:text-orange-300 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-orange-300">Home</Link>
              <Link to="/shelters" className="text-slate-200 hover:text-orange-300 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-orange-300">Nearby Shelters</Link>
              <Link to="/sos" className="text-slate-200 hover:text-orange-300 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-orange-300">Raise SOS</Link>
              <Link to="/volunteers" className="text-slate-200 hover:text-orange-300 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-orange-300">For Volunteers</Link>
              
              {/* Emergency Button - Desktop */}
              <button
                onClick={handleEmergencyClick}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg border-2 border-red-500 hover:bg-red-700 hover:border-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚨 Emergency: 112
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-orange-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-slate-200 hover:text-orange-300 hover:bg-slate-700 rounded-md font-medium transition-colors duration-200">Home</Link>
              <Link to="/shelters" className="block px-3 py-2 text-slate-200 hover:text-orange-300 hover:bg-slate-700 rounded-md font-medium transition-colors duration-200">Nearby Shelters</Link>
              <Link to="/sos" className="block px-3 py-2 text-slate-200 hover:text-orange-300 hover:bg-slate-700 rounded-md font-medium transition-colors duration-200">Raise SOS</Link>
              <Link to="/volunteers" className="block px-3 py-2 text-slate-200 hover:text-orange-300 hover:bg-slate-700 rounded-md font-medium transition-colors duration-200">For Volunteers</Link>
              
              {/* Emergency Button - Mobile */}
              <button
                onClick={handleEmergencyClick}
                className="block px-3 py-2 bg-red-600 text-white font-semibold rounded-md border-2 border-red-500 mx-3 hover:bg-red-700 hover:border-red-600 transition-all duration-200 w-full text-left shadow-lg"
              >
                🚨 Emergency: 112
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Call Confirmation Popup */}
      {showCallPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-sm mx-4 shadow-2xl border border-slate-200">
            <div className="text-center">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Call Emergency Services?
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                You are about to call <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">112</span> for emergency assistance.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCall}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
