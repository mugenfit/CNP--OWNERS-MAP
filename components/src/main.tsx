import React, { useState } from 'react'; // Import useState
import ReactDOM from 'react-dom/client';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapContainer from '../MapContainer'; // Correctly import MapContainer

const App = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false); // New state

  const handleApiLoad = () => { // New callback for APIProvider
    setIsApiLoaded(true);
    console.log('[App] Google Maps API script loaded.');
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''} onLoad={handleApiLoad}>
        <MapContainer isApiLoaded={isApiLoaded} />
      </APIProvider>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);