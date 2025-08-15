'use client';

import { useState } from 'react';
import MapComponent from './MapComponent';
import type { Shop } from './MapComponent';

interface ShopMapProps {
  userLocation: { lat: number; lng: number } | null;
}

const ShopMap: React.FC<ShopMapProps> = ({ userLocation }) => {
  // TODO: The useShops hook is missing. This is a placeholder.
  const shops: Shop[] = [];
  const shopsLoading = false;
  const shopsError: Error | null = null;

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  if (shopsLoading) {
    return <div>Loading shops...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapComponent
        userLocation={userLocation}
        shops={shops}
        selectedShop={selectedShop}
        setSelectedShop={setSelectedShop}
        onMapLoad={setMap}
        // The following props are not used in this simplified component,
        // but are kept here for reference from the original MapComponent.
        castles={[]}
        selectedCastle={null}
        setSelectedCastle={() => {}}
        targetLocations={[]}
        personPosition={null}
        tripType={'outbound'}
        tripData={null}
        onDragStart={() => {}}
      />
    </div>
  );
};

export default ShopMap;
