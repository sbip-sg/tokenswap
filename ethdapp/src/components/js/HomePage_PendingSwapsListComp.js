import React, { Component } from "react";

import axios from "axios";

const pendingSwapsArr = [];
const checkingArr = [];

export class HomePage_PendingSwapsListComp extends Component {
    constructor(props) {
        super(props);

        axios({
            method: 'POST',
            url: 'http://172.26.186.111:10050/htlc/currenthtlc',
            data: { PartyName: localStorage.getItem("PARTY_NAME") },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }).then(res => {
            // window.alert("TESTING: " + JSON.stringify(JSON.parse(res.data['data'])));
            JSON.parse(res.data['data']).forEach(pendingSwap => {
                if(!checkingArr.includes(pendingSwap.htlcid)) {
                    checkingArr.push(pendingSwap.htlcid);
                    pendingSwapsArr.push({
                        htlcid: pendingSwap.htlcid, 
                        sendparty: pendingSwap.sendparty, 
                        sendpartyaddress: pendingSwap.sendpartyaddress, 
                        receiveparty: pendingSwap.receiveparty, 
                        receivepartyaddress: pendingSwap.receivepartyaddress, 
                        sendvalue: pendingSwap.sendvalue, 
                        sendtype: pendingSwap.sendtype, 
                        receivevalue: pendingSwap.receivevalue, 
                        receivetype: pendingSwap.receivetype, 
                        htlcstatus: pendingSwap.htlcstatus, 
                        sendtimeout: pendingSwap.sendtimeout, 
                        htlchash: pendingSwap.htlchash
                    });
                }
            });
        });
    }

    render() {
        const { history } = this.props;

        return (
            <div className="bg-purple-200 mx-auto max-w-6xl py-3 px-3 lg:px-4 shadow-xl mb-12">
                <form>
                    <div className="bg-white shadow-lg rounded px-8 pb-4 mb-3 flex-col">
                        <div className="-mx-3 md:flex mb-6 border-b-2 border-purple-300 pt-3 pb-3">
                            <div className="md:w-11/11 md:mb-0">
                                <p className="font-semibold text-2xl text-purple-800">Pending Swaps</p>
                                <p className="uppercase pt-3 text-xs text-indigo-500 font-bold">
                                    You may check on the details of each swap by clicking on the respective swap record.
                                </p>
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-6">
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block max-w-full sm:px-6 lg:px-8">
                                    <div className="shadow max-h-96 overflow-auto border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full">
                                            <thead className="divide-y divide-gray-300">
                                                <tr>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Contract ID</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Initiating Party</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Receiving Party</th>
                                                    <th scope="col" className="sticky top-0 px-5 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Rate</th>
                                                    <th scope="col" className="sticky top-0 px-5 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Status</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Last Transaction Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300">
                                                {pendingSwapsArr.length ? pendingSwapsArr.map(pendingSwapIndex => (
                                                    <tr key={pendingSwapIndex.addressPartyA} className="cursor-pointer" onClick={() => {
                                                        if(pendingSwapIndex.sendtype === "house") {
                                                            pendingSwapIndex.sendtype = "HouseToken";
                                                        } else if(pendingSwapIndex.sendtype === "ETH") {
                                                            pendingSwapIndex.sendtype = "Ether";
                                                        }

                                                        if(pendingSwapIndex.receivetype === "house") {
                                                            pendingSwapIndex.receivetype = "HouseToken";
                                                        } else if(pendingSwapIndex.receivetype === "ETH") {
                                                            pendingSwapIndex.receivetype = "Ether";
                                                        }
                                                        
                                                        history.push({
                                                            pathname: "/dashboard/swap-details",
                                                            state: { detail: pendingSwapIndex.htlcid + "|" + 
                                                                        pendingSwapIndex.sendparty + "|" + 
                                                                        pendingSwapIndex.sendpartyaddress + "|" + 
                                                                        pendingSwapIndex.receiveparty + "|" + 
                                                                        pendingSwapIndex.receivepartyaddress + "|" + 
                                                                        pendingSwapIndex.sendvalue + " " + pendingSwapIndex.sendtype + " ~ " + pendingSwapIndex.receivevalue + " " + pendingSwapIndex.receivetype + "|" + 
                                                                        pendingSwapIndex.htlcstatus + "|" + 
                                                                        pendingSwapIndex.sendtimeout + "|" + 
                                                                        pendingSwapIndex.htlchash }
                                                        });
                                                    }}>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.htlcid}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.sendparty}<br />
                                                            ({(pendingSwapIndex.sendpartyaddress).substr(0, 6)}....{(pendingSwapIndex.sendpartyaddress).substr((pendingSwapIndex.sendpartyaddress).length - 6, (pendingSwapIndex.sendpartyaddress).length)})
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.receiveparty}<br />
                                                            ({(pendingSwapIndex.receivepartyaddress).substr(0, 6)}....{(pendingSwapIndex.receivepartyaddress).substr((pendingSwapIndex.receivepartyaddress).length - 6, (pendingSwapIndex.receivepartyaddress).length)})
                                                        </td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.sendvalue}&nbsp;{pendingSwapIndex.sendtype}&nbsp;~&nbsp;{pendingSwapIndex.receivevalue}&nbsp;{pendingSwapIndex.receivetype}
                                                        </td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.htlcstatus}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            [DATE]<span className="hidden">|{pendingSwapIndex.sendtimeout}|{pendingSwapIndex.htlchash}</span>
                                                        </td>
                                                    </tr>
                                                )):
                                                (
                                                    <tr>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm text-center whitespace-nowrap" colspan="6">No Records Found</td>
                                                    </tr>
                                                )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
