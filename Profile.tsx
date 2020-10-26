import React, { Component } from 'react';
import './Profile.css';

class ShippingInformation extends Component<{}, {}>{
    render(){
        return(
            <div className="ComponentContainer">
                <div className="ContentContainer">
                    <h3 style={{textAlign: 'center'}}>Shipping Information</h3>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Address</p></div>
                        <div className="gridItem"><input type="text" placeholder="Tulebovägen 30"></input></div>
                    </div>

                    <div className="gridContainer">
                        <div className="gridItem"><p>City</p></div>
                        <div className="gridItem"><input type="text" placeholder="Kållered"></input></div>
                    </div>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Postcode</p></div>
                        <div className="gridItem"><input type="text" placeholder="428 34"></input></div>
                    </div>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Country</p></div>
                        <div className="gridItem"><input type="text" placeholder="Sweden"></input></div>
                    </div>

                    <div className="ButtonContainer">
                        <button id="Save">Save</button>
                    </div>

                </div>
            </div>
        )
    }
}

class FinancialInformation extends Component<{}, {}>{
    render(){
        return(
            <div className="ComponentContainer">
                <div className="ContentContainer">
                    <h3 style={{textAlign: 'center'}}>Financial Information</h3>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Card number</p></div>
                        <div className="gridItem"><input type="text" placeholder="**** **** **** 2595"></input></div>
                    </div>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Card holder</p></div>
                        <div className="gridItem"><input type="text" placeholder="Oliver Jonasson"></input></div>
                    </div>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Security Code</p></div>
                        <div className="gridItem"><input type="text" placeholder="***"></input></div>
                    </div>

                    <div className="ButtonContainer">
                        <button id="Save">Save</button>
                    </div>

                </div>
            </div>
        )
    }
}

class PersonalInformation extends Component<{}, {Info: any}>{
    constructor(props: any){
        super(props);
        this.state = {Info: 'testing'};
        this.update.bind(this);
    }
    submit(message: string){
        chrome.storage.sync.set({'personalInformation': message});
    }

    async read(){
        var promisedPersonalInformation = new Promise(function(resolve, reject){
            chrome.storage.sync.get('personalInformation', function(result){
                resolve(result.personalInformation);
            })
        });

        const personalInformation: any = await promisedPersonalInformation;

        this.update(personalInformation);
    }

    update(value: any){
        this.setState({Info: value});
    }

    render(){
        return(
            <div className="ComponentContainer">
                <div className="ContentContainer">
                    <h3 style={{textAlign: 'center'}}>Personal Information</h3>

                    <div className="gridContainer">
                        <div className="gridItem"><p>First name</p></div>
                        <div className="gridItem"><input type="text" placeholder="Oliver"></input></div>
                    </div>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Last name</p></div>
                        <div className="gridItem"><input type="text" placeholder="Jonasson"></input></div>
                    </div>

                    <div className="gridContainer">
                        <div className="gridItem"><p>Year of birth</p></div>
                        <div className="gridItem"><input type="text" placeholder="1999"></input></div>
                    </div>

                    <div className="ButtonContainer">
                        <button id="Save">Save</button>
                    </div>

                </div>
            </div>
        )
    }
}

class Profile extends Component<{}, {}>{
    render(){
        return(
            <div className="Container">
                <PersonalInformation />
                <FinancialInformation />
                <ShippingInformation />
            </div>
        );
    }
}

export default Profile;