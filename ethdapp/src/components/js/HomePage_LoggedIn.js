import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Switch } from "react-router-dom";

import { Common_SideNavbar } from "./Common_SideNavbar.js";
import  {Common_TopNavbar}  from "./Common_TopNavbar.js";
import { HomePage_DashboardComp } from "./HomePage_DashboardComp.js";
import { Homepage_InitiateSwapComp } from "./Homepage_InitiateSwapComp.js";
import { HomePage_PendingSwapsListComp } from "./HomePage_PendingSwapsListComp.js";
import { Homepage_SwapDetailsComp } from "./Homepage_SwapDetailsComp.js";
import { HomePage_SwapHistoryListComp } from "./HomePage_SwapHistoryListComp.js";
import { ProtectedRoute } from "../support/ProtectedRoute.js";
import "../css/HomePage_LoggedIn.css";

export const HomePage_LoggedIn = props => {
    let location = useLocation();
    return (
        <div>
            <div className="flex w-screen h-screen">
                <Common_SideNavbar />
                <div className="w-screen ">
                    <Common_TopNavbar />
                    <Switch>
                        <ProtectedRoute exact path="/dashboard" component={HomePage_DashboardComp} />
                        <ProtectedRoute exact path="/dashboard/initiate-swap" component={Homepage_InitiateSwapComp} />
                        <ProtectedRoute exact path="/dashboard/pending-swapslist" component={HomePage_PendingSwapsListComp} />
                        <ProtectedRoute exact path="/dashboard/swap-details" component={Homepage_SwapDetailsComp} />
                        <ProtectedRoute exact path="/dashboard/swap-historylist" component={HomePage_SwapHistoryListComp} />
                    </Switch>
                </div>
            </div>
        </div>
    );
};
