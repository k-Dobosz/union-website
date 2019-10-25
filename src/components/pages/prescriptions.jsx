import React from 'react';
import { Redirect } from "react-router-dom";
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import { authentication } from "../authentication";
import { Config } from "../../config";

export class Prescriptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = { prescriptions: [], name: '', taking_frequency: '', added_medicines: [] }
    }

    componentDidMount() {
        if (JSON.parse(localStorage.getItem('currentPatient')) !== null)
            this.getPrescriptions();
    }

    getPrescriptions = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const patient = JSON.parse(localStorage.getItem('currentPatient'));

        fetch(`${Config.url}prescription/patient/${patient.patientId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
            .then(authentication.handleResponse)
            .then(({ data }) => {
                let newData = [];
                for(let i = 0; i < data.length; i++) {
                    fetch(`${Config.url}institution/${data[0].institutionId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'} })
                        .then(authentication.handleResponse)
                        .then((institutionData) => {
                            data[i].institutionName = institutionData.name;
                        });

                    fetch(`${Config.url}prescription/${data[i].id}/medicines`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
                        .then(authentication.handleResponse)
                        .then((res) => {
                            newData[i] = res.medicines;
                            data[i].medicines = newData[i];
                            this.setState({ prescriptions: data });
                        });
                }
            });
    };

    addReceipt = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const patient = JSON.parse(localStorage.getItem('currentPatient'));
        const institution = JSON.parse(localStorage.getItem('currentInstitution'));

        fetch(`${Config.url}prescription/add`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ doctorId: user.userId, patientId: patient.patientId, institutionId: institution.id }) })
            .then(authentication.handleResponse)
            .then(({ data }) => {
                console.log(data);
                fetch(``)
            });
    };

    addToState = () => {
        let data = this.state.added_medicines;
        data.push({ name: this.state.name, taking_frequency: this.state.taking_frequency});
        this.setState({ addedMedicines: data, name: '', taking_frequency: ''});
        console.log(this.state.added_medicines);
    };

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.setState({[name]: target.value});
    };

    handleExpand = (number) => {
        if (document.getElementsByClassName("content-inside-reception-bottom")[number].style.maxHeight === "") {
            document.getElementsByClassName("content-inside-reception-bottom")[number].style.maxHeight = "1000px";
            document.getElementsByClassName("content-inside-reception-top-arrow")[number].style.transform = "rotate(180deg)";
        } else {
            document.getElementsByClassName("content-inside-reception-bottom")[number].style.maxHeight = "";
            document.getElementsByClassName("content-inside-reception-top-arrow")[number].style.transform = "rotate(0deg)";
        }
    };

    render() {
        if (JSON.parse(localStorage.getItem('currentPatient')) == null)
            return <Redirect to="/select-patient" />;

        return (
            <div>
                <Navbar/>

                <div id="background"></div>

                <div id="content">
                    <Sidebar />

                    <div id="content-inside">
                        <div className="content-inside-reception">
                            <div className="content-inside-reception-top">
                                <div className="content-inside-reception-top-name">
                                    <div className="reception-title">
                                        Dodawanie recepty
                                    </div>
                                </div>
                                <button id="receptionAdd-button" style={{float: 'right'}} onClick={this.addReceipt}>Utwórz</button>
                            </div>
                            <div className="content-inside-reception-bottom-addPrescription">
                                <div className="content-inside-reception-bottom-text">
                                    <div className="reception-data">
                                        <div style={{width: '100%', height: '40px'}}>
                                            <input name="name" id="receptionAdd-input" placeholder="Nazwa leku" value={this.state.name} onChange={this.handleChange}/>
                                            <input name="taking_frequency" id="receptionAdd-input" placeholder="Częstotliwość podawania" value={this.state.taking_frequency} onChange={this.handleChange}/>
                                            <button id="receptionAdd-button" onClick={() => {this.addToState()}}>Dodaj</button>
                                        </div>
                                    </div>
                                    {this.state.added_medicines.map((medicine, index) => {
                                        return <div className="reception-data" key={index}>
                                            <div className="reception-data-title">{medicine.name}</div>
                                            <div className="reception-data-info">{medicine.taking_frequency}</div>
                                        </div>;
                                    })}
                                </div>
                            </div>
                        </div>
                        {this.state.prescriptions !== undefined ? this.state.prescriptions.map((prescription, index) => {
                            let date = new Date(prescription.date);
                            return <div className="content-inside-reception" key={index}>
                                <div className="content-inside-reception-top">
                                    <div className="content-inside-reception-top-name">
                                        <div className="reception-title">
                                            {prescription.institutionName} - {date.getDate()}.{date.getMonth()+1}.{date.getFullYear()}
                                        </div>
                                    </div>
                                    <div className="content-inside-reception-top-arrow" onClick={() => this.handleExpand(index)}></div>
                                </div>
                                <div className="content-inside-reception-bottom">
                                    <div className="content-inside-reception-bottom-text">
                                        {prescription.medicines !== undefined ? prescription.medicines.map((medicine, index) => {
                                            return <div className="reception-data" key={index}>
                                                <div className="reception-data-title">{medicine.name}</div>
                                                <div className="reception-data-info">{medicine.taking_frequency}</div>
                                            </div>;
                                        }) : ''}
                                    </div>
                                </div>
                            </div>;
                        }) : ''}
                    </div>
                </div>
            </div>
        );
    }
}