'use client';

import { useState, useEffect } from 'react';
import { useShops, Shop } from './src/shop-map';
import MapComponent from './MapComponent';

interface MapContainerProps {
  isApiLoaded: boolean;
}

type DisplayMode = 'physical' | 'online' | 'mobile'; // 'mobile'を追加

const MapContainer: React.FC<MapContainerProps> = ({ isApiLoaded }) => {
  const [userLocation] = useState({ lat: 35.681236, lng: 139.767125 });
  const [displayMode, setDisplayMode] = useState<DisplayMode>('physical'); // New state for display mode

  const { shops, loading, error } = useShops(userLocation, isApiLoaded);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  useEffect(() => {
    console.log('[MapContainer] State update:', { shops, loading, error });
  }, [shops, loading, error]);

  const toggleDisplayMode = () => {
    setDisplayMode((prevMode) => {
      if (prevMode === 'physical') return 'online';
      if (prevMode === 'online') return 'mobile';
      return 'physical';
    });
  };

  // Filter shops based on displayMode
  const filteredShops = shops.filter((shop) => {
    if (displayMode === 'physical') {
      return !shop.isOnline && shop.category !== '移動販売'; // 実店舗のみ
    } else if (displayMode === 'online') {
      return shop.isOnline; // オンライン店舗のみ
    } else { // displayMode === 'mobile'
      return shop.category === '移動販売'; // 移動式店舗のみ
    }
  });

  

  if (loading) {
    return <div>Loading shops...</div>;
  }

  if (error) {
    return <div>Error loading shops: {error}</div>;
  }

  const getButtonText = () => {
    if (displayMode === 'physical') return '表示モード: 実店舗';
    if (displayMode === 'online') return '表示モード: オンライン店舗';
    return '表示モード: 移動式店舗';
  };

  const getOverlayTitle = () => {
    if (displayMode === 'online') return 'オンライン店舗';
    if (displayMode === 'mobile') return '移動式店舗';
    return ''; // Should not happen
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapComponent
        userLocation={userLocation}
        shops={displayMode === 'physical' ? filteredShops : []} // Pass empty array if not physical mode
        selectedShop={selectedShop}
        setSelectedShop={setSelectedShop}
      />

      {(displayMode === 'online' || displayMode === 'mobile') && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 100,
          overflowY: 'auto',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <h2>{getOverlayTitle()}</h2>
          <ul>
            {filteredShops.map((shop) => (
              <li key={shop.id}>
                <h3>{shop.name}</h3>
                <p>{shop.description}</p>
                {shop.url && <p><a href={shop.url} target="_blank" rel="noopener noreferrer">{shop.url}</a></p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={toggleDisplayMode}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: '1px solid #007bff',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 101, // Ensure button is above online shops list
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default MapContainer;