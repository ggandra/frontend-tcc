import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import { Input, InputLabel, Button } from '@material-ui/core';

function Login() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        // let user = localStorage.getItem('username');
        // if(user) {
        //     setLogin(user);
        // }
    });

    function handleLogin(event) {
        let value = event.target.value;
        setLogin(value);
    }

    function handlePassword(event) {
        let value = event.target.value;
        setPassword(value);
    }

    function save() {
        axios.post('http://3.13.75.64/api/loginEstablishment', {
            username: login,
            password: password
        }).then(async (res) => {
            if(res.data.result) {
                await localStorage.setItem('id', res.data.result[0].id);
                await localStorage.setItem('city', res.data.result[0].city);
                await localStorage.setItem('username', login);
                await localStorage.setItem('latitude', res.data.result[0].latitude);
                await localStorage.setItem('longitude', res.data.result[0].longitude);
                setRedirect(true);
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    if(redirect === true) {
        return (
            <Router>
                <Route to='/' component={App} />
            </Router>
        )
    }

    return (
        <div className="all_page">
            <div className="geral">
                <div>
                    <p style={{marginTop: 80}}>Entrar</p>
                </div>
                <div>
                    <InputLabel>Login</InputLabel>
                    <Input 
                    style={{marginTop: -10}}
                        onChange={(event) => handleLogin(event)}
                    ></Input>
                </div>
                <div>
                    <InputLabel>Senha</InputLabel>
                    <Input 
                        style={{marginTop: -10}}
                        onChange={(event) => handlePassword(event)}
                        type='password'
                    ></Input>
                </div>
                <Button 
                    style={{marginTop: 10}}
                    onClick={() => save()}
                    color='primary'
                    variant='contained'
                >Login</Button>
            </div>
        </div>
    );
}

export default Login;