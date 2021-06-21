import React from "react";
import { useHistory, Link } from "react-router-dom";

import auth from "../support/Auth.js";

import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import NotificationsTwoToneIcon from "@material-ui/icons/NotificationsTwoTone";
import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";

export const Common_TopNavbar = () => {
    const history = useHistory();
    return (
        <div className="flex shadow-sm pl-3 pr-3 pt-3 pb-2 border-b border-gray-300 justify-between">
            <div className="flex shadow bg-white space-x-3 border border-purple-900">
                <span class="w-auto flex justify-end items-center text-gray-500 p-2">
                    <SearchTwoToneIcon />
                </span>
                <input class="w-auto rounded p-2 text-sm" type="text" placeholder="Try searching for users..." />
                <button class="bg-purple-400 hover:bg-red-300 rounded text-white p-2 pl-4 pr-4">
                    <p class="font-semibold text-xs">Search</p>
                </button>
            </div>
            <div className="flex space-x-4 text-purple-700 text-sm mr-3">
                <Link style={{ textDecoration: 'none' }}
                    onClick={() => {
                        auth.logout(() => {
                            history.push("/");
                        });
                    }}
                ><NotificationsTwoToneIcon /></Link>
                <Link style={{ textDecoration: 'none' }}
                    onClick={() => {
                        auth.logout(() => {
                            history.push("/");
                        });
                    }}
                ><AccountCircleTwoToneIcon /></Link>
                <Link style={{ textDecoration: 'none' }}
                    onClick={() => {
                        auth.logout(() => {
                            history.push("/");
                        });
                    }}
                ><ExitToAppTwoToneIcon />&nbsp;Logout</Link>
            </div>
        </div>
    )
}
