'use client';

import { useState, useEffect } from 'react';
import { Shop } from './types';

export const useShops = (userLocation: { lat: number; lng: number } | null) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      console.log('[useShops] Starting fetch for /shops.json...');
      try {
        const response = await fetch('/shops.json');
        console.log('[useShops] Fetch response:', response);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data: Shop[] = await response.json();
        console.log('[useShops] Parsed data:', data);
        
        if (userLocation) {
          const shopsWithDistance = data.map(shop => ({
            ...shop,
            distance: shop.lat && shop.lng ? calculateDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng) : undefined
          }));
          setShops(shopsWithDistance);
        } else {
          setShops(data);
        }
      } catch (error: any) {
        console.error('[useShops] Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [userLocation]);

  return { shops, loading, error };
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};