import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup } from 'react-bootstrap';
import './Cart.css';
import logo from './greenlake_logo.png';

//Product Template
class Product{
    url: string;
    favicon: string;
    title: string;
    price: number;
    host: string;
    options: string[];
    constructor(url: string, favicon: string, title: string, price: number, host: string, options: string[]){
        this.url = url;
        this.favicon = favicon;
        this.title = title;
        this.price = price;
        this.host = host;
        this.options = options;
    }
}

//Visisble Product List Component
class ProductList extends Component<{}, {products: Product[]}>{
    constructor(props: any){
        super(props);
        this.append.bind(this);
        this.update.bind(this);
        this.pop.bind(this);
        this.state = {products: []}
    }

    async append(){
        //Fetches product data from the current active tab
        var fetchedProduct = new Promise(function(resolve, reject){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                resolve([tabs[0].url, tabs[0].favIconUrl, tabs[0].title]);
            })
        });

        //Awaits async function and assigns values to newFetchedProduct
        const newFetchedProduct: any = await fetchedProduct

        //Retrieve tab host name ----- TIDY THIS UP AND REMOVE
        var hostName: any = new URL(newFetchedProduct[0]);
        const test: string = hostName.host;
        const host: string = test.split('.')[1];
        var optionValues: string[];
        
        //Checks whether path exists within database
        const pathExists = await fetch("http://127.0.0.1:5000/checkpath/" + host)
        .then(response => response.json())
        .then(response => {return response});

        //Fetches options from database if path exists
        if(pathExists){
            var promisedPath = new Promise(function(resolve, reject){
                fetch("http://127.0.0.1:5000/getpath/" + host)
                .then(response => response.json())
                .then(response => resolve(response))
            });

            const pathIdentifiers: any = await promisedPath;

            //Loads contentscript in current tab and fetches each option from the database options
            var options: any[] = [];
            for(let step of pathIdentifiers){
                if(step[3] !== 'null'){
                    var promisedValue = new Promise(function(resolve, reject){
                        chrome.tabs.executeScript({code: "var path = " + JSON.stringify(step)}, function(returnPath){
                            chrome.tabs.executeScript({code: "extensionOptions = document.querySelector(path[0] + '[' + path[1] + '=' + path[2] + ']').value;"}, function(returnValue){
                                resolve(returnValue);
                            });
                        });
                    });
                    options.push([step[2], await promisedValue]);
                }
            }
            //Assigns options to optionValues
            optionValues = options;
        } else {
            optionValues = [];
        }

        //Creates a product based on class Product
        const newProduct = new Product(newFetchedProduct[0], newFetchedProduct[1], newFetchedProduct[2], 0, host, optionValues);

        //Retrieves old product list from chrome.storage.sync
        var storedProducts = new Promise(function(resolve, reject){
            chrome.storage.sync.get('productList', function(result){
                resolve(result.productList);
            })
        });

        //Awaits async function and assigns values to currentProductList
        const currentProductList: any = await storedProducts;

        //Creates a new product list based on the old and appends the new product
        var newProductList: any[] = [];
        for(let i=0; i < currentProductList.length; i++){
            newProductList.push(currentProductList[i]);
        }
        newProductList.push(newProduct);

        //Sets chrome.storage.sync to the new productList
        chrome.storage.sync.set({'productList': newProductList});

        this.update();
    }

    async update(){
        //Retrieves product list from chrome.storage.sync
        var storedProducts = new Promise(function(resolve, reject){
            chrome.storage.sync.get('productList', function(result){
                resolve(result.productList);
            })
        });

        //Awaits async function and assigns values to newProductList
        const newProductList: any = await storedProducts;

        //Sets the ProductList state to newProductList - updates current list
        this.setState({products: newProductList});
    }
    
    async pop(product: Product){
        //Retrieves product list from chrome.storage.sync
        var promisedStorageValues = new Promise(function(resolve, reject){
            chrome.storage.sync.get('productList', function(result){
                resolve(result.productList);
            })
        });
        
        //Iterates over the retrieved products (storedProducts) and pops the desired product from the list.
        const retrievedProducts: any = await promisedStorageValues;
        for(let retrievedProduct of retrievedProducts){
            if(retrievedProduct.url === product.url){
                retrievedProducts.splice(retrievedProducts.indexOf(retrievedProduct), 1);
                break
            }
        }

        //Sets the newly popped list as the stored list.
        chrome.storage.sync.set({'productList': retrievedProducts});

        //Updates the current visible productList
        this.update();
    }

    componentDidMount(){
        //Updates the visible productList to contain the stored chrome.storage.sync productList.
        this.update();
    }
    render(){
        return(
            <div>
                <div className="centeredDiv">
                    {this.state.products.map(product => {return (
                        <div>
                            <ListGroup horizontal className="ListGroupContainer" onClick={() => this.pop(product)}>
                                <ListGroup.Item className="ProductListLogo" onClick={() => chrome.tabs.create({url: product.url})}><img src={product.favicon} width="32" height="32"></img></ListGroup.Item>
                                <ListGroup.Item className="ProductListProduct">{product.title}</ListGroup.Item>
                                <ListGroup.Item className="ProductListPrice">{product.price}</ListGroup.Item>
                            </ListGroup>
                            <div className="spacerLine"/>
                        </div>
                    )})}

                    <ListGroup horizontal className="AppendListContainer">
                        <ListGroup.Item className="AppendListItem" onClick={() => this.append()}>Add Product</ListGroup.Item>
                    </ListGroup>
                </div>
            </div>
        );
    }
}

//Action buttons (Checkout, Add to cart etc...)
class Checkout extends Component<{}, {total: number}> {
    constructor(props: any){
        super(props);
        this.checkout.bind(this);
        this.state = {total: 179};
    }
    async checkout(){
        //Retrieves products from chrome.storage.sync
        var promisedProducts = new Promise(function(resolve, reject){
            chrome.storage.sync.get('productList', function(result){
                resolve(result.productList);
            })
        });

        var products: any = await promisedProducts;

        //Iterate through all products and check if checkout is available.
        for(let product of products){
            
            //If options array is longer than 0, send checkout request to api
            if(product.options.length > 0){
                console.log(product.title + ': A checkout request was sent.');
                /*let fURL: string = product.url;
                let rfURL: string = fURL.slice(27, product.url.length - 1);
                const checkoutRequest = await fetch("http://127.0.0.1:5000/checkout/" + product.host + '/' + JSON.stringify(product.options) + '/' + 'test');
                */

               //Else if options array is not longer than 0, prompt manual checkout in new window
            } else {
                console.log('Manual checkout required.');

                //Opens product url in a new tab and executes the tracking.js contentscript (Tracks mouse presses and relevant HTML info)
                chrome.tabs.create({url: product.url, active: false}, createdTab => {
                    chrome.tabs.onUpdated.addListener(function _(tabId, info, tab) {
                      if (tabId === createdTab.id && info.url) {
                        chrome.tabs.onUpdated.removeListener(_);
                        chrome.tabs.executeScript(tabId, {file: "tracking.js"});
                      }
                    });
                });
            }
        }

    }
    getCartTotal(){

    }

    render(){
        return(
            <div>
                <ListGroup horizontal>
                    <ListGroup.Item className="ActionButtons" onClick={() => this.checkout()}>Checkout</ListGroup.Item>
                </ListGroup>
            </div>  
        );
    }
}

//Container or Parent Component to the entire Cart View
class Cart extends Component {
    render(){
        return (
            <div className="containerDiv">
                <div>
                    <ProductList />
                </div>
                <div>
                    <Checkout />
                </div>
            </div>
        )
    }
}

export default Cart;