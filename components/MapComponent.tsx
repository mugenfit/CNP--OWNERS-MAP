'use client';

import { Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import type { Shop } from '@miyazawanaotaka/shop-map-module';

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null;
  shops: Shop[];
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  shops,
  selectedShop,
  setSelectedShop,
}) => {

  return (
    <Map
      mapId={import.meta.env.VITE_GOOGLE_MAP_ID!}
      defaultCenter={{ lat: 35.681236, lng: 139.767125 }}
      defaultZoom={5}
      gestureHandling={'greedy'}
      disableDefaultUI={false}
      style={{ flexGrow: 1 }}
    >
      {userLocation && (
        <AdvancedMarker position={userLocation}>
          <Pin />
        </AdvancedMarker>
      )}

      {shops.map((shop, index) => (
        !shop.isOnline && shop.lat && shop.lng && (
          <AdvancedMarker 
            key={`shop-${shop.id || index}`} 
            position={{ lat: shop.lat, lng: shop.lng }} 
            onClick={() => setSelectedShop(shop)}
          >
            <Pin background={'#FFD700'} borderColor={'#000000'} glyphColor={'#000000'} />
          </AdvancedMarker>
        )
      ))}

      {selectedShop && selectedShop.lat && selectedShop.lng && (
        <InfoWindow 
          position={{ lat: selectedShop.lat, lng: selectedShop.lng }} 
          onCloseClick={() => setSelectedShop(null)}
          minWidth={200}
        >
          <div>
            <h3>{selectedShop.name}</h3>
            <p>{selectedShop.address}</p>
            {selectedShop.description && <p>{selectedShop.description}</p>}
            {selectedShop.url && <p><a href={selectedShop.url} target="_blank" rel="noopener noreferrer">Website</a></p>}
            {selectedShop.distance !== undefined && (
              <p>Distance: {selectedShop.distance.toFixed(2)} km</p>
            )}
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};

export default MapComponent;
