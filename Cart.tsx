import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup } from 'react-bootstrap';
import './Cart.css';
import logo from './greenlake_logo.png';
import { url } from 'inspector';

class ProductList extends Component<{}, {products: any[][]}> {
    constructor(props: any){
        super(props);
        this.addProduct.bind(this);
        this.runContentScript.bind(this);
        this.checkIfPathsExists.bind(this)
        this.loadProductPage.bind(this);
        this.runContentScript.bind(this);
        this.removeLocalStorage.bind(this);
        this.state = {products: []};
    }

    setLocalStorage(values: any[]){
        chrome.storage.sync.set({'productList': values});
    }

    async appendLocalStorage(product: any[]){
        var promisedStorageValues = new Promise(function(resolve, reject){
            chrome.storage.sync.get('productList', function(result){
                resolve(result.productList);
            })
        });

        const values: any = await promisedStorageValues;
        const newValues: any[] = [];
        for(let i=0; i < values.length; i++){
            newValues.push(values[i]);
        }
        newValues.push(product);
        this.setLocalStorage(newValues);
        this.readLocalStorage();
    }

    async removeLocalStorage(product: any[]){
        var promisedStorageValues = new Promise(function(resolve, reject){
            chrome.storage.sync.get('productList', function(result){
                resolve(result.productList);
            })
        });

        const values: any = await promisedStorageValues;
        values.splice(values.indexOf(product, 0), 1);
        this.setLocalStorage(values);
        this.readLocalStorage();
    }

    async readLocalStorage(){
        var promisedStorageValues = new Promise(function(resolve, reject){
            chrome.storage.sync.get('productList', function(result){
                resolve(result.productList);
            })
        });

        const values: any = await promisedStorageValues;
        this.setState({products: values});
    }

    async addProduct(){
        var promisedURL = new Promise(function(resolve, reject){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                resolve([tabs[0].url, tabs[0].favIconUrl, tabs[0].title]);
            })
        });
        const urlInformation: any = await promisedURL;
        const urlFavicon: any = urlInformation[1];
        const urlProduct: any = new URL(urlInformation[0]);
        const urlHost: any = urlProduct.host;
        const urlTitle: any = urlInformation[2];
        const urlPrice: any = '1599';

        this.appendLocalStorage([urlProduct, urlFavicon, urlTitle, urlPrice, urlHost]);
    }

    loadProductPage(url: string){
        chrome.tabs.create({url: url});
    }

    runContentScript(){
        chrome.tabs.executeScript({file: 'tracking.js'});
    }

    checkIfPathsExists(){
        for(let i=0; i < this.state.products.length; i++){
            const urlHost: string = this.state.products[i][4];
            let formattedHost = urlHost.split('.')[0]
            const status = fetch("http://127.0.0.1:5000/checkpath/" + formattedHost)
            .then(response => response.json())
            .then(response => {if(response){console.log('path exists.')}else{console.log(this.runContentScript)}});
        }
    }

    componentDidMount(){
        this.readLocalStorage();
    }

    render(){
        return (
            <div>
                <div className="logoDiv">
                    <img src={logo} width="128" height="64" />
                </div>
                <div className="centeredDiv">
                    {this.state.products.map(product => {return (
                        <div>
                            <ListGroup horizontal id="Test">
                                <ListGroup.Item className="ProductListLogo" onClick={() => this.loadProductPage(product[0])}><img src={product[1]} width="32" height="32"></img></ListGroup.Item>
                                <ListGroup.Item className="ProductListProduct">{product[2]}</ListGroup.Item>
                                <ListGroup.Item className="ProductListPrice">{product[3]}</ListGroup.Item>
                                <ListGroup.Item className="ProductListAction" onClick={() => this.removeLocalStorage(product)}>X</ListGroup.Item>
                            </ListGroup>
                            <div className="spacerLine"/>
                        </div>
                    )})}
                </div>
                <div className="actionDiv">
                        <ListGroup horizontal>
                            <ListGroup.Item className="ActionButtons" onClick={() => this.addProduct()}>Add To Cart</ListGroup.Item>
                            <ListGroup.Item className="ActionButtons" onClick={() => this.checkIfPathsExists()}>Checkout</ListGroup.Item>
                        </ListGroup>
                </div>
            </div>
        );
    }
}

class Cart extends Component {
    render(){
        return (
            <div className="containerDiv">
                <div>
                    <ProductList />
                </div>
            </div>
        )
    }
}

export default Cart;