import React from 'react';

export class NotFound extends React.Component {
    render() {
        return (
            <div id="bar-404">
                <div id="bar-top">
                    <div id="bar-top-logo"></div>
                    <div id="bar-top-name">
                        <div id="bar-top-name-top">UNION</div>
                        <div id="bar-top-name-bottom">System zarządzania placówkami medycznymi.</div>
                    </div>
                </div>
                <div id="bar-bottom-404">
                    Błąd 404
                </div>
            </div>
        );
    }
}