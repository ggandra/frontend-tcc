import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login/Login';
import App from './App';

function Main() {

    
    const [logged, setLogged] = useState(false);

    useEffect(() => {
      let id = localStorage.getItem('id');
      if(id){
        setLogged(true)
      }
    });

  return (
    <Router>
      <Switch>
        { logged ? <App path='/' exact /> : <Login path='/' /> }
      </Switch>
    </Router>
  )
}

export default Main;