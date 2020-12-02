import React from 'react';
import { Route, BrowserRouter as Router, Switch, Link, Redirect } from 'react-router-dom';
import HandleEstablishment from '../pages/HandleEstablishments/HandleEstablishment';
import './navbar.css';

function Navbar() {
    return (
        <div className="navbar">
                <a style={{marginRight: 35}}> Home </a>
                <a style={{marginRight: 35}}> Configuração </a> 
                <a style={{marginRight: 1250}}> Logout </a>
        </div>
    )
}

export default Navbar;