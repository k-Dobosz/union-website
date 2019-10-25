import React from "react";
import { Redirect } from "react-router-dom";
import Navbar from "../navbar";
import {Sidebar} from "../sidebar";

class Index extends React.Component {
    render() {
        return <Redirect to="/select-patient" />;

        return (
            <div>
                <Navbar />

                <div id="background"></div>

                <div id="content">
                    <Sidebar />

                    <div id="content-inside">
                        <div id="content-inside-title">Coś tam</div>
                        <div id="content-inside-body">Coś tam 2</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;