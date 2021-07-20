import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./Auth.js";

export const ProtectedRoute = ({component: Component, data, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (auth.isAuthenticated()) {
                    return <Component {...props} {...data} />;
                } else {
                    return (
                        <Redirect to={
                            {
                                pathname: "/",
                                state: {
                                    from: props.location
                                }
                            }
                        }/>
                    );
                }
            }}
        />
    );
};
