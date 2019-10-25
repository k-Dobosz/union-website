import React from 'react';
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import { authentication } from "../authentication";
import { Config } from "../../config";

export class Devices extends React.Component {
    constructor(props) {
        super(props);

        this.state = { deviceId: '', device_verify_pin: '', devices: [] }
    }

    componentDidMount() {
        this.getDevices();
    }

    addDevice = (deviceId, device_verify_pin) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        fetch(`${Config.url}device/adduser`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.userId, deviceId: deviceId, device_verify_pin: device_verify_pin }) })
            .then(authentication.handleResponse)
            .then((data) => {
                console.log(data);
                this.forceUpdate();
            });
    };

    deleteDevice = (deviceId) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        fetch(`${Config.url}device/deluser`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.userId, deviceId: deviceId }) })
            .then(authentication.handleResponse)
            .then((data) => {
                console.log(data);
            });
    };

    getDevices = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        fetch(`${Config.url}user/${user.userId}/get_devices`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
            .then(authentication.handleResponse)
            .then(({data}) => {
                for(let i = 0; i < data.length; i++) {
                    fetch(`${Config.url}device/${data[i].deviceId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } })
                        .then(authentication.handleResponse)
                        .then((res) => {
                            data[i].name = res.data[0].name;
                            data[i].last_user = res.data[0].last_user;
                            this.setState({ devices: data });
                        });
                }
            })
    };

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.setState({[name]: target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.deviceId);
        console.log(this.state.device_verify_pin);
        this.addDevice(this.state.deviceId, this.state.device_verify_pin);
    };

    handleExpand = (number) => {
        if (document.getElementsByClassName("content-inside-left-record-bottom")[number].style.maxHeight === "") {
            document.getElementsByClassName("content-inside-left-record-bottom")[number].style.maxHeight = "40px";
            document.getElementsByClassName("content-inside-left-record-top-arrow")[number].style.transform = "rotate(180deg)";
        } else {
            document.getElementsByClassName("content-inside-left-record-bottom")[number].style.maxHeight = "";
            document.getElementsByClassName("content-inside-left-record-top-arrow")[number].style.transform = "rotate(0deg)";
        }
    };

    chooseDevice = (deviceId) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        fetch(`${Config.url}device/choose`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceId: deviceId, userId: user.userId }) })
            .then(authentication.handleResponse)
            .then((data) => {
                console.log(data);
            });
    };

    render() {
        return (
            <div>
                <Navbar/>

                <div id="background"></div>

                <div id="content">
                    <Sidebar />
                    <div id="content-inside">
                        <div id="content-inside-left-devices">
                            {this.state.devices[0] !== undefined ? this.state.devices.map((device, index) => {
                                const user = JSON.parse(localStorage.getItem('currentUser'));

                                return <div className="content-inside-left-record" key={index}>
                                    <div className="content-inside-left-record-top">
                                        <div className="content-inside-left-record-top-icon"></div>
                                        <div className="content-inside-left-record-top-name">{device.name}</div>
                                        <div className="content-inside-left-record-top-arrow" onClick={() => this.handleExpand(index)}></div>
                                        <div className="content-inside-left-record-top-default">
                                            {device.last_user === user.userId ?
                                                <button className="content-inside-left-record-top-button-disabled">Wybrano</button>
                                                :
                                                <button className="content-inside-left-record-top-button" onClick={() => this.chooseDevice(device.deviceId)}>Wybierz</button>
                                            }
                                        </div>
                                    </div>
                                    <div className="content-inside-left-record-bottom">
                                        <button className="content-inside-left-record-top-button-remove" onClick={() => this.deleteDevice(device.deviceId)}>Usuń</button>
                                    </div>
                                </div>
                            }) : <div>To konto nie ma dodanego żadnego urządzenia</div>}
                        </div>
                        <div id="content-inside-right-devices">
                            <div>
                                <form id="content-inside-right-form" onSubmit={this.handleSubmit}>
                                    <div id="content-inside-right-form-title">Parowanie urządzenia</div>
                                    <label htmlFor="deviceId" className="content-inside-right-form-desc">Identyfikator urządzenia:</label>
                                    <input name="deviceId" value={this.state.deviceId} className="content-inside-right-form-input" onChange={this.handleChange}/>
                                    <label htmlFor="device_verify_pin" className="content-inside-right-form-desc">Pin weryfikacyjny:</label>
                                    <input name="device_verify_pin" className="content-inside-right-form-input" value={this.state.device_verify_pin} onChange={this.handleChange}/>
                                    <button type="submit" id="content-inside-right-form-button">Dodaj urządzenie</button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}