'use client';

import { Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { useState, useMemo } from 'react';
import { Shop } from './types'; // Import Shop type

interface ShopMapProps {
  shops: Shop[];
  userLocation: { lat: number; lng: number } | null;
}

const ShopMap: React.FC<ShopMapProps> = ({ shops, userLocation }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const sortedShops = useMemo(() => {
    if (!userLocation) return shops;
    // Filter out shops without distance for sorting
    const shopsWithDistance = shops.filter(shop => shop.distance !== undefined);
    const shopsWithoutDistance = shops.filter(shop => shop.distance === undefined);
    
    shopsWithDistance.sort((a, b) => (a.distance!) - (b.distance!));

    return [...shopsWithDistance, ...shopsWithoutDistance];
  }, [shops, userLocation]);

  return (
    <div style={{ display: 'flex', height: '100%' }}> {/* Changed height from 100vh to 100% */}
      <div style={{ width: '300px', overflowY: 'auto', padding: '10px' }}>
        <h2>オーナーズ加盟店</h2>
        <ul>
          {sortedShops.map(shop => (
            <li key={shop.id} onClick={() => setSelectedShop(shop)} style={{ cursor: 'pointer', margin: '10px 0' }}>
              <strong>{shop.name}</strong>
              <br />
              <small>{shop.address}</small>
              {shop.distance !== undefined && (
                <p>現在地からの距離: {shop.distance.toFixed(2)} km</p>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flexGrow: 1 }}>
        <Map
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID!}
          defaultCenter={userLocation || { lat: 35.681236, lng: 139.767125 }}
          defaultZoom={10}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {sortedShops.map((shop) => (
            !shop.isOnline && shop.lat && shop.lng && (
              <AdvancedMarker key={shop.id} position={{ lat: shop.lat, lng: shop.lng }} onClick={() => setSelectedShop(shop)}>
                <Pin background={'#FFD700'} borderColor={'#000000'} glyphColor={'#000000'} />
              </AdvancedMarker>
            )
          ))}

          {selectedShop && selectedShop.lat && selectedShop.lng && (
            <InfoWindow position={{ lat: selectedShop.lat, lng: selectedShop.lng }} onCloseClick={() => setSelectedShop(null)}>
              <div>
                <h3>{selectedShop.name}</h3>
                <p>{selectedShop.address}</p>
                {selectedShop.description && <p>{selectedShop.description}</p>}
                {selectedShop.url && <p><a href={selectedShop.url} target="_blank" rel="noopener noreferrer">詳細を見る</a></p>}
                {selectedShop.distance !== undefined && (
                  <p>現在地からの距離: {selectedShop.distance.toFixed(2)} km</p>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </div>
  );
};

export default ShopMap;