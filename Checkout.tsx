import React, { Component } from 'react';

interface State {
    number: number;
}


class Checkout extends Component<{}, State> {
    constructor(props: any){
        super(props);
        this.state = {
            number: 1
        }
    }

    changeState(){
        this.setState({number: this.state.number + 1});
    }

    render(){
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={this.changeState.bind(this)}>Increment</button>
            </div>
        );
    }
}

export default Checkout;