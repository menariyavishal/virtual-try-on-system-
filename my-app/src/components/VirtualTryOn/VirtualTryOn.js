// import React, { useEffect } from 'react';
// import * as THREE from 'three';

// const VirtualTryOn = () => {
//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     const geometry = new THREE.BoxGeometry();
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     camera.position.z = 5;

//     const animate = () => {
//       requestAnimationFrame(animate);
//       cube.rotation.x += 0.01;
//       cube.rotation.y += 0.01;
//       renderer.render(scene, camera);
//     };

//     animate();

//     return () => {
//       document.body.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div id="virtual-try-on"></div>;
// };

// export default VirtualTryOn;

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

const VirtualTryOn = ({ selectedOutfit }) => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    document.getElementById('3d-model').appendChild(renderer.domElement);

    // Set up lighting
    const light = new THREE.AmbientLight(0x404040); // Ambient light
    scene.add(light);

    // Create a simple 3D body model (a placeholder for the user's body)
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 0.5); // Placeholder body geometry
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    scene.add(body);

    // Create a simple outfit (will be replaced with actual clothes later)
    const loadOutfit = (outfit) => {
      if (outfit === 'casual') {
        // Casual outfit (green color as a placeholder)
        const casualMaterial = new THREE.MeshBasicMaterial({ color: 0x4CAF50 });
        const casualOutfit = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), casualMaterial);
        casualOutfit.position.set(0, -0.5, 0); // Position the outfit mesh on top of the body
        scene.add(casualOutfit);
      } else if (outfit === 'formal') {
        // Formal outfit (blue color as a placeholder)
        const formalMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
        const formalOutfit = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), formalMaterial);
        formalOutfit.position.set(0, -0.5, 0); // Position the outfit mesh on top of the body
        scene.add(formalOutfit);
      }
    };

    // Load the selected outfit based on user choice
    loadOutfit(selectedOutfit);

    // Camera position for better viewing
    camera.position.z = 5;

    // Rotate the body for 360-degree view
    const animate = () => {
      requestAnimationFrame(animate);
      body.rotation.y += 0.01; // Apply continuous rotation on the Y-axis for 360-degree effect
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.getElementById('3d-model').removeChild(renderer.domElement);
    };
  }, [selectedOutfit]); // Re-run this effect when the outfit changes

  return <div id="3d-model" className="w-full h-full"></div>;
};

export default VirtualTryOn;
