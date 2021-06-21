import React from "react";
import { Link } from "react-router-dom";

import HomeTwoToneIcon from "@material-ui/icons/HomeTwoTone";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import HistoryTwoToneIcon from "@material-ui/icons/HistoryTwoTone";
import MonetizationOnTwoToneIcon from "@material-ui/icons/MonetizationOnTwoTone";
import AccountBalanceTwoToneIcon from "@material-ui/icons/AccountBalanceTwoTone";
import PersonOutlineTwoToneIcon from "@material-ui/icons/PersonOutlineTwoTone";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export const Common_SideNavbar = () => {
    return (
        <div className="md:w-3/12 w-6/12 h-screen shadow-lg">
            <div className=" border-b border-gray-300 py-3 mt-1 flex justify-around">
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <p className="text-lg text-purple-800 font-semibold">[Cross-Chain App Logo]</p>
                </Link>
            </div>
            <div className="pl-4 pr-4 pt-3 pb-3 space-y-3">
                <div className="space-y-3 p-2">
                    <h1 className="text-purple-800 text-sm font-bold">Atomic Swap</h1>
                    <div className="">
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white cursor-pointer">
                                <HomeTwoToneIcon />
                                <p>Dashboard</p>
                            </div>
                        </Link>
                    </div>
                    <div className="">
                        <Link to="/dashboard/initiate-swap" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white  cursor-pointer">
                                <PostAddTwoToneIcon />
                                <p>Initiate Swap</p>
                            </div>
                        </Link>
                    </div>
                    <div className="">
                        <Link to="/dashboard/receive-swap" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white cursor-pointer">
                                <SyncAltIcon />
                                <p>Receive Swap</p>
                            </div>
                        </Link>
                    </div>
                    <div className="">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white cursor-pointer">
                                <HistoryTwoToneIcon />
                                <p>Swap History</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="space-y-3 p-2">
                    <h1 className="text-purple-800 text-sm font-bold">Ethereum</h1>
                    <div className="">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white cursor-pointer">
                                <MonetizationOnTwoToneIcon />
                                <p>Ether Transactions</p>
                            </div>
                        </Link>
                    </div>
                    <div className="">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white cursor-pointer">
                                <AccountBalanceTwoToneIcon />
                                <p>Ether Price</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="space-y-3 p-2">
                    <h1 className="text-purple-600 text-sm font-bold">My Menu</h1>
                    <div className="">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white cursor-pointer">
                                <PersonOutlineTwoToneIcon />
                                <p>Profile</p>
                            </div>
                        </Link>
                    </div>
                    <div className="">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="flex p-2 text-purple-800 text-sm space-x-4 0 hover:bg-purple-400 hover:text-white cursor-pointer">
                                <ExitToAppIcon /><p>Logout</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
