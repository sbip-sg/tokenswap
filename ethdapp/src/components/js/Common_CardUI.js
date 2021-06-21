import React from "react"

import AccountBalanceTwoToneIcon from "@material-ui/icons/AccountBalanceTwoTone";
import AccountBalanceWalletTwoToneIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";
import TimerTwoToneIcon from "@material-ui/icons/TimerTwoTone";
import DoneIcon from "@material-ui/icons/Done";

import "../css/HomePage_LoggedIn.css";

const Style = "text-gray-200 text-sm";
const arrayIcon = [<AccountBalanceTwoToneIcon fontSize="small" className={Style} />, <AccountBalanceWalletTwoToneIcon fontSize="small" className={Style} />, <TimerTwoToneIcon fontSize="small" className={Style} />, <DoneIcon fontSize="small" className={Style} />];
const Color = ["from-pink-600 to-red-300", "from-blue-600 to-indigo-300", "from-green-600 to-purple-300", "from-purple-600 to-blue-300"];

export const Common_CardUI = (props) => {
    var balance = props.balance;
    balance = balance * 9.5;

    return (
        <div className={`flex transform hover:scale-110 cursor-pointer transition delay-100 w-3/12 p-3 py-3 shadow-xl border rounded-xl bg-gradient-to-r ${Color[props.icon]}`}>
            <div className="w-9/12">
                <p className="text-white text-xs">
                    {props.title}
                </p>
                <p className="text-white text-lg font-semibold">
                    {props.balance}
                </p>
            </div>
            <div className="w-3/12 justify-between">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-xl m-1 bg-opacity-30">
                    {arrayIcon[props.icon]}
                </div>
            </div>
        </div>
    )
}
