import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';
import { Link } from "react-router-dom";
import logo from './greenlake_logo.png';

class NavBar extends Component<{}, {}>{
    constructor(props: any){
        super(props);
        this.toggleHamburger.bind(this);
    }
    
    toggleHamburger(){
        var hamburger: any = document.querySelector(".hamburger");
        var menu: any = document.querySelector(".Menu");
        hamburger.classList.toggle("is-active");
        menu.classList.toggle("is-active");
    }

    componentDidMount(){
        //Lazy workaround - resets state of hamburger
        this.toggleHamburger();
    }

    render(){
        return(
            <div id="Container">
                <div id="ContainerTable">
                    <div id="LogoContainer">
                        <img id="Logo" src={logo} width="116" height="44"></img>
                    </div>

                    <div id="ContainerSeperator"></div>

                    <div id="NavContainer">
                        <button className="hamburger hamburger--collapse is-active" type="button" onClick={() => this.toggleHamburger()} style={{outline: 'none'}}>
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>

                    <div className="Menu is-active">
                        <ul>
                            <Link to="/index.html/" onClick={() => this.toggleHamburger()}><li>Cart</li></Link>
                            <Link to="/index.html/wishlist" onClick={() => this.toggleHamburger()}><li>Wishlist</li></Link>
                            <Link to="/index.html/orders" onClick={() => this.toggleHamburger()}><li>Orders</li></Link>
                            <Link to="/index.html/profile" onClick={() => this.toggleHamburger()}><li>Account</li></Link>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default NavBar;