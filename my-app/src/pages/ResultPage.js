import React, { useState } from 'react';
import VirtualTryOn from '../components/VirtualTryOn/VirtualTryOn';
import OutfitSuggestions from '../components/OutfitSuggestions/OutfitSuggestions';

const ResultPage = () => {
  const [selectedOutfit, setSelectedOutfit] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const handleOutfitSelection = (event) => {
    const outfitType = event.target.value;
    setSelectedOutfit(outfitType);

    // Simulating AI recommendations based on the selected outfit
    const recommendations = outfitType === 'casual' 
      ? [{ id: 1, name: 'Casual Shirt', image: '/assets/casual_shirt.jpg' }]
      : [{ id: 1, name: 'Formal Suit', image: '/assets/formal_suit.jpg' }];
    setAiRecommendations(recommendations);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half: 3D Model */}
      <div className="w-1/2 border-r-2 border-gray-300 flex items-center justify-center bg-white p-8">
        <VirtualTryOn selectedOutfit={selectedOutfit} />
      </div>

      {/* Right Half: Outfit Suggestions and AI Recommendations */}
      <div className="w-1/2 flex flex-col">
        {/* Outfit Suggestions */}
        <div className="h-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Outfit Suggestions</h2>
          <div>
            <input
              type="radio"
              id="casual"
              name="outfit"
              value="casual"
              checked={selectedOutfit === 'casual'}
              onChange={handleOutfitSelection}
            />
            <label htmlFor="casual" className="ml-2">Casual Outfit</label>
            <input
              type="radio"
              id="formal"
              name="outfit"
              value="formal"
              checked={selectedOutfit === 'formal'}
              onChange={handleOutfitSelection}
              className="ml-4"
            />
            <label htmlFor="formal" className="ml-2">Formal Outfit</label>
          </div>
          {selectedOutfit && (
            <div className="mt-4">
              <h3 className="text-xl font-bold">Selected Outfit: {selectedOutfit}</h3>
              <img
                src={selectedOutfit === 'casual' ? '/assets/casual_shirt.jpg' : '/assets/formal_suit.jpg'}
                alt={selectedOutfit}
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="h-1/3 bg-white p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
          {aiRecommendations.length > 0 ? (
            aiRecommendations.map((item) => (
              <div key={item.id} className="mb-4">
                <h3 className="text-lg">{item.name}</h3>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ))
          ) : (
            <p>No recommendations yet. Select an outfit to get suggestions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;