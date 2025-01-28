// import React from 'react';
// import CameraScanner from '../components/CameraScanner/CameraScanner';

// const ScanPage = () => {
//   return (
//     <div>
//       <h1 className="text-center text-3xl font-bold">Body Scanning</h1>
//       <CameraScanner />
//     </div>
//   );
// };

// export default ScanPage;


// import React from 'react';
// import CameraScanner from '../components/CameraScanner/CameraScanner';

// const ScanPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
//       <h1 className="text-5xl font-bold mb-6">Body Scanning</h1>
//       <CameraScanner />
//       <p className="mt-4 text-lg">Ensure proper lighting for accurate scanning.</p>
//     </div>
//   );
// };

// export default ScanPage;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import CameraScanner from '../components/CameraScanner/CameraScanner';

// const ScanPage = () => {
//   const [scanningComplete, setScanningComplete] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Simulate body scanning process for 10 seconds
//     const timer = setTimeout(() => {
//       setScanningComplete(true); // Show success message after scanning completes
//     }, 10000);

//     // After 5 seconds, redirect to the Result Page
//     if (scanningComplete) {
//       const redirectTimer = setTimeout(() => {
//         navigate('/result');
//       }, 2000); // Wait for 2 seconds before redirecting to Result Page

//       return () => clearTimeout(redirectTimer); // Clean up the redirect timer
//     }

//     return () => clearTimeout(timer); // Clean up the initial timer
//   }, [scanningComplete, navigate]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
//       <h1 className="text-5xl font-bold mb-6">Body Scanning</h1>
//       <div className="w-full max-w-4xl border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg">
//         <CameraScanner />
//       </div>
//       {!scanningComplete ? (
//         <p className="mt-4 text-lg">Scanning in progress... Please wait.</p>
//       ) : (
//         <p className="mt-4 text-xl font-bold text-green-600">
//           Face Registration and Body Scanning were done successfully!
//         </p>
//       )}
//     </div>
//   );
// };

// export default ScanPage;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import CameraScanner from '../components/CameraScanner/CameraScanner';
// import { scanBody } from '../services/api'; // Import the scanBody API function

// const ScanPage = () => {
//   const [scanningComplete, setScanningComplete] = useState(false);
//   const [scanData, setScanData] = useState(null); // State to hold scan data
//   const [errorMessage, setErrorMessage] = useState(null); // State to handle errors
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Simulate body scanning process for 10 seconds
//     const timer = setTimeout(() => {
//       // After 10 seconds, set scanningComplete to true
//       setScanningComplete(true);

//       // Example scan data (replace with real data from CameraScanner if needed)
//       const exampleScanData = {
//         height: 170, // Height in cm
//         weight: 65,  // Weight in kg
//         dimensions: { chest: 90, waist: 70, hips: 95 },
//       };

//       // Call the backend API with scan data
//       handleScanSubmission(exampleScanData);
//     }, 10000);

//     return () => clearTimeout(timer); // Clean up the timer
//   }, []);

//   // Function to handle scan data submission
//   const handleScanSubmission = async (data) => {
//     try {
//       const result = await scanBody(data); // Call the scanBody API
//       setScanData(result); // Save the result in state
//     } catch (error) {
//       console.error('Error during scanning:', error);
//       setErrorMessage('Failed to process the scan. Please try again.');
//     }
//   };

//   useEffect(() => {
//     if (scanningComplete && scanData) {
//       // Redirect to Result Page after showing success message
//       const redirectTimer = setTimeout(() => {
//         navigate('/result', { state: { scanData } }); // Pass scan data to Result Page
//       }, 2000); // Wait for 2 seconds before redirecting

//       return () => clearTimeout(redirectTimer); // Clean up the redirect timer
//     }
//   }, [scanningComplete, scanData, navigate]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
//       <h1 className="text-5xl font-bold mb-6">Body Scanning</h1>
//       <div className="w-full max-w-4xl border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg">
//         <CameraScanner />
//       </div>
//       {!scanningComplete ? (
//         <p className="mt-4 text-lg">Scanning in progress... Please wait.</p>
//       ) : (
//         <p className="mt-4 text-xl font-bold text-green-600">
//           Face Registration and Body Scanning were done successfully!
//         </p>
//       )}
//       {errorMessage && (
//         <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
//       )}
//     </div>
//   );
// };

// export default ScanPage;








import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraScanner from '../components/CameraScanner/CameraScanner';
import { scanBody } from '../services/api'; // Import the scanBody API function

const ScanPage = () => {
  const [scanningComplete, setScanningComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate body scanning process for 10 seconds
    const timer = setTimeout(async () => {
      try {
        // Example scan data (replace with actual CameraScanner data if available)
        const exampleScanData = {
          height: 170,
          weight: 65,
          dimensions: { chest: 90, waist: 70, hips: 95 },
        };

        // Send scan data to the backend
        const scanResponse = await scanBody(exampleScanData);

        if (scanResponse) {
          // Redirect to SuggestionsPage with preferences and AI recommendations
          navigate('/suggestions', { state: { preferences: ['casual', 'formal'], scanResponse } });
        } else {
          throw new Error('Failed to process scan response.');
        }
      } catch (error) {
        console.error('Error during scanning:', error);
        setErrorMessage('Failed to process the scan. Please try again.');
      } finally {
        setScanningComplete(true); // Mark scanning as complete
      }
    }, 10000);

    return () => clearTimeout(timer); // Clean up the timer
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-5xl font-bold mb-6">Body Scanning</h1>
      <div className="w-full max-w-4xl border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg">
        <CameraScanner />
      </div>
      {!scanningComplete ? (
        <p className="mt-4 text-lg">Scanning in progress... Please wait.</p>
      ) : errorMessage ? (
        <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
      ) : (
        <p className="mt-4 text-xl font-bold text-green-600">
          Face Registration and Body Scanning were done successfully!
        </p>
      )}
    </div>
  );
};

export default ScanPage;
