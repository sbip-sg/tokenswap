import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { LoginPage } from "./components/js/LoginPage.js";
import { HomePage_LoggedIn } from "./components/js/HomePage_LoggedIn.js";
import { PageNotFound } from "./components/js/Common_404PageNotFound.js";
import { ProtectedRoute } from "./components/support/ProtectedRoute.js";
import "./index.css";

export const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <ProtectedRoute exact path="/dashboard" component={HomePage_LoggedIn} />
        <ProtectedRoute exact path="/dashboard/initiate-swap" component={HomePage_LoggedIn} />
        <ProtectedRoute exact path="/dashboard/receive-swap" component={HomePage_LoggedIn} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, rootElement);
