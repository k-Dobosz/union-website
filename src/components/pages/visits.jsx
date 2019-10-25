import React from 'react';
import { Redirect } from "react-router-dom";
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import { Config } from "../../config";
import {authentication} from "../authentication";

export class Visits extends React.Component {
    constructor(props) {
        super(props);

        this.state = { allVisits: [] }
    }

    componentDidMount() {
        if (JSON.parse(localStorage.getItem('currentPatient')) !== null)
            this.getPatientVisits();
    }

    getPatientVisits = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const patient = JSON.parse(localStorage.getItem('currentPatient'));

        fetch(`${Config.url}user/get_visits`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ 'doctorId': user.userId, 'patientId': patient.patientId }) })
            .then(authentication.handleResponse)
            .then(({data}) => {
                for(let i = 0; i < data.length; i++) {
                    fetch(`${Config.url}user/${data[i].doctorId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' }})
                        .then(authentication.handleResponse)
                        .then((res) => {
                            data[i].doctorName = `${res.first_name} ${res.last_name}`;
                            this.setState({ allVisits: data });
                        })
                }
            });
    };

    handleExpand = (number) => {
        if (document.getElementsByClassName("content-inside-left-visit-bottom")[number].style.maxHeight === "") {
            document.getElementsByClassName("content-inside-left-visit-bottom")[number].style.maxHeight = "40px";
            document.getElementsByClassName("content-inside-left-visit-top-arrow")[number].style.transform = "rotate(180deg)";
        } else {
            document.getElementsByClassName("content-inside-left-visit-bottom")[number].style.maxHeight = "";
            document.getElementsByClassName("content-inside-left-visit-top-arrow")[number].style.transform = "rotate(0deg)";
        }
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
                    {/*{this.state.allVisits.map(visit => {*/}
                    {/*    return <div key={visit.id}>{visit.id} - {visit.date}</div>*/}
                    {/*})}*/}
                    <div id="content-inside">
                        <div id="content-inside-left-visit">
                            {this.state.allVisits.map((visit, index) => {
                                let dob = new Date(visit.date);
                                let dob_day = dob.getDate();
                                let dob_month = dob.getMonth() + 1;

                                if (dob_day < 10) {
                                    dob_day = '0' + dob_day;
                                }

                                if (dob_month < 10) {
                                    dob_month = '0' + dob_month;
                                }
                                return <div className="content-inside-left-visit" key={index}>
                                    <div className="content-inside-left-visit-top">
                                        <div className="content-inside-left-visit-top-name">
                                            dr {visit.doctorName} - <i>{dob_day}.{dob_month}.{dob.getFullYear()}</i>
                                        </div>
                                        <div className="content-inside-left-visit-top-arrow" onClick={() => this.handleExpand(index)}></div>
                                    </div>
                                    <div className="content-inside-left-visit-bottom">
                                        <div className="content-inside-left-visit-bottom-text">{visit.description}</div>
                                    </div>
                                </div>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}