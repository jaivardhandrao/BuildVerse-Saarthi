// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTheme } from '../Contexts/ThemeContext';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showCallPopup, setShowCallPopup] = useState(false);
//   const { darkMode, toggleDarkMode } = useTheme();

//   const handleEmergencyClick = () => {
//     setShowCallPopup(true);
//   };

//   const handleCall = () => {
//     window.location.href = 'tel:112';
//     setShowCallPopup(false);
//   };

//   const handleCancel = () => {
//     setShowCallPopup(false);
//   };

//   return (
//     <>
//       <nav className="fixed w-[100vw] top-0 z-1000 bg-white dark:bg-gray-900 shadow-lg border-b-2 border-blue-100 dark:border-blue-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <Link to="/" className="flex-shrink-0 flex items-center">
//                 <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">Saarthi</span>
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors duration-200">Home</Link>
//               <Link to="/shelters" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors duration-200">Nearby Shelters</Link>
//               <Link to="/sos" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors duration-200">SOS</Link>
//               {/* <Link to="/volunteer" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors duration-200">Volunteer</Link> */}
//               <Link to="/volunteers" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors duration-200">For Volunteers</Link>
              
//               {/* Emergency Button - Desktop */}
//               <button
//                 onClick={handleEmergencyClick}
//                 className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 font-semibold px-3 py-1 rounded-full border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-800 transition-colors cursor-pointer"
//               >
//                 Call Emergency: 112
//               </button>
              
//               {/* <button
//                 onClick={toggleDarkMode}
//                 className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
//                 aria-label="Toggle dark mode"
//               >
//                 {darkMode ? '🌞' : '🌙'}
//               </button> */}
//             </div>

//             {/* Mobile menu button */}
//             <div className="md:hidden flex items-center">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 aria-expanded="false"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 {!isMenuOpen ? (
//                   <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 ) : (
//                   <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-blue-50 dark:bg-gray-800 border-t border-blue-100 dark:border-blue-700">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               <Link to="/" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200">Home</Link>
//               <Link to="/shelters" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200">Nearby Shelters</Link>
//               <Link to="/sos" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200">SOS</Link>
//               {/* <Link to="/volunteer" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200">Volunteer</Link> */}
//               <Link to="/volunteers" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200">For Volunteers</Link>
//               {/* Emergency Button - Mobile */}
//               <button
//                 onClick={handleEmergencyClick}
//                 className="block px-3 py-2 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 font-semibold rounded-md border border-red-200 dark:border-red-700 mx-3 hover:bg-red-100 dark:hover:bg-red-800 transition-colors w-full text-left"
//               >
//                 Emergency: 112
//               </button>
              
//               {/* <button
//                 onClick={toggleDarkMode}
//                 className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200"
//               >
//                 {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
//               </button> */}
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Call Confirmation Popup */}
//       {showCallPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
//             <div className="text-center">
//               <div className="text-4xl mb-4">📞</div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
//                 Call Emergency Services?
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 You are about to call <span className="font-semibold text-red-600 dark:text-red-400">112</span> for emergency assistance.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleCancel}
//                   className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCall}
//                   className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold"
//                 >
//                   Call Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;


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
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-orange-400">Saarthi</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-200 hover:text-orange-300 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-orange-300">Home</Link>
              <Link to="/shelters" className="text-slate-200 hover:text-orange-300 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-orange-300">Nearby Shelters</Link>
              <Link to="/sos" className="text-slate-200 hover:text-orange-300 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-orange-300">SOS</Link>
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
              <Link to="/sos" className="block px-3 py-2 text-slate-200 hover:text-orange-300 hover:bg-slate-700 rounded-md font-medium transition-colors duration-200">SOS</Link>
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
