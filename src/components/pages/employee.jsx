import React from 'react';
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";
import UserData from "../userdata";


export class Employee extends React.Component {
    render() {
        return (
            <div>
                <Navbar/>

                <div id="background"></div>

                <div id="content">
                    <Sidebar />
                    <UserData id={JSON.parse(localStorage.getItem('currentUser')).userId} token={JSON.parse(localStorage.getItem('currentUser')).token}/>
                </div>
            </div>
        );
    }
}