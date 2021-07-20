import React, { Component } from "react";

import axios from "axios";

const pendingSwapList = [
    {
        namePartyA: 'Alice',
        addressPartyA: '0xfn2me1dk7udk4',
        namePartyB: 'David Cook',
        addressPartyB: '0xg5am21dn8uds1',
        swapRate: '1 HouseToken ~ 2.2208 Ether',
        swapStatus: 'Pending Swap',
        lastTransactionDate: '18 June 2021'
    },
    {
        namePartyA: 'Jenny White',
        addressPartyA: '0xg2ns4odn1zms3',
        namePartyB: 'Alice',
        addressPartyB: '0xfn2me1dk7udk4',
        swapRate: '1 Ether ~ 0.9960 HouseToken',
        swapStatus: 'Pending Swap',
        lastTransactionDate: '17 June 2021'
    },
    {
        namePartyA: 'Lisa Edison',
        addressPartyA: '0xa7ng9kd2ad2g9',
        namePartyB: 'Alice',
        addressPartyB: '0xfn2me1dk7udk4',
        swapRate: '1 HouseToken ~ 3.111 Ether',
        swapStatus: 'Pending Swap',
        lastTransactionDate: '14 June 2021'
    },
    {
        namePartyA: 'Alice',
        addressPartyA: '0xfn2me1dk7udk4',
        namePartyB: 'Jennifer Emma',
        addressPartyB: '0xky9s4soz2u4dz',
        swapRate: '1 HouseToken ~ 4.082 Ether',
        swapStatus: 'Pending Swap',
        lastTransactionDate: '14 June 2021'
    },
    {
        namePartyA: 'Alice',
        addressPartyA: '0xfn2me1dk7udk4',
        namePartyB: 'Helen Aiden',
        addressPartyB: '0xbs0fga2y3v6ds',
        swapRate: '1 HouseToken ~ 4.082 Ether',
        swapStatus: 'Pending Swap',
        lastTransactionDate: '13 June 2021'
    },
    {
        namePartyA: 'Maggie Blue',
        addressPartyA: '0xuvx3s52st2sgn',
        namePartyB: 'Alice',
        addressPartyB: '0xfn2me1dk7udk4',
        swapRate: '1 HouseToken ~ 3.111 Ether',
        swapStatus: 'Pending Swap',
        lastTransactionDate: '12 June 2021'
    },
    {
        namePartyA: 'Alice',
        addressPartyA: '0xz2fhaes62g2df',
        namePartyB: 'Tony Blaine',
        addressPartyB: '0xky9s4soz2u4dz',
        swapRate: '1 HouseToken ~ 1.224 Ether',
        swapStatus: 'Pending Swap',
        lastTransactionDate: '09 June 2021'
    }
];


export class HomePage_PendingSwapsListComp extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        pendingSwaps: []
    }

    /* componentDidMount() */
    componentDidMount() {
        axios.get('http://').then(res => {
            const pendingSwaps = res.data;
            this.setState({pendingSwaps});
        })
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
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Party A</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Party B</th>
                                                    <th scope="col" className="sticky top-0 px-5 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Rate</th>
                                                    <th scope="col" className="sticky top-0 px-5 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Status</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Last Transaction Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300">
                                                {(this.state).pendingSwaps.map((pendingSwapIndex) => (
                                                    <tr key={pendingSwapIndex.addressPartyA} className="cursor-pointer" onClick={() => {
                                                        history.push({
                                                            pathname: "/dashboard/swap-details",
                                                            state: { detail: pendingSwapIndex.namePartyA + "|" + pendingSwapIndex.addressPartyA + "|" + pendingSwapIndex.namePartyB + "|" + pendingSwapIndex.addressPartyB + "|" + pendingSwapIndex.swapRate + "|" + pendingSwapIndex.swapStatus + "|" + pendingSwapIndex.lastTransactionDate }
                                                        });
                                                    }}>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">{pendingSwapIndex.namePartyA}<br />({pendingSwapIndex.addressPartyA})</td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">{pendingSwapIndex.namePartyB}<br />({pendingSwapIndex.addressPartyB})</td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">{pendingSwapIndex.swapRate}</td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">{pendingSwapIndex.swapStatus}</td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">{pendingSwapIndex.lastTransactionDate}</td>
                                                    </tr>
                                                ))}
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
