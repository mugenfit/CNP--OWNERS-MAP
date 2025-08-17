'use client';

import { useState, useEffect } from 'react';
import { useShops, Shop } from '@miyazawanaotaka/shop-map-module';
import MapComponent from './MapComponent';

const MapContainer: React.FC = () => {
  // For now, let's use a fixed location.
  const [userLocation] = useState({ lat: 35.681236, lng: 139.767125 });

  const { shops, loading, error } = useShops(userLocation);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  useEffect(() => {
    console.log('[MapContainer] State update:', { shops, loading, error });
  }, [shops, loading, error]);

  if (loading) {
    return <div>Loading shops...</div>;
  }

  if (error) {
    return <div>Error loading shops: {error}</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapComponent
        userLocation={userLocation}
        shops={shops}
        selectedShop={selectedShop}
        setSelectedShop={setSelectedShop}
        
      />
    </div>
  );
};

export default MapContainer;