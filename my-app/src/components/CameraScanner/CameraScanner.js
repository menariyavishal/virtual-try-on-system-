// import React, { useRef } from 'react';

// const CameraScanner = () => {
//   const videoRef = useRef(null);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//     }
//   };

//   return (
//     <div className="camera-scanner">
//       <video ref={videoRef} autoPlay className="border rounded-lg"></video>
//       <button onClick={startCamera} className="btn-primary mt-4">Start Scanning</button>
//     </div>
//   );
// };

// export default CameraScanner;

// import React, { useRef, useEffect } from 'react';

// const CameraScanner = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     async function startCamera() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error('Error accessing camera:', error);
//       }
//     }
//     startCamera();
//   }, []);

//   return (
//     <div className="w-full max-w-3xl border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg">
//       <video ref={videoRef} autoPlay className="w-full rounded-lg"></video>
//       <button 
//         className="mt-4 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
//       >
//         Start Scanning
//       </button>
//     </div>
//   );
// };

// export default CameraScanner;

import React, { useRef, useEffect } from 'react';

const CameraScanner = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    }
    startCamera();
  }, []);

  return (
    <div className="w-full max-w-4xl border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg">
      <video ref={videoRef} autoPlay className="w-full rounded-lg"></video>
    </div>
  );
};

export default CameraScanner;