import React from "react";
import { Common_CardUI } from "./Common_CardUI.js";

export const HomePage_DashboardComp = () => {
    const swapTransactionList = [
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
            swapStatus: 'Completed',
            lastTransactionDate: '14 June 2021'
        },
        {
            namePartyA: 'Alice',
            addressPartyA: '0xfn2me1dk7udk4',
            namePartyB: 'Jennifer Emma',
            addressPartyB: '0xky9s4soz2u4dz',
            swapRate: '1 HouseToken ~ 4.082 Ether',
            swapStatus: 'Completed',
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
            swapStatus: 'Completed',
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

    return (
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 h-full">
            <div className="mt-4 px-8 py-1">
                <p className="font-bold text-sm text-purple-700">
                    Welcome, [Party Name]!
                </p>
            </div>
            <div className="flex pl-4 pr-4 mt-2 space-x-3">
                <Common_CardUI title="House Token (Balance)" balance={0} icon={0} />
                <Common_CardUI title="Ether (Balance)" balance={0} icon={1} />
                <Common_CardUI title="Pending Swap Requests" balance={0} icon={2} />
                <Common_CardUI title="Completed Swap Requests" balance={0} icon={3} />
            </div>
            <div className="flex ml-3 mt-6 space-x-6 mr-4">
                {/* Dashboard Content Body */}
                <div className=" bg-white ml-2 shadow-sm w-8/12 rounded-xl  border-2 border-purple-300">
                    <div className="border-b-2 border-purple-300 p-3">
                        <p className="text-purple-800 font-semibold">Latest Swap Transactions</p>
                    </div>
                    <div className="flex flex-col p-3">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block max-w-full sm:px-6 lg:px-8">
                                <div className="shadow max-h-80 overflow-auto border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full">
                                        <thead className="divide-y divide-gray-300">
                                            <tr>
                                                <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Party A</th>
                                                <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Party B</th>
                                                <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Rate</th>
                                                <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Status</th>
                                                <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Last Transaction Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-300">
                                            {swapTransactionList.map((swapTransaction) => (
                                                <tr key={swapTransaction.addressPartyA} className="cursor-pointer">
                                                    <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                        {swapTransaction.namePartyA}<br/>
                                                        ({(swapTransaction.addressPartyA).substr(0, 4)}....{(swapTransaction.addressPartyA).substr((swapTransaction.addressPartyA).length-4, (swapTransaction.addressPartyA).length)})
                                                    </td>
                                                    <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                        {swapTransaction.namePartyB}<br/>
                                                        ({(swapTransaction.addressPartyB).substr(0, 4)}....{(swapTransaction.addressPartyB).substr((swapTransaction.addressPartyB).length-4, (swapTransaction.addressPartyB).length)})
                                                    </td>
                                                    <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                        {(swapTransaction.swapRate).split(" ~ ")[0]} ~ <br/>{(swapTransaction.swapRate).split(" ~ ")[1]}
                                                    </td>
                                                    <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">{swapTransaction.swapStatus}</td>
                                                    <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">{swapTransaction.lastTransactionDate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content Body (Right) */}
                <div className="bg-white w-4/12 rounded-xl border-2 border-purple-300">
                    <div className="border-b-2 border-purple-300 p-3">
                        <p className="text-purple-800 font-semibold">My Swap History</p>
                    </div>

                    <div className="p-4 flex items-center justify-center mt-12 mb-12">
                        <div className="flex justify-center items-center h-48 w-48 rounded-full" style={{ borderWidth: "16px" }} >
                            <div className="flex justify-center items-center border-gray-200 h-44 w-44 rounded-full">
                                <div className="flex flex-col justify-center items-center shadow-2xl h-32 w-32 rounded-full">
                                    <p className="text-gray-800 font-semibold">0 Ether</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
