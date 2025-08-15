'use client';

import { useState, useEffect } from 'react';
import ProgressTracker from './ProgressTracker';
import WaypointPanel from './WaypointPanel';
import MapComponent from './MapComponent';
import { Shop } from './MapComponent';
import type { SankinKotaiData } from './src/hooks/useSankinKotaiData';

interface MapContainerProps {
  data: SankinKotaiData;
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ data, selectedShop, setSelectedShop }) => {
  // TODO: The useShops hook is missing. This is a placeholder.
  const shops: Shop[] = [];
  const shopsLoading = false;
  const shopsError = null;

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isFollowing, setIsFollowing] = useState(true);

  const panToValidLocation = (location: { lat?: number; lng?: number } | null) => {
    if (map && location && typeof location.lat === 'number' && typeof location.lng === 'number') {
      map.panTo(location as google.maps.LatLngLiteral);
    }
  };

  useEffect(() => {
    if (isFollowing && map) {
      if (data.personPosition) {
        panToValidLocation(data.personPosition);
      } else if (data.targetLocations.length > 0) {
        const lastLocation = data.targetLocations[data.targetLocations.length - 1];
        panToValidLocation(lastLocation);
      } else if (data.userLocation) {
        panToValidLocation(data.userLocation);
      }
    }
  }, [data.personPosition, data.targetLocations, data.userLocation, isFollowing, map]);

  const handleRecenter = () => {
    setIsFollowing(true);
    if (map) {
      if (data.personPosition) {
        panToValidLocation(data.personPosition);
      } else if (data.targetLocations.length > 0) {
        const lastLocation = data.targetLocations[data.targetLocations.length - 1];
        panToValidLocation(lastLocation);
      } else if (data.userLocation) {
        panToValidLocation(data.userLocation);
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Map Component (Takes full space) */}
      <div style={{ width: '100%', height: '100%' }}>
        <MapComponent
          userLocation={data.userLocation}
          castles={data.castles}
          shops={shops}
          selectedCastle={data.selectedCastle}
          setSelectedCastle={data.setSelectedCastle}
          selectedShop={selectedShop}
          setSelectedShop={setSelectedShop}
          targetLocations={data.targetLocations}
          personPosition={data.personPosition}
          tripType={data.tripType}
          tripData={data.tripData}
          onMapLoad={setMap}
          onDragStart={() => setIsFollowing(false)}
        />
      </div>

      {/* UI Panels (Top of the map) */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        width: 'calc(100% - 20px)',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '10px',
        alignItems: 'start'
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '10px', borderRadius: '10px' }}>
          <WaypointPanel
            availableLocations={[...data.castles, ...shops]}
            targetLocations={data.targetLocations}
            addTargetLocation={data.addTargetLocation}
            removeTargetLocation={data.removeTargetLocation}
            moveTargetLocation={data.moveTargetLocation}
            tripType={data.tripType}
          />
        </div>
        {data.tripData ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '0px', borderRadius: '10px', minWidth: '300px' }}>
            <ProgressTracker
              totalDistanceWalked={data.totalDistanceWalked}
              targetDistance={data.tripData.totalDistance}
              isReversed={data.tripType === 'inbound'}
            />
            {/* <ProgressTracker
              totalDistanceWalked={data.totalDistanceWalked}
              targetDistance={data.tripData.totalDistance}
              isReversed={data.tripType === 'inbound'}
            /> */}
          </div>
        ) : (
          <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold' }}>
            <p>旅を開始するには、目標となるお城を選択してください。</p>
          </div>
        )}
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 10,
          padding: '10px',
          background: 'white',
          border: '2px solid #000',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img src="/home.png" alt="現在地に戻る" style={{ width: '30px', height: '30px' }} />
      </button>

      {/* New Month Modal */}
      {data.isNewMonth && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h2>新しい月が始まりました！</h2>
            <p>今月の目標となるお城を選択してください。</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;