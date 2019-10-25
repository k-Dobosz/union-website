import React from "react";
import { authentication } from "./authentication";
import { Config } from "../config";

export default class UserData extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: [], userId: props.id, token: props.token }
    }

    componentDidMount() {
        this.getUserData();
    }

    getUserData = () => {

        fetch(`${Config.url}user/${this.state.userId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.state.token, 'Content-Type': 'application/json' } })
            .then(authentication.handleResponse)
            .then((data) => {
                console.log(data);
                this.setState({ user: data});
            })
    };

    render() {
        let dob = new Date(this.state.user.date_of_birth);
        let dob_day = dob.getDate();
        let dob_month = dob.getMonth() + 1;

        if (dob_day < 10) {
            dob_day = '0' + dob_day;
        }

        if (dob_month < 10) {
            dob_month = '0' + dob_month;
        }

        return (
            <div id="content-inside">
                <div id="content-inside-left">
                    <div id="content-inside-left-photo" style={{ backgroundImage: 'url("1.png")' }}></div>
                </div>
                <div id="content-inside-right">
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">Imię i nazwisko:</div>
                        <div className="content-inside-right-data-info">{this.state.user.first_name} {this.state.user.last_name}</div>
                    </div>
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">Email:</div>
                        <div className="content-inside-right-data-info">{this.state.user.email}</div>
                    </div>
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">Data urodzenia:</div>
                        <div className="content-inside-right-data-info">{dob_day}.{dob_month}.{dob.getFullYear()}</div>
                    </div>
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">Miejsce urodzenia:</div>
                        <div className="content-inside-right-data-info">{this.state.user.place_of_birth}</div>
                    </div>
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">Płeć:</div>
                        <div className="content-inside-right-data-info">{this.state.user.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}</div>
                    </div>
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">PESEL:</div>
                        <div className="content-inside-right-data-info">{this.state.user.pesel}</div>
                    </div>
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">Imie matki i ojca:</div>
                        <div className="content-inside-right-data-info">{this.state.user.mother_name}, {this.state.user.father_name}</div>
                    </div>
                    <div className="content-inside-right-data">
                        <div className="content-inside-right-data-title">Adres zamieszkania:</div>
                        <div className="content-inside-right-data-info">ul. {this.state.user.address_street} {this.state.user.address_house_number}, {this.state.user.address_postcode} {this.state.user.address_city}, {this.state.user.address_country}</div>
                    </div>
                </div>
            </div>
        );
    }
}