import React, { useState, useEffect, useRef } from 'react';

const SOSTools = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Police', number: '100', icon: '👮' },
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Fire', number: '101', icon: '🚒' },
    { name: 'Disaster Relief', number: '1077', icon: '🆘' }
  ]);
  const [customMessage, setCustomMessage] = useState('EMERGENCY! I need immediate help. My location is being shared.');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const sirenAudioRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // SOS Siren Audio (Web Audio API)
  const createSirenSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.5);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
    
    return oscillator;
  };


  const toggleSiren = () => {
    if (sirenPlaying) {
      setSirenPlaying(false);
      if (sirenAudioRef.current) {
        clearInterval(sirenAudioRef.current);
      }
    } else {
      setSirenPlaying(true);
      const playInterval = setInterval(() => {
        createSirenSound();
      }, 1000);
      sirenAudioRef.current = playInterval;
    }
  };


  const startEmergencyTimer = (seconds) => {
    setCountdown(seconds);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          triggerEmergencyAlert();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelTimer = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      setCountdown(null);
    }
  };


  const triggerEmergencyAlert = () => {

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    

    toggleSiren();
    
    sendEmergencyMessage();
  };

  // Send Emergency Message
  const sendEmergencyMessage = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const message = `${customMessage}\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}\nTime: ${new Date().toLocaleString()}`;
          
          // Mock SMS sending (in real app, integrate with SMS API not yet implemented)
          console.log('Emergency message sent:', message);
          alert('Emergency alert sent to all contacts!');
        },
        () => {
          alert('Unable to get location for emergency message');
        }
      );
    }
  };

  // Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      alert('Unable to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };


  const toggleFlashlight = async () => {
    try {
      if (!flashlightOn) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        const track = stream.getVideoTracks()[0];
        await track.applyConstraints({
          advanced: [{ torch: true }]
        });
        setFlashlightOn(true);
      } else {
        setFlashlightOn(false);
      }
    } catch (error) {
      // Fallback: Flash screen white
      if (flashlightOn) {
        document.body.style.backgroundColor = '';
        setFlashlightOn(false);
      } else {
        document.body.style.backgroundColor = 'white';
        setFlashlightOn(true);
        setTimeout(() => {
          document.body.style.backgroundColor = '';
          setFlashlightOn(false);
        }, 3000);
      }
    }
  };


  const quickCall = (number) => {
    window.location.href = `tel:${number}`;
  };


  useEffect(() => {
    return () => {
      if (sirenAudioRef.current) {
        clearInterval(sirenAudioRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-20">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            🆘 Emergency SOS Tools
          </h1>
          <p className="text-gray-700 text-lg">
            Comprehensive emergency assistance tools for critical situations
          </p>
        </div>


        {countdown && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4 shadow-2xl">
              <div className="text-6xl font-bold text-red-600 mb-4 animate-pulse">
                {countdown}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Emergency Alert in Progress
              </h3>
              <p className="text-gray-600 mb-6">
                Alert will be sent automatically. Cancel if this is a false alarm.
              </p>
              <button
                onClick={cancelTimer}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Cancel Emergency Alert
              </button>
            </div>
          </div>
        )}

        {/* Main SOS Button */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-red-200 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-6">Instant Emergency Alert</h2>
          <button
            onClick={() => triggerEmergencyAlert()}
            className="w-48 h-48 bg-red-600 hover:bg-red-700 text-white rounded-full text-6xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200 mx-auto flex items-center justify-center animate-pulse"
          >
            SOS
          </button>
          <p className="text-gray-600 mt-4">
            Press for immediate emergency assistance
          </p>
        </div>

        {/* Emergency Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* SOS Siren */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🚨 Emergency Siren
            </h3>
            <p className="text-gray-600 mb-4">
              Play loud siren to attract attention
            </p>
            <button
              onClick={toggleSiren}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                sirenPlaying 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {sirenPlaying ? 'Stop Siren' : 'Start Siren'}
            </button>
          </div>

          {/* Audio Recording */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🎙️ Emergency Recording
            </h3>
            <p className="text-gray-600 mb-4">
              Record audio evidence or distress call
            </p>
            <div className="space-y-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                  isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              {audioURL && (
                <audio controls className="w-full mt-2">
                  <source src={audioURL} type="audio/wav" />
                </audio>
              )}
            </div>
          </div>

          {/* Flashlight */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🔦 Emergency Flashlight
            </h3>
            <p className="text-gray-600 mb-4">
              Signal for help or illuminate area
            </p>
            <button
              onClick={toggleFlashlight}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                flashlightOn 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {flashlightOn ? 'Turn Off Flash' : 'Turn On Flash'}
            </button>
          </div>

          {/* Emergency Timer */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              ⏰ Emergency Timer
            </h3>
            <p className="text-gray-600 mb-4">
              Set timer for automatic alert
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => startEmergencyTimer(30)}
                className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-semibold"
              >
                30s
              </button>
              <button
                onClick={() => startEmergencyTimer(60)}
                className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-semibold"
              >
                1m
              </button>
              <button
                onClick={() => startEmergencyTimer(300)}
                className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-semibold"
              >
                5m
              </button>
            </div>
          </div>

          {/* Location Sharing */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              📍 Share Location
            </h3>
            <p className="text-gray-600 mb-4">
              Send current location to contacts
            </p>
            <button
              onClick={sendEmergencyMessage}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Share Location Now
            </button>
          </div>

          {/* Fake Call */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              📞 Fake Emergency Call
            </h3>
            <p className="text-gray-600 mb-4">
              Simulate incoming call to escape danger
            </p>
            <button
              onClick={() => {
                // Simulate incoming call screen
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTOH0fPTgjMGHm7A7+OZURE=');
                audio.play();
                alert('Fake call activated! Pretend to answer.');
              }}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Start Fake Call
            </button>
          </div>
        </div>

        {/* Quick Emergency Contacts */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Emergency Contacts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => quickCall(contact.number)}
                className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              >
                <span className="text-3xl mb-2">{contact.icon}</span>
                <span className="font-semibold text-gray-800">{contact.name}</span>
                <span className="text-red-600 font-bold">{contact.number}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Emergency Message */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Custom Emergency Message</h2>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="Customize your emergency message..."
          />
          <p className="text-gray-600 text-sm mt-2">
            This message will be sent with your location when emergency alert is triggered
          </p>
        </div>

        {/* Safety Tips */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-4">🛡️ Safety Tips</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• Keep your phone charged and accessible</li>
            <li>• Inform trusted contacts about your whereabouts</li>
            <li>• Test these tools regularly to ensure they work</li>
            <li>• Only use emergency features in genuine emergencies</li>
            <li>• Stay calm and follow safety protocols</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SOSTools;
