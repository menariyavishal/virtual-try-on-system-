// import React from 'react';
// import OutfitSuggestions from '../components/OutfitSuggestions/OutfitSuggestions';

// const SuggestionsPage = () => {
//   return (
//     <div>
//       <h1 className="text-center text-3xl font-bold">Outfit Suggestions</h1>
//       <OutfitSuggestions />
//     </div>
//   );
// };

// export default SuggestionsPage;


// import React, { useState } from 'react';

// const SuggestionsPage = () => {
//   const [suggestions] = useState([
//     { id: 1, name: 'Casual Outfit', image: '/assets/outfit1.jpg' },
//     { id: 2, name: 'Formal Suit', image: '/assets/outfit2.jpg' },
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Outfit Suggestions</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {suggestions.map((item) => (
//           <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
//             <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
//             <div className="p-4">
//               <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
//               <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-700">
//                 Try Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SuggestionsPage;

// import React, { useState } from 'react';

// const SuggestionsPage = () => {
//   const [suggestions] = useState([
//     { id: 1, name: 'Casual Outfit', image: '/assets/outfit1.jpg' },
//     { id: 2, name: 'Formal Suit', image: '/assets/outfit2.jpg' },
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Outfit Suggestions</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {suggestions.map((item) => (
//           <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
//             <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
//             <div className="p-4">
//               <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
//               <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-700">
//                 Try Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SuggestionsPage;




// import React, { useEffect, useState } from 'react';
// import { getOutfitSuggestions } from '../services/api'; // Import the outfit suggestions API function

// const SuggestionsPage = () => {
//   const [suggestions, setSuggestions] = useState([]); // State to store outfit suggestions
//   const [loading, setLoading] = useState(true); // State to track loading status
//   const [errorMessage, setErrorMessage] = useState(null); // State to handle errors

//   useEffect(() => {
//     // Fetch outfit suggestions when the component loads
//     const fetchSuggestions = async () => {
//       try {
//         const scanData = {
//           height: 170, // Example data; replace with actual scanned data
//           weight: 65,
//           dimensions: { chest: 90, waist: 70, hips: 95 },
//         };
//         const response = await getOutfitSuggestions(scanData); // Call the API
//         setSuggestions(response); // Update the state with fetched suggestions
//         setLoading(false); // Set loading to false
//       } catch (error) {
//         console.error('Error fetching outfit suggestions:', error);
//         setErrorMessage('Failed to load outfit suggestions. Please try again.');
//         setLoading(false); // Set loading to false in case of error
//       }
//     };

//     fetchSuggestions();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Outfit Suggestions</h1>

//       {loading ? (
//         <p className="text-lg text-gray-600">Loading suggestions...</p>
//       ) : errorMessage ? (
//         <p className="text-red-600 font-semibold">{errorMessage}</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {suggestions.map((item) => (
//             <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
//               <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
//                 <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-700">
//                   Try Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuggestionsPage;



import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import to access state passed from ScanPage
import { getOutfitSuggestions } from '../services/api'; // Import the outfit suggestions API function

const SuggestionsPage = () => {
  const location = useLocation(); // Access state passed via navigate
  const [suggestions, setSuggestions] = useState([]); // State to store outfit suggestions
  const [loading, setLoading] = useState(true); // State to track loading status
  const [errorMessage, setErrorMessage] = useState(null); // State to handle errors

  const preferences = location.state?.preferences || ['casual', 'formal']; // Default to casual and formal
  const scanResponse = location.state?.scanResponse; // Received scan data from ScanPage

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true); // Start loading
        let response;

        // If scanResponse exists, use it; otherwise, fetch using default scanData
        if (scanResponse) {
          response = await getOutfitSuggestions(scanResponse); // Call the API with passed scanResponse
        } else {
          const defaultScanData = {
            height: 170, // Example fallback data
            weight: 65,
            dimensions: { chest: 90, waist: 70, hips: 95 },
          };
          response = await getOutfitSuggestions(defaultScanData);
        }

        setSuggestions(response.recommendations?.outfits || []); // Update the state with fetched outfits
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching outfit suggestions:', error);
        setErrorMessage('Failed to load outfit suggestions. Please try again.');
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchSuggestions();
  }, [scanResponse]);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Outfit Suggestions</h1>

      {loading ? (
        <p className="text-lg text-gray-600">Loading suggestions...</p>
      ) : errorMessage ? (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {suggestions.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
              <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
                <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-700">
                  Try Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionsPage;

