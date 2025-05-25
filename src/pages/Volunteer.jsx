import React, { useState } from 'react';

const Volunteer = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [],
    availability: '',
    experience: '',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const skillsList = [
    'First Aid',
    'Search & Rescue',
    'Medical',
    'Counseling',
    'Transportation',
    'Food Distribution',
    'Shelter Management',
    'Communication'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const fetchLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      
      // Extract city, state, country from the response
      const locationParts = [];
      if (data.address) {
        if (data.address.city || data.address.town || data.address.village) {
          locationParts.push(data.address.city || data.address.town || data.address.village);
        }
        if (data.address.state) {
          locationParts.push(data.address.state);
        }
        if (data.address.country) {
          locationParts.push(data.address.country);
        }
      }
      
      return locationParts.length > 0 ? locationParts.join(', ') : 'Location not found';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Location not found';
    }
  };

  const handleLocationDetect = () => {
    setLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = await fetchLocationName(latitude, longitude);
          
          setForm(prev => ({ ...prev, location: locationName }));
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);
          setErrors(prev => ({ ...prev, location: 'Unable to retrieve your location. Please enter manually.' }));
        }
      );
    } else {
      setLoadingLocation(false);
      setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by your browser.' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\+[1-9]\d{1,14}$/.test(form.phone)) newErrors.phone = 'Phone number must include country code (e.g., +1234567890)';
    if (form.skills.length === 0) newErrors.skills = 'Please select at least one skill';
    if (!form.availability) newErrors.availability = 'Please select availability';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    
    if (Object.keys(validation).length === 0) {
      setSubmitted(true);
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-[2rem]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          Become a Volunteer
        </h1>

        {submitted ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-blue-100">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Thank You for Volunteering!
            </h2>
            <p className="text-gray-700">
              We'll review your application and contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
            {/* Name */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.name ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.phone ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                placeholder="Enter phone with country code (+1234567890)"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Skills & Expertise
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {skillsList.map(skill => (
                  <label
                    key={skill}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      form.skills.includes(skill)
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>
              {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
            </div>

            {/* Availability */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Availability
              </label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.availability ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
              >
                <option value="">Select your availability</option>
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>Both</option>
                <option>On Call</option>
              </select>
              {errors.availability && <p className="text-red-600 text-sm mt-1">{errors.availability}</p>}
            </div>

            {/* Experience */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Previous Experience
              </label>
              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Tell us about your previous volunteer experience..."
              />
            </div>

            {/* Location with Auto-detect */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">
                Your Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={`flex-1 p-3 border ${errors.location ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                  placeholder="Enter your city/town or auto-detect"
                />
                <button
                  type="button"
                  onClick={handleLocationDetect}
                  disabled={loadingLocation}
                  className="px-4 py-3 rounded-lg font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200"
                  aria-label="Auto-detect location"
                >
                  {loadingLocation ? 'Detecting...' : '📍 Auto-detect'}
                </button>
              </div>
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Volunteer;
