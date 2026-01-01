// hooks/usePreloadCriticalAssets.ts
'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function usePreloadCriticalAssets() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const criticalImages = [
      '/hero.png',
      '/service/part-1.png',
      '/service/part-2.png',
      '/service/part-3.png',
      '/team/team-1.png',
      '/team/team-2.png',
      '/team/team-3.png',
      '/team/team-4.png',
      '/logo-1.webp',
      '/logo-2.webp',
      '/logo-3.webp',
      '/logo-4.webp',
      '/logo-5.webp',
      '/logo-6.webp',
      '/logo-7.webp',
      // Add more if needed
    ];

    // Now: 1 texture + 15 images = 16 total
    const totalAssets = 1 + criticalImages.length;
    let loadedAssets = 0;

    const markLoaded = () => {
      loadedAssets++;
      setProgress(Math.round((loadedAssets / totalAssets) * 100));

      if (loadedAssets === totalAssets) {
        setTimeout(() => setIsLoaded(true), 500);
      }
    };

    // Load the main hero texture via Three.js (if your Hero still needs it)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/hero.png',
      () => markLoaded(),
      undefined, // onProgress (optional)
      (err) => {
        console.error('Texture load failed:', err);
        markLoaded(); // Continue even on error
      }
    );

    // Preload all other critical images
    criticalImages.forEach((src) => {
      const img = new Image();
      img.onload = () => markLoaded();
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        markLoaded(); // Don't block progress on missing image
      };
      img.src = src;
    });
  }, []);

  return { progress, isLoaded };
}