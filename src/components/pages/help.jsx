import React from 'react';
import Navbar from "../navbar";
import { Sidebar } from "../sidebar";

export class Help extends React.Component {

    render() {
        return (
            <div>
                <Navbar/>

                <div id="background"></div>

                <div id="content">
                    <Sidebar />

                </div>
            </div>
        );
    }
}