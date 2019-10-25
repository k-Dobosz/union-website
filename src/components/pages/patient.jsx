import React from 'react';
import { Redirect } from "react-router-dom";
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import { Config } from "../../config";
import { authentication } from "../authentication";
import UserData from "../userdata";

export class Patient extends React.Component {
    constructor(props) {
        super(props);
        this.state = { patient: [] }
    }

    componentDidMount() {
        if (JSON.parse(localStorage.getItem('currentPatient')) !== null)
            this.getPatientData();
    }

    getPatientData = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const patient = JSON.parse(localStorage.getItem('currentPatient'));

        fetch(`${Config.url}user/${patient.patientId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
            .then(authentication.handleResponse)
            .then((data) => {
                console.log(data);
                this.setState({ patient: data });
            });
    };

    render() {
        if (JSON.parse(localStorage.getItem('currentPatient')) == null)
            return <Redirect to="/select-patient" />;

        if ([3, 4].indexOf(JSON.parse(localStorage.getItem('currentUser')).role) === -1) {
            return <Redirect to="/select-patient" />;
        }

        return (
            <div>
                <Navbar/>

                <div id="background"></div>

                <div id="content">
                    <Sidebar />

                    <UserData id={JSON.parse(localStorage.getItem('currentPatient')).patientId} token={JSON.parse(localStorage.getItem('currentUser')).token}/>
                </div>
            </div>
        );
    }

}