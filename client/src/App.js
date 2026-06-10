import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import { Spinner } from 'react-bootstrap';
import { check } from './http/userAPI';

const App = observer(() => {
  const { user, basket} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      check()
        .then(data => {
          user.setUser(data);
          user.setIsAuth(true);
          return basket.loadBasket();
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);   
        });
    } else {
      setLoading(false); 
    } 
    }, []); 

  if (loading) {
    return <Spinner animation="grow" />;
  }


  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
