import React from 'react';
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import { Config } from "../../config";
import {authentication} from "../authentication";

export class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = { old_password: '', new_password: '', new_password_repeat: '', message: '' }
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.setState({[name]: target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (this.state.new_password === this.state.new_password_repeat) {
            fetch(`${Config.url}user/change_password`,
                { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.userId, old_password: this.state.old_password, new_password: this.state.new_password }) }
            )
                .then(authentication.handleResponse)
                .then((data) => {
                    this.setState({ message: 'Hasło zostało zmienione'})
                });
        } else {
            this.setState({ message: 'Hasła róźnią się'})
        }
    };

    render() {
        return (
            <div>
                <Navbar/>

                <div id="background"></div>

                <div id="content">
                    <Sidebar />
                    {this.state.message}
                    <form onSubmit={this.handleSubmit}>
                        <label>Stare hasło:</label>
                        <input name="old_password" type="password" onChange={this.handleChange}/>
                        <label>Nowe hasło:</label>
                        <input name="new_password" type="password" onChange={this.handleChange}/>
                        <label>Powtórz nowe hasło:</label>
                        <input name="new_password_repeat" type="password" onChange={this.handleChange}/>

                        <button>Zmień</button>
                    </form>
                </div>
            </div>
        );
    }
}