// src/useShops.ts
import { useState, useEffect } from "react";
var useShops = (userLocation) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchShops = async () => {
      console.log("[useShops] Starting fetch for /shops.json...");
      try {
        const response = await fetch("/shops.json");
        console.log("[useShops] Fetch response:", response);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("[useShops] Parsed data:", data);
        if (userLocation) {
          const shopsWithDistance = data.map((shop) => ({
            ...shop,
            distance: shop.lat && shop.lng ? calculateDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng) : void 0
          }));
          setShops(shopsWithDistance);
        } else {
          setShops(data);
        }
      } catch (error2) {
        console.error("[useShops] Fetch error:", error2);
        setError(error2.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [userLocation]);
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
