import React, { Component } from "react";

import axios from "axios";

const swapTransactionsArr = [];
const checkingArr = [];

export class HomePage_SwapHistoryListComp extends Component {
    constructor(props) {
        super(props);

        axios({
            method: 'POST',
            url: 'http://172.26.186.111:10050/htlc/currenthtlc',
            data: { PartyName: localStorage.getItem("PARTY_NAME") },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }).then(res => {
            // window.alert("TESTING: " + JSON.stringify(JSON.parse(res.data['data'])));
            JSON.parse(res.data['data']).forEach(swapTransaction => {
                if(!checkingArr.includes(swapTransaction.htlcid)) {
                    checkingArr.push(swapTransaction.htlcid);
                    swapTransactionsArr.push({
                        htlcid: swapTransaction.htlcid, 
                        sendparty: swapTransaction.sendparty, 
                        sendpartyaddress: swapTransaction.sendpartyaddress, 
                        receiveparty: swapTransaction.receiveparty, 
                        receivepartyaddress: swapTransaction.receivepartyaddress, 
                        sendvalue: swapTransaction.sendvalue, 
                        sendtype: swapTransaction.sendtype, 
                        receivevalue: swapTransaction.receivevalue, 
                        receivetype: swapTransaction.receivetype, 
                        htlcstatus: swapTransaction.htlcstatus, 
                        sendtimeout: swapTransaction.sendtimeout, 
                        htlchash: swapTransaction.htlchash
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
                                <p className="font-semibold text-2xl text-purple-800">Swap Transaction History</p>
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
                                                {swapTransactionsArr.length ? swapTransactionsArr.map(swapTransactionIndex => (
                                                    <tr key={swapTransactionIndex.addressPartyA} className="cursor-pointer" onClick={() => {
                                                        if(swapTransactionIndex.sendtype === "house") {
                                                            swapTransactionIndex.sendtype = "HouseToken";
                                                        } else if(swapTransactionIndex.sendtype === "ETH") {
                                                            swapTransactionIndex.sendtype = "Ether";
                                                        }

                                                        if(swapTransactionIndex.receivetype === "house") {
                                                            swapTransactionIndex.receivetype = "HouseToken";
                                                        } else if(swapTransactionIndex.receivetype === "ETH") {
                                                            swapTransactionIndex.receivetype = "Ether";
                                                        }
                                                        
                                                        history.push({
                                                            pathname: "/dashboard/swap-details",
                                                            state: { detail: swapTransactionIndex.htlcid + "|" + 
                                                                swapTransactionIndex.sendparty + "|" + 
                                                                swapTransactionIndex.sendpartyaddress + "|" + 
                                                                swapTransactionIndex.receiveparty + "|" + 
                                                                swapTransactionIndex.receivepartyaddress + "|" + 
                                                                swapTransactionIndex.sendvalue + " " + swapTransactionIndex.sendtype + " ~ " + swapTransactionIndex.receivevalue + " " + swapTransactionIndex.receivetype + "|" + 
                                                                swapTransactionIndex.htlcstatus + "|" + 
                                                                swapTransactionIndex.sendtimeout + "|" + 
                                                                swapTransactionIndex.htlchash }
                                                        });
                                                    }}>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.htlcid}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.sendparty}<br />
                                                            ({(swapTransactionIndex.sendpartyaddress).substr(0, 6)}....{(swapTransactionIndex.sendpartyaddress).substr((swapTransactionIndex.sendpartyaddress).length - 6, (swapTransactionIndex.sendpartyaddress).length)})
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.receiveparty}<br />
                                                            ({(swapTransactionIndex.receivepartyaddress).substr(0, 6)}....{(swapTransactionIndex.receivepartyaddress).substr((swapTransactionIndex.receivepartyaddress).length - 6, (swapTransactionIndex.receivepartyaddress).length)})
                                                        </td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.sendvalue}&nbsp;{swapTransactionIndex.sendtype}&nbsp;~&nbsp;{swapTransactionIndex.receivevalue}&nbsp;{swapTransactionIndex.receivetype}
                                                        </td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.htlcstatus}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            [DATE]<span className="hidden">|{swapTransactionIndex.sendtimeout}|{swapTransactionIndex.htlchash}</span>
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
