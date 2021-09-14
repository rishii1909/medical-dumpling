import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

async function signIn() {
    try {
        const user = await Auth.signIn(username, password);
    }
    catch(error) {
        console.log('Error signing in : ', error)
    }
}

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this)
    }
    state = {
        user : null,
        username : 'gp_liaison_cms',
        password : 'hrushi2001',

    }

    async signIn(username, password) {
        try {
            const user = await Auth.signIn(username, password);
            console.log(user)
        }
        catch(error) {
            console.log('Error signing in : ', error)
        }
    }

    render(h) {
        return (
            <div>
                <input type='text' defaultValue={this.state.username} onChange={(e) => this.setState({ username : e.target.value })} ></input>             
                <input type='text' defaultValue={this.state.password} onChange={(e) => this.setState({ password : e.target.value })} ></input>  
                <button onClick={() => this.signIn(this.state.username, this.state.password)}>Submit</button>
            </div>           
        )
    }
}

export default SignIn;