import React from "react";
import { Redirect } from "react-router-dom";
import Navbar from "../navbar";
import { authentication } from "../authentication";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.setState({[name]: target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        authentication.login(this.state.email, this.state.password)
            .then((data) => {
                window.location.reload();
            });
    };

    render() {
        if (authentication.currentUserValue)
            return <Redirect to="/" />;

        return (
            <div>
                <Navbar />
                {/*<div id="login">*/}
                {/*    <div id="login-body">*/}
                {/*        <h1 align="center">Logowanie</h1>*/}
                {/*        <div id="login-form-container">*/}
                {/*            <form id="login-form" onSubmit={this.handleSubmit}>*/}
                {/*                <div id="login-email">*/}
                {/*                    <label htmlFor="login-email-input">E-mail:</label>*/}
                {/*                    <input type="email" name="email" id="login-email-input" value={this.state.email} onChange={this.handleChange}/>*/}
                {/*                </div>*/}
                {/*                <div id="login-password">*/}
                {/*                    <label htmlFor="login-password-input">Hasło:</label>*/}
                {/*                    <input type="password" name="password" id="login-password-input" value={this.state.password} onChange={this.handleChange}/>*/}
                {/*                </div>*/}
                {/*                <button type="submit" id="login-submit-button">Zaloguj się</button>*/}
                {/*            </form>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div id="window-login">
                    <div id="window-login-name">Logowanie</div>
                    <div id="window-login-desc">Proszę podać e-mail i hasło</div>

                    <form id="login-form" onSubmit={this.handleSubmit}>
                        <div id="window-login-form-desc">E-mail:</div>
                        <input type="email" name="email" className="login-input" id="login-email-input" value={this.state.email} onChange={this.handleChange}/>
                        <div id="window-login-form-desc">Hasło:</div>
                        <input type="password" name="password" className="login-input" id="login-password-input" value={this.state.password} onChange={this.handleChange}/>
                        <button type="submit"  id="login-submit-button">Zaloguj się</button>

                        <div id="window-login-form-desc">Demo:</div>
                        <div id="window-login-form-desc">Email - jan.kowalski@domena.pl</div>
                        <div id="window-login-form-desc">Hasło - admin1</div>
                    </form>
                </div>

            </div>
        );
    }
}

export default Login;