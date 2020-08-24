import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
const mapsKey = "AIzaSyCRzd5l6Rleatxf7DNazXRMGPkWZr2-xkU";
// const mapsKey = undefined;

const containerStyle = {
  width: '1600px',
  height: '1000px'
};
 
const center = {
  lat: -21.205715,
  lng: -50.4423149
};

function App() {
  const [map, setMap] = React.useState(null)
 
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  const [connectionState, setConnectionState] = useState('Não conectado ao WebSocket');
  const [loc, setLoc] = useState([{
    lat: 0,
    lng: 0,
    courier_id: 0
  }]);
  const [dest, setDest] = useState([{
    lat: -21.202093, 
    lng: -50.4749974,
    name: "DE1"
  }, {
    lat: -21.2165076,
    lng: -50.4417256,
    name: "DE2"
  }]);

  useEffect(() => {
    const socket = io('http://3.13.75.64:80', { query: 1, forceNew: true, rejectUnauthorized: false });
    socket.on('connect', data => {
      setConnectionState('Conectado ao WebSocket');
    });
    socket.on('locationReceived', data => {
      let coords = loc;
      data.coordinates.latitude = parseFloat(data.coordinates.latitude);
      data.coordinates.longitude = parseFloat(data.coordinates.longitude)
      if(coords.length !== 0) {
        for (let i = 0; i < coords.length; i++) {
          if(coords[i].courier_id === data.coordinates.courier_id){
            coords[i] = data.coordinates;
            setLoc(coords);
          } else {
            setLoc([...loc, data.coordinates])
          }
        }
      } else {
        console.log('jubiscreide')
        setLoc(data.coordinates)
      }
    });
    socket.on('disconnect', data => {
      setConnectionState('WebSocket Desconectado');
    });
  }, []);

  useEffect(() => {
    console.log(loc)
  }, [loc])

  return (
    <div className="App">
      <p>{connectionState}</p>
      <LoadScript
        googleMapsApiKey={mapsKey}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onUnmount={onUnmount}
        >
          {loc ? 
           loc.map(coord => (
            <Marker 
            position={{
              lat: coord.latitude,
              lng: coord.longitude
            }}
            label={`E${coord.courier_id}`}
            />
          ))
           : null
          }
          {dest.map(coord => (
            <Marker
            position={{
              lat: coord.lat,
              lng: coord.lng
            }}
            label={coord.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
