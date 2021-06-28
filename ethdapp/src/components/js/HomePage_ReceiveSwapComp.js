import React from 'react'

import SwapHorizontalCircleTwoToneIcon from "@material-ui/icons/SwapHorizontalCircleTwoTone";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import CancelPresentationSharpIcon from "@material-ui/icons/CancelPresentationSharp";
import SettingsBackupRestoreTwoToneIcon from "@material-ui/icons/SettingsBackupRestoreTwoTone";

export const HomePage_ReceiveSwapComp = () => {
    return (
        <div className="flex ml-3 mr-4 mt-10 space-x-6 flex items-center justify-center">
            <div className="bg-white ml-2 shadow-sm w-10/12 rounded-xl border-2 border-purple-300">
                <div className="border-b-2 border-purple-300 p-3">
                    <p className="font-semibold text-lg">Receive Swap</p>
                    <label className="block text-sm font-medium text-gray-700">
                            (Swap Status: <u>Pending Swap</u>)
                    </label>
                </div>
                <div className="flex flex-wrap pl-4 pr-4 pt-4">
                    <div className="w-5/12 bg-white h-auto">
                        <label htmlFor="txt_currencyForExc" className="block text-sm font-medium text-gray-700">
                            Currency Type to Use for the Swap:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm border-2 border-purple-400">
                            <input type="text" name="txt_currencyForExc" id="txt_currencyForExc"
                                className="md:w-auto pl-3 pr-3 rounded-md border-r border-purple-400" placeholder="Currency Value" />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <select id="sel_currencyForExc" name="sel_currencyForExc"
                                    className="h-full py-0 pl-3 pr-3 bg-transparent rounded-md border-purple-400">
                                    <option>House Token</option>
                                    <option>Ether</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white m-auto">
                        <SwapHorizontalCircleTwoToneIcon />
                    </div>
                    <div className="w-5/12 bg-white">
                        <label htmlFor="txt_currencyToRec" className="block text-sm font-medium text-gray-700">
                            Currency Type to Receive from the Swap:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm border-2 border-purple-400">
                            <input type="text" name="txt_currencyToRec" id="txt_currencyToRec"
                                className="md:w-auto pl-3 pr-3 rounded-md border-r border-purple-400" placeholder="Currency Value" />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <select id="sel_currencyToRec" name="sel_currencyToRec"
                                    className="h-full py-0 pl-3 pr-3 bg-transparent rounded-md border-purple-400">
                                    <option>House Token</option>
                                    <option>Ether</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap pl-4 pr-4 pb-2 mt-1">
                    <div className="w-7/12 bg-white h-auto">
                        <label htmlFor="txt_exchangeRate" className="block text-sm font-medium text-red-500 text-xs">
                            (Exchange Rate: 1 HT = 2 Ether)
                        </label>
                    </div>
                    <div className="w-5/12 bg-white">&nbsp;</div>
                </div>
                
                <div className="flex flex-wrap pl-4 pr-4 mt-1">
                    <div className="w-7/12 bg-white h-auto">
                        <label htmlFor="txt_secretKey" className="block text-sm font-medium text-gray-700">
                            Secret Key:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm border-2 border-purple-400">
                            <input type="text" name="txt_secretKey" id="txt_secretKey"
                                className="w-full pl-3 pr-3 rounded-md" placeholder="" />
                        </div>
                    </div>
                    <div className="w-5/12 bg-white">&nbsp;</div>
                </div>

                <div className="flex flex-wrap pl-4 pr-4 mt-4">
                    <div className="w-5/12 bg-white h-auto">
                        <label htmlFor="txt_recipientPartyName" className="block text-sm font-medium text-gray-700">
                            Recipient Party Name:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm border-2 border-purple-400">
                            <input type="text" name="txt_recipientPartyName" id="txt_recipientPartyName"
                                className="w-full pl-3 pr-3 rounded-md" placeholder="" />
                        </div>
                    </div>
                    <div className="w-1/12 bg-white">&nbsp;</div>
                    <div className="w-6/12 bg-white h-auto">
                        <label htmlFor="txt_recipientAddress" className="block text-sm font-medium text-gray-700">
                            Recipient Address:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm border-2 border-purple-400">
                            <input type="text" name="txt_recipientAddress" id="txt_recipientAddress"
                                className="w-full pl-3 pr-3 rounded-md" placeholder="e.g. 0x012345abcde012345" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap pl-4 pr-4 mt-6 mb-6 space-x-3">
                    <div className="w-1/12 bg-white">&nbsp;</div>
                    <div className="w-3/12 bg-white h-auto">
                        <button class="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                            <PostAddTwoToneIcon />
                            <span>&nbsp;Deploy Smart Contract</span>
                        </button>
                    </div>
                    <div className="w-3/12 bg-white h-auto">
                        <button class="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                            <CancelPresentationSharpIcon />
                            <span>&nbsp;Withdraw Exchanged Swap</span>
                        </button>
                    </div>
                    <div className="w-3/12 bg-white h-auto">
                        <button class="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                            <SettingsBackupRestoreTwoToneIcon />
                            <span>&nbsp;Refund Exchanged Swap</span>
                        </button>
                    </div>
                    <div className="w-4/12 bg-white">&nbsp;</div>
                </div>
            </div>
        </div>
    );
}
