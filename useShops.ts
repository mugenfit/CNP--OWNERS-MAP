'use client';

import { useState, useEffect } from 'react';
import { Shop } from './types'; // Corrected import path

const ONLINE_SHOP_DISTANCE = 20;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useShops = (userLocation: { lat: number; lng: number } | null) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLocation) return;

    const fetchShopsAndGeocode = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/shops');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedShops: Omit<Shop, 'id' | 'type'>[] = await response.json();

        const geocodedShops: Shop[] = await Promise.all(
          fetchedShops.map(async (shop, index) => {
            let shopWithId: Shop = {
              ...shop,
              id: 1000000 + index,
              type: 'shop' as const,
            };

            if (shop.isOnline) {
              shopWithId.distance = ONLINE_SHOP_DISTANCE;
            } else if (shop.address && !shop.lat && !shop.lng) {
              const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
              if (apiKey) {
                try {
                  const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(shop.address)}&key=${apiKey}`);
                  const geocodeData = await geocodeResponse.json();
                  if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
                    const { lat, lng } = geocodeData.results[0].geometry.location;
                    shopWithId.lat = lat;
                    shopWithId.lng = lng;
                  } else {
                     shopWithId.distance = ONLINE_SHOP_DISTANCE;
                  }
                } catch (e) {
                  shopWithId.distance = ONLINE_SHOP_DISTANCE;
                }
              }
            }

            if (shopWithId.lat && shopWithId.lng && !shopWithId.isOnline) {
              shopWithId.distance = calculateDistance(userLocation.lat, userLocation.lng, shopWithId.lat, shopWithId.lng);
            }
            return shopWithId;
          })
        );
        setShops(geocodedShops);
      } catch (e: any) {
        setError(e.message);
        console.error('Error fetching or geocoding shops:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchShopsAndGeocode();
  }, [userLocation]);

  return { shops, loading, error };
};