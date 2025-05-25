# 🆘 Saarthi - AI-Powered Disaster Relief Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Firebase-9.0-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet" alt="Leaflet" />
</div>

<div align="center">
  <h3>🌟 Your AI-powered companion in times of need 🌟</h3>
  <p><em>Revolutionizing emergency response coordination during natural disasters</em></p>
</div>

---

## 🚀 About Saarthi

Saarthi is a cutting-edge disaster relief platform designed to bridge the communication gap during emergencies like floods, earthquakes, and cyclones. Our platform serves as a unified coordination hub connecting disaster victims, volunteers, NGOs, and authorities to ensure rapid, efficient relief operations.

**Mission:** To make disaster relief more accessible, coordinated, and effective through technology.

## ✨ Key Features

### 🆘 **Emergency SOS System**
- **Quick Request Submission:** Submit emergency requests with detailed information and precise GPS coordinates
- **Real-time Location Sharing:** Automatic location detection for faster response times
- **Urgency Classification:** Color-coded priority system (Critical, High, Medium, Low)
- **Multi-format Support:** Text descriptions, contact information, and issue categorization

### 👥 **Volunteer Coordination**
- **Live Dashboard:** Real-time volunteer interface to view and respond to nearby emergencies
- **Skill-based Matching:** Connect volunteers with relevant expertise to specific incidents
- **Phone Verification:** Secure volunteer registration with verified contact information
- **Response Tracking:** Monitor volunteer availability and response status

### 🗺️ **Interactive Mapping**
- **Live Incident Map:** Real-time visualization of active emergencies with pulsating urgency indicators
- **Shelter Locator:** Comprehensive database of emergency shelters and relief centers across India
- **Route Integration:** Direct Google Maps integration for navigation to incident locations
- **Geospatial Filtering:** Filter incidents by location, urgency, and type

### 🛠️ **Emergency Toolkit**
- **SOS Siren:** Audio alert system to attract attention during emergencies
- **Emergency Flashlight:** Camera flash or screen-based signaling tool
- **Audio Recording:** Record distress calls or evidence for emergency situations
- **Emergency Timer:** Automatic alert system with countdown functionality
- **Fake Emergency Call:** Safety feature to escape dangerous situations
- **Quick Emergency Contacts:** One-tap access to police, ambulance, fire, and disaster relief services

### 📱 **Smart Features**
- **Auto-location Detection:** GPS-based location sharing for precise emergency response
- **Real-time Updates:** Live data synchronization across all platform components
- **Offline Capability:** Essential features work even with limited connectivity
- **Mobile-first Design:** Optimized for smartphones and emergency situations

### 🌐 **Live Disaster Alerts**
- **Real-time Monitoring:** Integration with USGS earthquake data and weather services
- **Multi-source Aggregation:** Combines data from various disaster monitoring agencies
- **Intelligent Filtering:** Location-based and severity-based alert customization
- **Historical Tracking:** Maintain records of past incidents for analysis

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern UI framework with hooks and functional components
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **React Router** - Client-side routing for single-page application

### **Mapping & Geolocation**
- **Leaflet** - Interactive maps with custom markers and popups
- **React Leaflet** - React components for Leaflet integration
- **OpenStreetMap** - Open-source mapping data
- **Nominatim API** - Reverse geocoding for address resolution

### **Backend & Data**
- **Google Apps Script** - Serverless backend for form submissions
- **Google Sheets** - Real-time data storage and management
- **Firebase** - Authentication and real-time database capabilities
- **USGS API** - Live earthquake and geological data

### **APIs & Services**
- **Geolocation API** - Browser-based location services
- **Web Audio API** - Emergency siren and audio features
- **MediaRecorder API** - Audio recording functionality
- **Vibration API** - Device haptic feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with geolocation support
- Internet connection for real-time features

### Installation

1. **Clone the repository**
  - git clone https://github.com/yourusername/saarthi.git
  - cd saarthi
  
2. **Install dependencies**
 - npm install

3. **Set up environment variables**
Create .env file in root directory

VITE_GOOGLE_SHEET_CSV_URL=your_google_sheets_csv_url
VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_url

4. **Start development server**

npm run dev

5. **Open your browser and see**


### Build for Production
npm run build
npm run preview


## 📱 Usage

### For Emergency Victims
1. **Submit SOS Request:** Use the emergency form to request immediate assistance
2. **Share Location:** Allow GPS access for precise location sharing
3. **Use Emergency Tools:** Access siren, flashlight, and communication tools
4. **Contact Services:** Quick dial emergency numbers (100, 101, 108, 112)

### For Volunteers
1. **Register:** Complete volunteer registration with skill verification
2. **Monitor Dashboard:** View real-time emergency requests in your area
3. **Respond to Incidents:** Accept and respond to emergency requests
4. **Navigate to Location:** Use integrated maps to reach incident sites

### For Administrators
1. **Monitor Operations:** Track all emergency requests and responses
2. **Manage Resources:** Coordinate volunteer deployment and resource allocation
3. **Analyze Data:** Review incident patterns and response effectiveness

## 🌟 Project Structure

saarthi/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Main application pages
│ ├── contexts/ # React context providers
│ ├── hooks/ # Custom React hooks
│ ├── utils/ # Utility functions
│ └── styles/ # Global styles and themes
├── public/ # Static assets
├── docs/ # Documentation
└── README.md # Project documentation



## 🤝 Contributing

We welcome contributions from developers, disaster management experts, and community volunteers!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution
- 🐛 Bug fixes and performance improvements
- 🌟 New emergency tools and features
- 🌍 Internationalization and localization
- 📱 Mobile app development
- 🔒 Security enhancements
- 📊 Analytics and reporting features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **USGS** for providing real-time earthquake data
- **OpenStreetMap** community for mapping data
- **Emergency services** personnel for their invaluable feedback
- **Open source community** for the amazing tools and libraries

## 📞 Emergency Contacts

**India Emergency Numbers:**
- 🚔 Police: **100**
- 🚑 Ambulance: **108**
- 🚒 Fire: **101**
- 🆘 Disaster Relief: **1077**
- 📞 Universal Emergency: **112**

## 📧 Contact & Support

- **Project Lead:** [Your Name](mailto:your.email@example.com)
- **Issues:** [GitHub Issues](https://github.com/yourusername/saarthi/issues)
- **Documentation:** [Project Wiki](https://github.com/yourusername/saarthi/wiki)

---

<div align="center">
  <h3>🌟 Stay Safe, Stay Connected with Saarthi 🌟</h3>
  <p><em>Together, we make disaster relief more efficient and accessible</em></p>
  
  **Made with ❤️ for humanity**
</div>



