import React from "react";
import { Redirect, Route } from "react-router-dom";
import { authentication } from "./authentication";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => authentication.currentUserValue ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )}
        />
    );
};