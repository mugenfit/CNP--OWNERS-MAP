'use client';

import { useState, useEffect } from 'react';
import { Shop } from './types';

// Add geocoding function
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
    console.warn('Google Maps Geocoder not available.');
    return null;
  }

  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
        resolve(null);
      }
    });
  });
};

export const useShops = (userLocation: { lat: number; lng: number } | null, isApiLoaded: boolean) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useShops] useEffect triggered. isApiLoaded:', isApiLoaded); // Added log

    const fetchShops = async () => {
      // Only proceed if Google Maps API is loaded
      if (!isApiLoaded) { // Use the new prop
        console.warn('[useShops] Google Maps API not yet loaded. Skipping geocoding.');
        setLoading(false); // Ensure loading state is updated even if API is not ready
        return;
      }

      console.log('[useShops] Starting fetch for /shops.json...');
      try {
        const response = await fetch('/shops.json');
        console.log('[useShops] Fetch response:', response);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data: Shop[] = await response.json();
        console.log('[useShops] Raw shops data:', data); // Add this line
        console.log('[useShops] Parsed data:', data);

        const geocodedShops: Shop[] = await Promise.all(
          data.map(async (shop) => {
            if (!shop.isOnline && (!shop.lat || !shop.lng) && shop.address) {
              console.log(`[useShops] Attempting to geocode: ${shop.address}`); // Added log
              const coords = await geocodeAddress(shop.address);
              if (coords) {
                console.log(`[useShops] Geocoded ${shop.address}: lat=${coords.lat}, lng=${coords.lng}`); // Added log
                return { ...shop, lat: coords.lat, lng: coords.lng };
              } else {
                console.warn(`[useShops] Could not geocode address for shop: ${shop.name}, ${shop.address}`);
              }
            }
            return shop;
          })
        );
        
        console.log('[useShops] Final geocoded shops:', geocodedShops); // Added log

        if (userLocation) {
          const shopsWithDistance = geocodedShops.map(shop => ({
            ...shop,
            distance: shop.lat && shop.lng ? calculateDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng) : undefined
          }));
          setShops(shopsWithDistance);
        } else {
          setShops(geocodedShops);
        }
      } catch (error: any) {
        console.error('[useShops] Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [userLocation, isApiLoaded]); // Depend on isApiLoaded

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