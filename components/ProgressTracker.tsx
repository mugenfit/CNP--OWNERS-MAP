'use client';

import React from 'react';

interface ProgressTrackerProps {
  totalDistanceWalked: number;
  targetDistance: number;
  isReversed: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ totalDistanceWalked, targetDistance, isReversed }) => {
  const progress = targetDistance > 0 ? (totalDistanceWalked / targetDistance) * 100 : 0;
  const cappedProgress = Math.min(100, progress);

  const characterPosition = `calc(${isReversed ? 100 - cappedProgress : cappedProgress}% - ${isReversed ? 0 : 80}px)`;
  const characterFinalPosition = `calc(100% - 80px)`;

  const markers: JSX.Element[] = [];
  if (targetDistance > 0) {
    const maxMarkers = 10;
    const interval = Math.max(5, Math.ceil(targetDistance / maxMarkers / 5) * 5);

    for (let i = interval; i < targetDistance; i += interval) {
      const markerPosition = (i / targetDistance) * 100;
      markers.push(
        <div key={`marker-${i}`} style={{ position: 'absolute', left: `${markerPosition}%`, bottom: '30px', transform: 'translateX(-50%)' }}>
          <div style={{ width: '2px', height: '15px', backgroundColor: '#666' }}></div>
          <span style={{ fontSize: '0.8em', color: '#333', fontWeight: 'bold' }}>{i}km</span>
        </div>
      );
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginTop: '20px',
      position: 'relative'
    }}>
      <img
        src="/home.webp"
        alt="Start"
        style={{
          height: '80px',
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      {totalDistanceWalked > 0 && (
        <img
          src="/walkpicture.webp"
          alt="Character"
          style={{
            height: '80px',
            position: 'absolute',
            left: cappedProgress >= 100 ? characterFinalPosition : characterPosition,
            top: '50%',
            transform: `translate(-50%, -50%) scaleX(${isReversed ? -1 : 1})`,
            transition: 'left 0.5s linear',
          }}
        />
      )}
      <img
        src="/castle.webp"
        alt="Castle"
        style={{
          height: '90px',
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      <div style={{ position: 'absolute', width: '100%', height: '100%', top: '0' }}>
        {markers}
      </div>
    </div>
  );
};

export default ProgressTracker;