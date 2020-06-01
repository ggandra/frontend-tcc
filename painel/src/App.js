import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [connectionState, setConnectionState] = useState('Não conectado ao WebSocket');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    const socket = io('http://127.0.0.1:3000', { query: 1 });
    socket.on('connect', data => {
      setConnectionState('Conectado ao WebSocket');
    });
    socket.on('locationReceived', data => {
      setLatitude(data.coordinates.latitude);
      setLongitude(data.coordinates.longitude);
    });
    socket.on('disconnect', data => {
      setConnectionState('WebSocket Desconectado');
    });
  }, []);

  return (
    <div className="App">
      <p>{connectionState}</p>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p> 
    </div>
  );
}

export default App;
