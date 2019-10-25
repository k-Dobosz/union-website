import React from "react";
import { Link } from "react-router-dom";
import { Config } from "../config";
import { authentication } from "./authentication";

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = { institutionName: '', userRole: JSON.parse(localStorage.getItem('currentUser')) !== null ? JSON.parse(localStorage.getItem('currentUser')).role : 1 }
    }

    componentDidMount() {
        if (JSON.parse(localStorage.getItem('currentUser')) !== null)
            this.getInstitutionName();
    }

    getInstitutionName = () => {
        if (JSON.parse(localStorage.getItem('currentInstitution')) === null) {
            const user = JSON.parse(localStorage.getItem('currentUser'));

            fetch(`${Config.url}user/${user.userId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
                .then(authentication.handleResponse)
                .then((data) => {
                    fetch(`${Config.url}institution/${data.institutionId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
                        .then(authentication.handleResponse)
                        .then((res) => {
                            this.setState({ institutionName: res.name });
                            localStorage.setItem('currentInstitution', JSON.stringify({ 'id': data.institutionId, 'name': res.name }));
                        });
                });
        }
    };

    render() {
        let barBottom;
        let barTopName;
        let barBottomName;

        if (authentication.currentUserValue) {
            switch (this.state.userRole) {
                case 1:
                    barBottomName = 'Witryna pacjenta';
                    break;
                case 2:
                    barBottomName = 'Witryna aptekarza';
                    break;
                case 3:
                    barBottomName = 'Witryna lekarza';
                    break;
                case 4:
                    barBottomName = 'Witryna administratora';
                    break;
                default:
                    barBottomName = 'Witryna';
                    break
            }

            barBottom =
                <div id="bar-bottom">
                    <div id="bar-bottom-name">
                        {barBottomName}
                    </div>
                    <div id="bar-bottom-info">
                        <Link to="/login" onClick={authentication.logout}><div className="bar-bottom-info-button">Wyloguj ></div></Link>
                        <div id="bar-bottom-info-email">{JSON.parse(localStorage.getItem('currentUser')).email}</div>
                    </div>
                </div>;
            barTopName = localStorage.getItem('currentInstitution') !== null ? JSON.parse(localStorage.getItem('currentInstitution')).name : this.state.institutionName;
        } else {
            barTopName = 'System zarządzania placówkami medycznymi.';
        }


        return (
            <div id="bar">
                <div id="bar-top">
                    <div id="bar-top-logo"></div>
                    <div id="bar-top-name">
                        <div id="bar-top-name-top">UNION</div>
                        <div id="bar-top-name-bottom">{barTopName}</div>
                    </div>
                </div>
                {barBottom}
            </div>
        );
    }
}