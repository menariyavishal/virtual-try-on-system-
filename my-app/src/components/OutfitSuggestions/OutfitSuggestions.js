// import React, { useState, useEffect } from 'react';
// import API from '../../services/api';

// const OutfitSuggestions = () => {
//   const [outfits, setOutfits] = useState([]);

//   useEffect(() => {
//     const fetchOutfits = async () => {
//       try {
//         const response = await API.get('/outfits');
//         setOutfits(response.data);
//       } catch (error) {
//         console.error('Error fetching outfits:', error);
//       }
//     };

//     fetchOutfits();
//   }, []);

//   return (
//     <div className="outfit-suggestions">
//       {outfits.map((outfit, index) => (
//         <div key={index} className="outfit-card">
//           <img src={outfit.image} alt={outfit.name} />
//           <h3>{outfit.name}</h3>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OutfitSuggestions;

import React, { useState } from 'react';

const OutfitSuggestions = () => {
  const [suggestions] = useState([
    { id: 1, name: 'Casual Outfit', image: '/assets/outfit1.jpg' },
    { id: 2, name: 'Formal Suit', image: '/assets/outfit2.jpg' },
  ]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {suggestions.map((outfit) => (
        <div key={outfit.id} className="p-4 border rounded-lg bg-gray-100">
          <img src={outfit.image} alt={outfit.name} className="w-full h-48 object-cover rounded-md" />
          <h3 className="text-lg font-bold mt-2 text-center">{outfit.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default OutfitSuggestions;