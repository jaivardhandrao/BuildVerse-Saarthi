import React, { useState } from 'react';

const initialState = {
  issueType: '',
  description: '',
  contact: '',
  urgency: '',
  location: null,
  address: '',
};

const SOSRequest = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const validate = () => {
    const newErrors = {};
    if (!form.issueType) newErrors.issueType = 'Please select an issue type.';
    if (!form.description) newErrors.description = 'Description is required.';
    if (!form.contact) newErrors.contact = 'Contact number is required.';
    else if (!/^\d{10,}$/.test(form.contact)) newErrors.contact = 'Enter a valid contact number.';
    if (!form.urgency) newErrors.urgency = 'Please select urgency.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle issue type selection (like skills in volunteer form)
  const handleIssueTypeSelect = (issueType) => {
    setForm(prev => ({ ...prev, issueType }));
  };

  const fetchAddress = async (lat, lon) => {
    setAddressLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      setForm((prev) => ({ ...prev, address: data.display_name || 'Address not found' }));
    } catch (err) {
      setForm((prev) => ({ ...prev, address: 'Address not found' }));
    } finally {
      setAddressLoading(false);
    }
  };

  const handleLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({ ...prev, location: pos.coords }));
          setLoadingLocation(false);
          fetchAddress(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setLoadingLocation(false);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      setLoadingLocation(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    
    if (Object.keys(validation).length === 0) {
      setSubmitting(true);
      
      try {
        const formData = new FormData();
        formData.append('issueType', form.issueType);
        formData.append('description', form.description);
        formData.append('contact', form.contact);
        formData.append('urgency', form.urgency);
        formData.append('latitude', form.location?.latitude || '');
        formData.append('longitude', form.location?.longitude || '');
        formData.append('address', form.address || 'Not provided');

        console.log('Submitting data...');

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        console.log('Response:', result);
        
        if (result.result === 'success') {
          setSubmitted(true);
          console.log('SOS request submitted successfully with ID:', result.id);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
        
      } catch (error) {
        console.error('Error submitting SOS request:', error);
        setErrors({ submit: 'Failed to submit request. Please check your connection and try again.' });
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Issue types list
  const issueTypes = [
    { name: 'Medical Emergency', icon: '🚑' },
    { name: 'Food/Water', icon: '🍽️' },
    { name: 'Shelter', icon: '🏠' },
    { name: 'Rescue', icon: '🆘' },
    { name: 'Other', icon: '❓' }
  ];

  return (
    <div className="pt-[5rem] min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Send SOS Request</h2>
        
        {submitted ? (
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <div className="text-green-600 font-semibold bg-green-50 p-4 rounded-lg border border-green-200">
              Your SOS request has been sent successfully!
            </div>
            <p className="text-gray-600 mt-4">
              Emergency services have been notified. Help is on the way.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm(initialState);
                setErrors({});
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Issue Type</label>
              <div className="grid grid-cols-2 gap-3">
                {issueTypes.map(issue => (
                  <label
                    key={issue.name}
                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
                      form.issueType === issue.name
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-red-50'
                    }`}
                    onClick={() => handleIssueTypeSelect(issue.name)}
                  >
                    <input
                      type="radio"
                      name="issueType"
                      value={issue.name}
                      checked={form.issueType === issue.name}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-lg">{issue.icon}</span>
                    <span className="text-sm font-medium">{issue.name}</span>
                  </label>
                ))}
              </div>
              {errors.issueType && <p className="text-red-600 text-sm mt-1">{errors.issueType}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border ${errors.description ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                placeholder="Describe the situation..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
              <input
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.contact ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                placeholder="Enter your phone number"
              />
              {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Urgency Level</label>
              <div className="flex flex-wrap gap-4">
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <label key={level} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={form.urgency === level}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm font-semibold ${
                      level === 'Critical' ? 'text-red-600' :
                      level === 'High' ? 'text-orange-600' :
                      level === 'Medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>{level}</span>
                  </label>
                ))}
              </div>
              {errors.urgency && <p className="text-red-600 text-sm mt-1">{errors.urgency}</p>}
            </div>


            <div className="mb-6">
              <button
                type="button"
                onClick={handleLocation}
                className="px-6 py-3 rounded-lg font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200"
                aria-label="Detect location"
                disabled={loadingLocation}
              >
                {loadingLocation ? 'Detecting location...' : 'Auto-detect Location'}
              </button>
              {form.location && (
                <div className="mt-2 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="font-semibold">Latitude:</span> {form.location.latitude.toFixed(4)}<br />
                  <span className="font-semibold">Longitude:</span> {form.location.longitude.toFixed(4)}
                  {addressLoading ? (
                    <div className="mt-1 text-blue-600">Fetching address...</div>
                  ) : form.address ? (
                    <div className="mt-1 text-gray-600">{form.address}</div>
                  ) : null}
                </div>
              )}
            </div>


            {errors.submit && (
              <div className="mb-4 text-red-600 text-center font-semibold bg-red-50 p-4 rounded-lg border border-red-200">
                {errors.submit}
              </div>
            )}


            <button
              type="submit"
              disabled={submitting}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-white text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md ${
                submitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              style={{ minHeight: 44 }}
            >
              {submitting ? 'SENDING REQUEST...' : 'SEND SOS REQUEST'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SOSRequest;
