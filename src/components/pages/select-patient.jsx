import React from 'react';
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import { authentication } from "../authentication";
import { Config } from "../../config";

export class SelectPatient extends React.Component {
    constructor(props) {
        super(props);

        this.state = { visits: [], selectedOption: '' };
        this.sidebarElement = React.createRef();
    }

    componentDidMount() {
        if (JSON.parse(localStorage.getItem('currentPatient')) !== null)
            this.setState({ selectedOption: JSON.parse(localStorage.getItem('currentPatient')).patientName });

        this.getVisits();
        this.timer = setInterval(() => this.getVisits(), 30000)
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getVisits = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        fetch(`${Config.url}user/visits_today`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ 'doctorId': user.userId }) })
            .then(authentication.handleResponse)
            .then(({data}) => {
                for(let i = 0; i < data.length; i++) {
                    fetch(`${Config.url}user/${data[i].patientId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
                        .then(authentication.handleResponse)
                        .then((usrData) => {
                            console.log(usrData);
                            data[i].name = `${usrData.first_name} ${usrData.second_name} ${usrData.last_name}`;
                            data[i].email = usrData.email;
                            data[i].pesel = usrData.pesel;
                            data[i].gender = usrData.gender;
                            data[i].date_of_birth = usrData.date_of_birth;
                            this.setState({ visits: data });
                        })
                }
            });
    };

    findInArray = (key, array) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === key) {
                return array[i];
            }
        }
    };

    handleChange = (e) => {
        console.log(this.state.visits);
        if (e.target.value !== '') {
            this.sidebarElement.current.turnPatientSidebar(true);
            this.setState({ selectedOption: e.target.value});
            let visit = this.findInArray(e.target.value, this.state.visits);
            console.log(visit);
            localStorage.setItem('currentPatient', JSON.stringify({ patientId: visit.patientId, patientName: `${visit.name}` }));
        } else {
            this.sidebarElement.current.turnPatientSidebar(false);
            this.setState({ selectedOption: e.target.value});
            localStorage.removeItem('currentPatient');
        }
    };

    render() {
        return (
            <div>
                <Navbar/>

                <div id="background"></div>

                <div id="content">
                    <Sidebar ref={this.sidebarElement} />
                    <div id="content-inside">
                        <div id="content-inside-title">
                            Wybierz pacjenta:
                            <select name="patients" id="select-patient" value={this.state.selectedOption} onChange={this.handleChange}>
                                <option></option>
                                {this.state.visits.map(visit => {
                                   return <option key={visit.id}>{visit.name}</option>
                                })}
                            </select>

                            <button id="content-inside-refresh-button" onClick={this.getVisits}>Odśwież</button>
                        </div>
                            {this.state.visits.map(visit => {
                                let dob = new Date(visit.date_of_birth);
                                let dob_day = dob.getDate();
                                let dob_month = dob.getMonth() + 1;

                                if (dob_day < 10) {
                                    dob_day = '0' + dob_day;
                                }

                                if (dob_month < 10) {
                                    dob_month = '0' + dob_month;
                                }

                                if (visit.name === this.state.selectedOption) {
                                    return <div key={visit.id}>
                                        <div id="content-inside-left">
                                            <div id="content-inside-left-photo" style={{ backgroundImage: 'url("1.png")' }}></div>
                                        </div>
                                        <div id="content-inside-right">
                                            <div className="content-inside-right-data">
                                                <div className="content-inside-right-data-title">Imię i nazwisko:</div>
                                                <div className="content-inside-right-data-info">{visit.name}</div>
                                            </div>

                                            <div className="content-inside-right-data">
                                                <div className="content-inside-right-data-title">Data urodzenia:</div>
                                                <div className="content-inside-right-data-info">{dob_day}.{dob_month}.{dob.getFullYear()}</div>
                                            </div>

                                            <div className="content-inside-right-data">
                                                <div className="content-inside-right-data-title">Płeć:</div>
                                                <div className="content-inside-right-data-info">{visit.gender === 'male' ? 'Mężczyzna': 'Kobieta'}</div>
                                            </div>

                                            <div className="content-inside-right-data">
                                                <div className="content-inside-right-data-title">E-mail:</div>
                                                <div className="content-inside-right-data-info">{visit.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                return '';
                            })}
                    </div>
                </div>
            </div>
        );
    }
}