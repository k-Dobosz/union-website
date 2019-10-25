import React from 'react';
import { Link } from "react-router-dom";

export class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = { patientSelected: false }

        this.turnPatientSidebar = this.turnPatientSidebar.bind(this);
    }

    turnPatientSidebar = (state) => {
        this.setState({ patientSelected: state });
    };

    componentDidMount() {
        if (localStorage.getItem('currentPatient') !== null)
            this.turnPatientSidebar(true);
    }

    render() {
        let prescriptions = <Link to="/prescriptions" style={{ textDecoration: 'none'}}>
            <div className="content-menu-subpage">
                <div className="content-menu-subpage-inner">Recepty</div>
            </div>
        </Link>;
        let patient;
        let visits;
        if ([3, 4].indexOf(JSON.parse(localStorage.getItem('currentUser')).role) !== -1) {
            patient = <Link to="/patient" style={{ textDecoration: 'none'}}>
                <div className="content-menu-subpage">
                    <div className="content-menu-subpage-inner">Dane Pacjenta</div>
                </div>
            </Link>;

            visits = <Link to="/visits" style={{ textDecoration: 'none'}}>
                <div className="content-menu-subpage">
                    <div className="content-menu-subpage-inner">Wizyty</div>
                </div>
            </Link>
        }

        return (
            <div id="content-menu">
                {/*<Link to="/" style={{ textDecoration: 'none'}}>*/}
                {/*    <div className="content-menu-subpage">*/}
                {/*        <div className="content-menu-subpage-inner">Strona główna</div>*/}
                {/*    </div>*/}
                {/*</Link>*/}
                <Link to="/select-patient" style={{ textDecoration: 'none'}}>
                    <div className="content-menu-subpage">
                        <div className="content-menu-subpage-inner">Wybierz pacjenta</div>
                    </div>
                </Link>
                {this.state.patientSelected ? prescriptions : ''}
                {this.state.patientSelected ? patient : ''}
                {this.state.patientSelected ? visits : ''}
                <Link to="/devices" style={{ textDecoration: 'none'}}>
                    <div className="content-menu-subpage">
                        <div className="content-menu-subpage-inner">Urządzenia</div>
                    </div>
                </Link>
                <Link to="/institution" style={{ textDecoration: 'none'}}>
                    <div className="content-menu-subpage">
                        <div className="content-menu-subpage-inner">Dane placówki</div>
                    </div>
                </Link>
                <Link to="/employee" style={{ textDecoration: 'none'}}>
                    <div className="content-menu-subpage">
                        <div className="content-menu-subpage-inner">Dane pracownika</div>
                    </div>
                </Link>
                {/*<Link to="/help" style={{ textDecoration: 'none'}}>*/}
                {/*    <div className="content-menu-subpage">*/}
                {/*        <div className="content-menu-subpage-inner">Pomoc</div>*/}
                {/*    </div>*/}
                {/*</Link>*/}
                {/*<Link to="/settings" style={{ textDecoration: 'none'}}>*/}
                {/*    <div className="content-menu-subpage">*/}
                {/*        <div className="content-menu-subpage-inner">Ustawienia</div>*/}
                {/*    </div>*/}
                {/*</Link>*/}
            </div>
        );
    }
}