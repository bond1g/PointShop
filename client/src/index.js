import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createContext } from 'react';
import UserStore from './store/UserStore';
import ClothStore from './store/ClothStore';
import BasketStore from './store/BasketStore';


export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider value = {{
      user: new UserStore(),
      cloth: new ClothStore(),
      basket: new BasketStore(), 
    }}>
      <App />
    </Context.Provider>,
  document.getElementById('root')
);