import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import HandleEstablishment from './pages/HandleEstablishments/HandleEstablishment';
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login/Login';
// import { Button } from '@material-ui/core';

const mapsKey = "AIzaSyCRzd5l6Rleatxf7DNazXRMGPkWZr2-xkU";

const containerStyle = {
  height: '100vh'
};
 
const center = {
  lat: -21.205715,
  lng: -50.4423149
};

function App() {
  const [map, setMap] = React.useState(null)
  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, []);

  const [connectionState, setConnectionState] = useState('Não conectado ao WebSocket');

  const [loc, setLoc] = useState([]);

  const [dest, setDest] = useState([]);

  const [establishment] = useState([{
    lat: localStorage.getItem('latitude'),
    lng: localStorage.getItem('longitude'),
    name: localStorage.getItem('username')
  }]);

  function handle() {
    setRedirect(true)
  }

  function handleLogin() {
    localStorage.clear();
    window.location.reload()
    setRedirectLogin(true)
  }

  function handleLocation(data) {
    data.coordinates.latitude = parseFloat(data.coordinates.latitude);
    data.coordinates.longitude = parseFloat(data.coordinates.longitude);
    let local = loc;
    setLoc([...loc, data.coordinates])
    // if(local.length === 0)
    // console.log(data.coordinates)
    // console.log(local)
    // if(loc) {
    //   console.log( 'alo')
    //   for (let i = 0; i < local.length; i++) {
    //     console.log(i)
    //     if(local[i].courier_id === data.coordinates.courier_id) {
    //       console.log('here')
    //       local[i].latitude = data.coordinates.latitude;
    //       local[i].longitude = data.coordinates.longitude;
    //       setLoc(local)
    //     } else {
    //       console.log('alou')
    //       setLoc([...loc, data.coordinates]);
    //     }
    //   }
    // } else {
    //   if(data.coordinates.courier_id){
    //     console.log( 'ei')
    //     // local.push([data.coordinates]);
    //     local = [{
    //       latitude: data.coordinates.latitude,
    //       longitude: data.coordinates.longitude,
    //       courier_id: data.coordinates.courier_id,
    //     }]
    //     setLoc(local)
    //   }
    // }
  }

  useEffect(() => {
    let id = localStorage.getItem('id');

    const socket = io(`http://3.13.75.64:80?query=${id}`, { query: id, forceNew: true, rejectUnauthorized: false, path: '/ws' });

    socket.on('connect', data => {
      setConnectionState('Conectado ao WebSocket');
    });

    // socket.on('locationReceived', (data, loc) => {
    //   console.log(loc)
    //   handleLocation(data)
    // });

    socket.on('locationReceived', data => {
      data.coordinates.latitude = parseFloat(data.coordinates.latitude);
      data.coordinates.longitude = parseFloat(data.coordinates.longitude);
      if(loc.length !== 0) {
        console.log('ei')
      } else {
        console.log('ou')
        setLoc(prevState => {
          if(prevState.length === 0) {
            console.log('ei')
            console.log(prevState)
            return [...prevState, data.coordinates]
          } else {
            let prv = prevState;
            for (let i = 0; i < prv.length; i++) {
              if(prv[i].courier_id === data.coordinates.courier_id) {
                prv.splice(i, 1)
              }
            }
            return [...prevState, data.coordinates]
          }
        });
      }
    });

    socket.on('disconnect', data => {
      setConnectionState('WebSocket Desconectado');
    });

    axios.get(`http://3.13.75.64/api/orders/${id}`).
    then((res) => {
      let data = res.data.results;
      setDest(data)
    }).
    catch((err) => {
      console.log(err)
    })

  }, []);

  if(redirect === true) {
    return (
        <Router>
          <Route to='/establishments' component={HandleEstablishment} />
        </Router>
    )
  } else if(redirectLogin === true) {
    return (
      <Router>
        <Route to='/' component={HandleEstablishment} />
      </Router>
    )
  }

  return  loc, (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact={true}>
          <div className="navbar">
            <a style={{marginRight: 35}}> Home </a>
            <a style={{marginRight: 35}}> <Link to="/config"> Configuração </Link> </a> 
            <a style={{marginRight: 1250}} onClick={(() => { handleLogin() })}> <Link to="/"> Logout </Link> </a>
          </div>
            {/* <p>{connectionState}</p>
              <button onClick={(() => handle())}> <Link to="/config"> Configurar Estabelecimento </Link> </button> */}
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
                      lat: parseFloat(coord.latitude),
                      lng: parseFloat(coord.longitude)
                    }}
                    label={`E${coord.courier_id}`}
                    // icon={{
                    //   url: require('./assets/home-icons-blue-home-icon-blue-11553485374gfcaqpkbyp.png'),
                    //   anchor: new google.maps.Point(5, 58),
                    // }}
                    />
                  ))
                  : null
                }
                {dest ?
                  dest.map(coord => (
                    <Marker
                    position={{
                      lat: parseFloat(coord.latitude),
                      lng: parseFloat(coord.longitude)
                    }}
                    label={coord.client_name}
                    />
                  )) : null
                }
                {establishment.map(coord => (
                  <Marker
                  position={{
                    lat: parseFloat(coord.lat),
                    lng: parseFloat(coord.lng)
                  }}
                  label={coord.name}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </Route>
          <Route path="/config">
              <HandleEstablishment></HandleEstablishment>
          </Route>
          <Route path="/login">
              <Login></Login>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
