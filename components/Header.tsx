'use client';

import React from 'react';

import { Shop } from './MapComponent';

interface HeaderProps {
  tripType: 'outbound' | 'inbound';
  setTripType: (type: 'outbound' | 'inbound') => void;
  additionalSteps: number;
  setAdditionalSteps: (steps: number) => void;
  handleAddSteps: () => void;
  totalDistanceWalked: number;
  dailyRecords: { date: string; steps: number; distance: number }[];
  tripData: { segments: any[]; totalDistance: number; title: string; } | null;
  strideLength: number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  displayDates: string[];
  selectedRecord: { date: string; steps: number; distance: number } | undefined;
  editingRecord: { date: string; steps: number } | null;
  handleEditClick: (record: { date: string; steps: number; }) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  setEditingRecord: (record: { date: string; steps: number } | null) => void;
  today: string;
  setSelectedShop: (shop: Shop | null) => void; // Add setSelectedShop to props
}

const Header: React.FC<HeaderProps> = ({
  tripType,
  setTripType,
  additionalSteps,
  setAdditionalSteps,
  handleAddSteps,
  totalDistanceWalked,
  dailyRecords,
  tripData,
  strideLength,
  selectedDate,
  setSelectedDate,
  displayDates,
  selectedRecord,
  editingRecord,
  handleEditClick,
  handleSaveEdit,
  handleCancelEdit,
  setEditingRecord,
  today,
  setSelectedShop, // Destructure from props
}) => {
  const remainingDistance = tripData ? Math.max(0, tripData.totalDistance - totalDistanceWalked) : 0;
  const remainingDays = Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const dailyAverage = remainingDays > 0 ? (remainingDistance / remainingDays) : 0;

  const handleInputFocus = () => {
    setSelectedShop(null); // Close InfoWindow when input is focused
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
        <button onClick={() => setTripType('outbound')} style={{ padding: '8px 15px', marginBottom: '5px', backgroundColor: tripType === 'outbound' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>往路</button>
        <button onClick={() => setTripType('inbound')} style={{ padding: '8px 15px', backgroundColor: tripType === 'inbound' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>復路</button>
        <a href="/shops" style={{ padding: '8px 15px', marginTop: '10px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', textAlign: 'center' }}>店舗マップ</a>
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="additionalStepsInput">今日の追加歩数: </label>
        <input
          id="additionalStepsInput"
          type="number"
          value={additionalSteps}
          onChange={(e) => setAdditionalSteps(Number(e.target.value))}
          onFocus={handleInputFocus} // Add onFocus event handler
          min="0"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleAddSteps} style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>歩数を追加</button>
        <p>累計移動距離: {totalDistanceWalked.toFixed(2)} km</p>
        {dailyRecords.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <p>月間平均歩数: {(dailyRecords.reduce((sum, r) => sum + r.steps, 0) / dailyRecords.length).toFixed(0)} 歩</p>
            <p>月間最大歩数: {Math.max(...dailyRecords.map(r => r.steps))} 歩</p>
          </div>
        )}
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        <h4>歩数記録</h4>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="date-select">日付を選択: </label>
          <select id="date-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            {displayDates.map(date => <option key={date} value={date}>{date}</option>)}
          </select>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {selectedRecord ? (
            <li style={{ marginBottom: '5px' }}>
              {editingRecord && editingRecord.date === selectedRecord.date ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="number" value={editingRecord.steps} onChange={(e) => setEditingRecord({ ...editingRecord, steps: Number(e.target.value) })} style={{ marginRight: '5px', padding: '3px', width: '80px' }}/> 歩
                  <button onClick={handleSaveEdit} style={{ marginLeft: '5px', padding: '3px 8px' }}>保存</button>
                  <button onClick={handleCancelEdit} style={{ marginLeft: '5px', padding: '3px 8px' }}>キャンセル</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {selectedRecord.date}: {selectedRecord.steps} 歩 ({selectedRecord.distance.toFixed(2)} km)
                  {selectedRecord.date === today && <button onClick={() => handleEditClick(selectedRecord)} style={{ marginLeft: '10px', padding: '3px 8px' }}>編集</button>}
                </div>
              )}
            </li>
          ) : ( <li>{selectedDate}の記録はありません。</li> )}
        </ul>
      </div>
      {tripData && (
        <div style={{ flex: 1, marginLeft: '20px' }}>
          <h4>{tripData.title}</h4>
          <p>目標まで残り: {remainingDistance.toFixed(2)} km</p>
          <p>月末まであと: {remainingDays} 日</p>
          {remainingDistance > 0 && remainingDays > 0 && <p>1日あたり約 {dailyAverage.toFixed(2)} km ({Math.round((dailyAverage * 1000) / strideLength)} 歩) 進む必要があります。</p>}
          {remainingDistance <= 0 && <p style={{ color: 'green', fontWeight: 'bold' }}>目標達成です！</p>}
        </div>
      )}
    </div>
  );
};

export default Header;
