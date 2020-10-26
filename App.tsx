import React from 'react';
import NavBar from './components/navigation/Navigation';
import Cart from './components/cart/revisedCart';
import { Route, Switch } from "react-router-dom";
import Profile from './components/profile/Profile';
import Orders from './components/orders/Orders';
import './revisedApp.css';

function App() {
    return (
        <div className="App">
            <NavBar />

            <Switch>
                <Route exact path="/index.html/" component={Cart} />
                <Route path="/index.html/profile" component={Profile} />
                <Route path="/index.html/wishlist" component={Cart} />
                <Route path="/index.html/orders" component={Orders} />
            </Switch>
        </div>
    );
}

export default App;