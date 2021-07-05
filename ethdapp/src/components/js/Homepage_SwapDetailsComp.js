import React from "react";
import { useLocation } from "react-router-dom";

import SwapHorizontalCircleTwoToneIcon from "@material-ui/icons/SwapHorizontalCircleTwoTone";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import CancelPresentationSharpIcon from "@material-ui/icons/CancelPresentationSharp";
import SettingsBackupRestoreTwoToneIcon from "@material-ui/icons/SettingsBackupRestoreTwoTone";

export const Homepage_SwapDetailsComp = () => {
    const location = useLocation();
    
    const deploySmartContract = async() => {
        /* PENDING INPUT FOR RELEVANT SOURCE CODES */
    }

    const withdrawExchangedSwap = async() => {
        /* PENDING INPUT FOR RELEVANT SOURCE CODES */
    }

    const refundExchangedSwap = async() => {
        /* PENDING INPUT FOR RELEVANT SOURCE CODES */
    }
    
    return (
        <div className="bg-purple-200 mx-auto max-w-6xl py-3 px-3 lg:px-4 shadow-xl mb-12">
            <form>
                <div className="bg-white shadow-lg rounded px-8 pb-4 mb-3 flex-col">
                    <div className="-mx-3 md:flex mb-6 border-b-2 border-purple-300 pt-3 pb-3">
                        <div className="md:w-11/11 md:mb-0">
                            <p className="font-semibold text-2xl text-purple-800">Swap Details</p>
                            <p className="uppercase pt-2 text-xs text-indigo-500 font-bold">
                                [ Swap Status: {(location.state.detail).split("|")[5]} ]
                            </p>
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-5/11 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_currencyForExc">
                                Currency Type to Use for the Swap <br/>
                                <span className="text-red-500">(To be Received by Receipient)</span>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input className="w-full block py-3 pl-3 pr-36 bg-purple-200 text-sm text-black rounded-md" type="text" id="txt_currencyForExc" placeholder="" value={(((location.state.detail).split("|")[4]).split(" ~ ")[0]).split(" ")[0]} disabled />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <select className="py-3 pl-2 pr-4 border-l-2 border-gray-400 bg-transparent text-sm text-black rounded-md" id="sel_currencyForExc" name="sel_currencyForExc" 
                                        value={(((location.state.detail).split("|")[4]).split(" ~ ")[0]).split(" ")[1]} disabled>
                                        <option>HouseToken</option>
                                        <option>Ether</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/11 px-3 pb-3 m-auto flex justify-center">
                            <SwapHorizontalCircleTwoToneIcon />
                        </div>
                        <div className="md:w-5/11 px-3">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_currencyToRec">
                                Currency Type to Receive from the Swap <br/>
                                <span className="text-red-500">(To be Received by Initiator)</span>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input className="w-full block py-3 pl-3 pr-36 bg-purple-200 text-sm text-black rounded-md" type="text" id="txt_currencyToRec" placeholder="" value={(((location.state.detail).split("|")[4]).split(" ~ ")[1]).split(" ")[0]} disabled />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <select className="py-3 pl-2 pr-4 border-l-2 border-gray-400 bg-transparent text-sm text-black rounded-md" id="sel_currencyToRec" name="sel_currencyToRec" 
                                        value={(((location.state.detail).split("|")[4]).split(" ~ ")[1]).split(" ")[1]} disabled>
                                        <option>HouseToken</option>
                                        <option>Ether</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-2/3 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_secretKey">
                                Secret Key
                            </label>
                            <input className="w-full bg-purple-200 text-black text-sm border border-gray-300 rounded py-3 px-4 mb-3" type="text" id="txt_secretKey" placeholder="" disabled />
                        </div>
                        <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_timeoutDuration">
                                Timeout Duration (In Seconds)
                            </label>
                            <input className="w-full bg-purple-200 text-black text-sm border border-gray-300 rounded py-3 px-4 mb-3" type="text" id="txt_timeoutDuration" placeholder="" disabled />
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_initiatorPartyName">
                                Initiator Party Name
                            </label>
                            <input className="w-full bg-purple-200 text-black text-sm border border-gray-300 rounded py-3 px-4 mb-3" type="text" id="txt_initiatorPartyName" placeholder="" value={(location.state.detail).split("|")[0]} disabled />
                        </div>
                        <div className="md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_initiatorAddress">
                                Initiator Address
                            </label>
                            <input className="w-full bg-purple-200 text-black text-sm border border-gray-300 rounded py-3 px-4 mb-3" type="text" id="txt_initiatorAddress" placeholder="" value={(location.state.detail).split("|")[1]} disabled />
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_recipientPartyName">
                                Recipient Party Name
                            </label>
                            <input className="w-full bg-purple-200 text-black text-sm border border-gray-300 rounded py-3 px-4 mb-3" type="text" id="txt_recipientPartyName" placeholder="" value={(location.state.detail).split("|")[2]} disabled />
                        </div>
                        <div className="md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_recipientAddress">
                                Recipient Address
                            </label>
                            <input className="w-full bg-purple-200 text-black text-sm border border-gray-300 rounded py-3 px-4 mb-3" type="text" id="txt_recipientAddress" placeholder="" value={(location.state.detail).split("|")[3]} disabled />
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-2">
                        <div className="md:w-1.75/11 mb-6 md:mb-0">&nbsp;</div>
                        <div className="md:w-2.5/11 px-1 mb-6 md:mb-0">
                            <button onClick={deploySmartContract} class="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                                <PostAddTwoToneIcon />
                                <span>&nbsp;Deploy Smart Contract</span>
                            </button>
                        </div>
                        <div className="md:w-2.5/11 px-1 mb-6 md:mb-0">
                            <button onClick={withdrawExchangedSwap} class="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                                <CancelPresentationSharpIcon />
                                <span>&nbsp;Withdraw Exchanged Swap</span>
                            </button>
                        </div>
                        <div className="md:w-2.5/11 px-1 mb-6 md:mb-0">
                            <button onClick={refundExchangedSwap} class="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                                <SettingsBackupRestoreTwoToneIcon />
                                <span>&nbsp;Refund Exchanged Swap</span>
                            </button>
                        </div>
                        <div className="md:w-1.75/11 mb-6 md:mb-0">&nbsp;</div>
                    </div>
                </div>
            </form>
        </div>
    );
}
