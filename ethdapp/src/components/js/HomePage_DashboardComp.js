import React from "react";
import { Common_CardUI } from "./Common_CardUI.js";

export const HomePage_DashboardComp = () => {
    const swapTransactionList = [
        {
            partyA: 'Jane Cooper',
            partyB: 'David Cook',
            swapRate: '1 HT ~ 2.2208 Ether',
            swapStatus: 'Completed',
            lastTransactionDate: '18 June 2021'
        },
        {
            partyA: 'Jenny White',
            partyB: 'Ronald Stephen',
            swapRate: '1 Ether ~ 0.9960 HT',
            swapStatus: 'Pending Swap',
            lastTransactionDate: '17 June 2021'
        },
        {
            partyA: 'Lisa Edison',
            partyB: 'Patricia Morrison',
            swapRate: '1 HT ~ 3.111 Ether',
            swapStatus: 'Completed',
            lastTransactionDate: '14 June 2021'
        },
        {
            partyA: 'Robert Noah',
            partyB: 'Jennifer Emma',
            swapRate: '1 HT ~ 4.082 Ether',
            swapStatus: 'Completed',
            lastTransactionDate: '14 June 2021'
        },
        {
            partyA: 'Madeline Olivia',
            partyB: 'Helen Aiden',
            swapRate: '1 HT ~ 4.082 Ether',
            swapStatus: 'Completed',
            lastTransactionDate: '13 June 2021'
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
                <Common_CardUI title="House Token (Balance)" balance={409.0790} icon={0} />
                <Common_CardUI title="Ether (Balance)" balance={300.0790} icon={1} />
                <Common_CardUI title="Pending Swap Requests" balance={20} icon={2} />
                <Common_CardUI title="Completed Swap Requests" balance={33} icon={3} />
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
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-purple-400 w-auto">
                                            <tr>
                                                <th scope="col" className="top-0 px-4 py-3 text-left text-sm text-white font-medium text-gray-500 uppercase tracking-wider">Party A</th>
                                                <th scope="col" className="top-0 px-4 py-3 text-left text-sm text-white font-medium text-gray-500 uppercase tracking-wider">Party B</th>
                                                <th scope="col" className="top-0 px-4 py-3 text-left text-sm text-white font-medium text-gray-500 uppercase tracking-wider">Swap Rate</th>
                                                <th scope="col" className="top-0 px-4 py-3 text-left text-sm text-white font-medium text-gray-500 uppercase tracking-wider">Swap Status</th>
                                                <th scope="col" className="top-0 px-4 py-3 text-left text-sm text-white font-medium text-gray-500 uppercase tracking-wider">Last Transaction Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 w-auto">
                                            {swapTransactionList.map((swapTransaction) => (
                                                <tr key={swapTransaction.email} className="hover:bg-purple-200 cursor-pointer">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{swapTransaction.partyA}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{swapTransaction.partyB}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{swapTransaction.swapRate}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{swapTransaction.swapStatus}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{swapTransaction.lastTransactionDate}</td>
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
                                    <p className="text-gray-800 font-semibold">17.0216 Ether</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
