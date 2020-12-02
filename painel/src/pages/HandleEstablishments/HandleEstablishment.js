import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HandleEstablishment.css';
import App from '../../App';
import { Route, BrowserRouter as Router, Link, Switch  } from 'react-router-dom';
import { Button, Input } from '@material-ui/core';

function HandleEstablishment() {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [couriers, setCouriers] = useState([]);

    const [latitude, setLatitude] = useState('');
    const [longitude, setLogitude] = useState('');
    const [orderName, setOrderName] = useState('');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://3.13.75.64/api/listCouriers/${localStorage.getItem('id')}`).
        then((res) => {
            setCouriers(res.data.result);
        });

        axios.get(`http://3.13.75.64/api/orders/${localStorage.getItem('id')}`).
        then((res) => {
            let data = res.data.results;
            setOrders(data)
        }).
        catch((err) => {
            console.log(err)
        });
    });

    function refresh() {
        axios.get(`http://3.13.75.64/api/listCouriers/${localStorage.getItem('id')}`).
        then((res) => {
            setCouriers(res.data.result);
        });

        axios.get(`http://3.13.75.64/api/orders/${localStorage.getItem('id')}`).
        then((res) => {
            let data = res.data.results;
            setOrders(data)
        }).
        catch((err) => {
            console.log(err)
        });
    }

    function handleName(event) {
        let value = event.target.value;
        setName(value)
    }

    function handleUsername(event) {
        let value = event.target.value;
        setUsername(value)
    }

    function handlePassword(event) {
        let value = event.target.value;
        setPassword(value)
    }

    function handleLatitude(event) {
        let value = event.target.value;
        setLatitude(value)
    }

    function handleLongitude(event) {
        let value = event.target.value;
        setLogitude(value)
    }

    function handleOrderName(event) {
        let value = event.target.value;
        setOrderName(value)
    }

    function saveCourier() {
        axios.post('http://3.13.75.64/api/createCourier', {
            name: name,
            username: username,
            password: password,
            establishment_id: localStorage.getItem('id')
        })
        refresh();
    }

    function saveOrder() {
        axios.post('http://3.13.75.64/api/createOrder', {
            client_name: orderName,
            latitude: latitude,
            longitude: longitude,
            establishment_id: localStorage.getItem('id')
        })
        refresh();
    }

    function deleteCourier(id) {
        axios.delete(`http://3.13.75.64/api/deleteCourier/${id}`);
        refresh();
    }

    function deleteOrder(id) {
        axios.delete(`http://3.13.75.64/api/deleteOrder/${id}`);
        refresh();
    }

    return (
        <div>
            <Router>
                <Switch>
                    <Route path='/' exact={true}>
                        <App></App>
                    </Route>
                </Switch>
                <Switch>
                    <Route path='/config'>
                        <div style={{marginTop: 25}}>
                            <label style={{marginRight: 10}}>Adicionar um novo funcionário</label>
                            <Input style={{marginRight: 10}} onChange={((event) => handleName(event))} placeholder='Nome'></Input>
                            <Input style={{marginRight: 10}} onChange={((event) => handleUsername(event))} placeholder='Usuário'></Input>
                            <Input style={{marginRight: 10}} onChange={((event) => handlePassword(event))} placeholder='Senha'></Input>
                            <Button onClick={(() => saveCourier())} 
                            color='primary'
                            variant='contained'>Adicionar</Button>    
                        </div>
                        {
                            couriers ? couriers.map((res) => {
                                return (
                                    <div style={{backgroundColor: '#333333', color: '#fff', borderRadius: 10, width: 450, marginLeft: 800}}>
                                        <p> Nome: {res.name} </p>
                                        <Button onClick={(() => deleteCourier(res.id))} 
                                        color='primary'
                                        variant='contained'> Deletar </Button>
                                    </div>
                                )
                            }) : null
                        }
                        <div style={{marginTop: 25}}>
                            <label style={{marginRight: 10}}>Adicionar uma nova rota</label>
                            <Input style={{marginRight: 10}} onChange={((event) => handleLatitude(event))} placeholder='Latitude'></Input>
                            <Input style={{marginRight: 10}} onChange={((event) => handleLongitude(event))} placeholder='Longitude'></Input>
                            <Input style={{marginRight: 10}} onChange={((event) => handleOrderName(event))} placeholder='Nome do Local/Cliente'></Input>
                            <Button onClick={(() => saveOrder())} 
                                color='primary'
                                variant='contained'>Adicionar</Button>    
                        </div>
                        {
                            orders ? orders.map((res) => {
                                return (
                                    <div style={{backgroundColor: '#333333', color: '#fff', borderRadius: 10, width: 450, marginLeft: 800}}>
                                        <p> Nome do Cliente: {res.client_name} </p>
                                        <p> Latitude: {res.latitude} </p>
                                        <p> Longitude: {res.longitude} </p>
                                        <Button 
                                            color='primary'
                                            variant='contained' 
                                            onClick={(() => deleteOrder(res.id))}> Deletar </Button>
                                    </div>
                                )
                            }) : null
                        }
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default HandleEstablishment;