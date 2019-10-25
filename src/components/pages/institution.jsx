import React from 'react';
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import { authentication } from "../authentication";
import { Config } from "../../config";

export class Institution extends React.Component {
    constructor(props) {
        super(props);
        this.state = { institution: [] }
    }

    componentDidMount() {
        this.getInstitutionData();
    }

    getInstitutionData = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        fetch(`${Config.url}user/${user.userId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
            .then(authentication.handleResponse)
            .then((data) => {
                fetch(`${Config.url}institution/${data.institutionId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
                    .then(authentication.handleResponse)
                    .then((data) => {
                        console.log(data);
                        this.setState({ institution: data});
                    })
            })
    };
    render() {
        return (
            <div>
                <Navbar />

                <div id="background"></div>

                <div id="content">
                    <Sidebar />
                    <div id="content-inside">
                        <div className="content-inside-right-data" style={{padding: '5px'}}>
                            <div className="content-inside-right-data-title">Nazwa:</div>
                            <div className="content-inside-right-data-info">{this.state.institution.name}</div>
                        </div>
                        <div className="content-inside-right-data" style={{padding: '5px'}}>
                            <div className="content-inside-right-data-title">Numer telefonu:</div>
                            <div className="content-inside-right-data-info">{this.state.institution.phone_number}</div>
                        </div>
                        <div className="content-inside-right-data" style={{padding: '5px'}}>
                            <div className="content-inside-right-data-title">Adres:</div>
                            <div className="content-inside-right-data-info">ul. {this.state.institution.address_street} {this.state.institution.address_house_number}, {this.state.institution.address_postcode} {this.state.institution.address_city}, {this.state.institution.address_country}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}