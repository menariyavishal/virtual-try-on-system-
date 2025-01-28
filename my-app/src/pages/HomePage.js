// import React from 'react';
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//   return (
//     <div className="container mx-auto text-center">
//       <h1 className="text-4xl font-bold my-5">Welcome to Virtual Try-On</h1>
//       <p>Select a feature to proceed:</p>
//       <div className="flex justify-center gap-4 mt-5">
//         <Link to="/scan" className="btn-primary">Start Scanning</Link>
//         <Link to="/suggestions" className="btn-primary">Outfit Suggestions</Link>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import React from 'react';
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-300 text-white">
//       <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">Virtual Try-On</h1>
//       <p className="text-xl mb-8 font-light">Experience AI-powered outfit suggestions and virtual try-on!</p>
//       <div className="flex space-x-6">
//         <Link to="/scan" className="bg-white text-blue-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition">
//           Start Scanning
//         </Link>
//         <Link to="/suggestions" className="bg-white text-blue-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition">
//           Outfit Suggestions
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-300 text-white">
      <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">Virtual Try-On</h1>
      <p className="text-xl mb-8 font-light">Experience AI-powered virtual outfit trials!</p>
      <Link to="/scan" className="bg-white text-blue-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition">
        Start Scanning
      </Link>
    </div>
  );
};

export default HomePage;
