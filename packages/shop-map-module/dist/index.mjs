// src/useShops.ts
import { useState, useEffect } from "react";
var geocodeAddress = async (address) => {
  if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
    console.warn("Google Maps Geocoder not available.");
    return null;
  }
  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
        resolve(null);
      }
    });
  });
};
var useShops = (userLocation, isApiLoaded) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    console.log("[useShops] useEffect triggered. isApiLoaded:", isApiLoaded);
    const fetchShops = async () => {
      if (!isApiLoaded) {
        console.warn("[useShops] Google Maps API not yet loaded. Skipping geocoding.");
        setLoading(false);
        return;
      }
      console.log("[useShops] Starting fetch for /shops.json...");
      try {
        const response = await fetch("/shops.json");
        console.log("[useShops] Fetch response:", response);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("[useShops] Raw shops data:", data);
        console.log("[useShops] Parsed data:", data);
        const geocodedShops = await Promise.all(
          data.map(async (shop) => {
            if (!shop.isOnline && (!shop.lat || !shop.lng) && shop.address) {
              console.log(`[useShops] Attempting to geocode: ${shop.address}`);
              const coords = await geocodeAddress(shop.address);
              if (coords) {
                console.log(`[useShops] Geocoded ${shop.address}: lat=${coords.lat}, lng=${coords.lng}`);
                return { ...shop, lat: coords.lat, lng: coords.lng };
              } else {
                console.warn(`[useShops] Could not geocode address for shop: ${shop.name}, ${shop.address}`);
              }
            }
            return shop;
          })
        );
        console.log("[useShops] Final geocoded shops:", geocodedShops);
        if (userLocation) {
          const shopsWithDistance = geocodedShops.map((shop) => ({
            ...shop,
            distance: shop.lat && shop.lng ? calculateDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng) : void 0
          }));
          setShops(shopsWithDistance);
        } else {
          setShops(geocodedShops);
        }
      } catch (error2) {
        console.error("[useShops] Fetch error:", error2);
        setError(error2.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [userLocation, isApiLoaded]);
  return { shops, loading, error };
};
var calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
export {
  useShops
};
