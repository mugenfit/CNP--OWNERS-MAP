'use client';

import { Map, AdvancedMarker, InfoWindow, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

interface Castle {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance?: number;
  type: 'castle';
}

export interface Shop {
  id: number;
  name: string;
  address: string;
  url?: string;
  description?: string;
  lat?: number;
  lng?: number;
  distance?: number;
  type: 'shop';
  isOnline?: boolean;
}

type Location = Castle | Shop;

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null;
  castles: Castle[];
  shops: Shop[];
  selectedCastle: Castle | null;
  setSelectedCastle: (castle: Castle | null) => void;
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  targetLocations: Location[];
  personPosition: { lat: number; lng: number } | null;
  tripType: 'outbound' | 'inbound';
  tripData: any;
  onMapLoad: (map: google.maps.Map) => void;
  onDragStart: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  castles,
  shops,
  selectedCastle,
  setSelectedCastle,
  selectedShop,
  setSelectedShop,
  targetLocations,
  personPosition,
  tripType,
  tripData,
  onMapLoad,
  onDragStart,
}) => {

  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapLoad(map);
    }
  }, [map, onMapLoad]);

  useEffect(() => {
    if (!map || !tripData || !tripData.segments) return;

    const polylines: google.maps.Polyline[] = [];

    tripData.segments.forEach((segment: any) => {
      if (segment.start.lat && segment.start.lng && segment.end.lat && segment.end.lng) {
        const polyline = new google.maps.Polyline({
          path: [segment.start, segment.end],
          strokeColor: "#0000FF",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          map: map,
        });
        polylines.push(polyline);
      }
    });

    return () => {
      polylines.forEach(polyline => polyline.setMap(null));
    };
  }, [map, tripData]);

  const personImageTransform = tripData && tripData.segments.length > 0 && tripData.segments[0].end.lng && tripData.segments[0].start.lng ? `scaleX(${tripData.segments[0].end.lng > tripData.segments[0].start.lng ? 1 : -1})` : '';

  return (
    <Map
       // mapId={import.meta.env.VITE_GOOGLE_MAP_ID!}
      defaultCenter={{ lat: 35.681236, lng: 139.767125 }}
      defaultZoom={5}
      gestureHandling={'greedy'}
      disableDefaultUI={false}
      style={{ flexGrow: 1 }}
      onDragstart={onDragStart}
    >
        {userLocation && <AdvancedMarker position={userLocation}>
            <Pin
                background={tripType === 'inbound' && tripData && userLocation.lat === tripData.end?.lat ? '#34A853' : '#4285F4'}
                borderColor={'#ffffff'}
                glyphColor={'#ffffff'}
            />
        </AdvancedMarker>}

        {castles.map((castle) => (
            <AdvancedMarker key={castle.id} position={{ lat: castle.lat, lng: castle.lng }} onClick={() => setSelectedCastle(castle)}>
                <Pin
                    background={targetLocations.some(loc => loc.id === castle.id && loc.type === 'castle') ? '#007bff' : (false /* TODO: Clarify what '100' means here */ ? '#FF0000' : '#34A853')}
                    borderColor={'#000000'}
                />
            </AdvancedMarker>
        ))}

        {shops.map((shop, index) => (
          !shop.isOnline && shop.lat && shop.lng && (
            <AdvancedMarker key={`shop-${shop.id || index}`} position={{ lat: shop.lat, lng: shop.lng }} onClick={() => setSelectedShop(shop)}>
              <Pin background={targetLocations.some(loc => loc.id === shop.id && loc.type === 'shop') ? '#007bff' : '#FFD700'} borderColor={'#000000'} glyphColor={'#000000'} />
            </AdvancedMarker>
          )
        ))}

        {personPosition && <AdvancedMarker position={personPosition}><div style={{ transform: personImageTransform }}><img src="/walkpicture.png" alt="Person" style={{ width: '40px', height: '40px' }} /></div></AdvancedMarker>}

        {selectedCastle && (
          <InfoWindow position={{ lat: selectedCastle.lat, lng: selectedCastle.lng }} onCloseClick={() => setSelectedCastle(null)}>
            <div>
              <h3>{selectedCastle.name}</h3>
              <p>現在地からの距離: {selectedCastle.distance?.toFixed(2)} km</p>
            </div>
          </InfoWindow>
        )}

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
  );
};

export default MapComponent;