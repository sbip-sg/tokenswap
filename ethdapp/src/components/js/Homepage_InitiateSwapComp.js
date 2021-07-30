import React, { Component, useRef } from "react";

import Web3 from "web3";
import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider";
import { fieldValidation } from "../support/FieldValidation.js";
import classnames from "classnames";

import SwapHorizontalCircleTwoToneIcon from "@material-ui/icons/SwapHorizontalCircleTwoTone";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
axios.defaults.withCredentials = true;
const initialState = {
    SendParty: { value: '', validateOnChange: false, error: '' },
    SendPartyAddress: { value: '', validateOnChange: false, error: '' },
    SendValue: { value: '', validateOnChange: false, error: '' },
    SendType: { value: '', validateOnChange: false, error: '' },
    ReceiveParty: { value: '', validateOnChange: false, error: '' },
    ReceivePartyAddress: { value: '', validateOnChange: false, error: '' },
    ReceiveValue: { value: '', validateOnChange: false, error: '' },
    ReceiveType: { value: '', validateOnChange: false, error: '' },
    Secret: { value: '', validateOnChange: false, error: '' },
    Timeoutnum: { value: '', validateOnChange: false, error: '' },
    submitCalled: false,
    allFieldsValidated: false,
    Balance:''
};

export class Homepage_InitiateSwapComp extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    retrieveSelfAddress = async () => {
        /* ============ THIS LINE REQUIRES FIXING ======== */
        // const [currentForExc, currentToRec, secretKey, recipientPartyName, recipientPartyAddress] = new Array(5).fill(useRef(null));

        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        /* [TEST]: DEPLOYMENT OF SMART CONTRACT */
        /*
        var myContract = await new web3.eth.Contract(abi);
        const deployTx = myContract.deploy({
            data: code,
            arguments: [recipientPartyAddress.current.value, secretKey.current.value]
        }).send({
            from: accounts[0]
        }).on('receipt', function (receipt) {
            console.log(receipt.contractAddress) // contains the new contract address
        });

        return myContract;
        */
    };
      /* componentDidMount() is invoked immediately after a component is mounted */
      componentDidMount() {
        this.getData();
    }

    async getData() {

        await axios({
            method: 'POST',
            url: 'http://172.26.186.111:10050/corda/balance',
            data: { symbol :"house" },
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN")  }
        }).then(res => {
            var resultData = JSON.parse(res.data['data']);
            console.log(resultData);
            this.setState({
                Balance:resultData.balance +" Husetoken "
            })
        });
        
    }
    handleBlur(validationFunc, e) {
        const field = e.target.name;
        if ((this.state[field]['validateOnChange'] === false) && (this.state.submitCalled === false)) {
            this.setState(state => ({
                [field]: {
                    ...state[field],
                    validateOnChange: true,
                    error: validationFunc(state[field].value)
                }
            }));
        }
        return;
    }

    handleChange(validationFunc, e) {
        const field = e.target.name;
        const fieldVal = e.target.value;
        this.setState(state => ({
            [field]: {
                ...state[field],
                value: fieldVal,
                error: state[field]['validateOnChange'] ? validationFunc(fieldVal) : ''
            }
        }));
    }

    initiateSmartContract(e) {
        e.preventDefault();
        // const senderInfo = this.retrieveSelfAddress();
        const { location } = this.props;
        const { SendValue, SendType, ReceiveParty, ReceivePartyAddress, ReceiveValue, ReceiveType, Secret, Timeoutnum } = this.state;
        const sendValueError = fieldValidation.validateTransValue(SendValue.value);
        const receivePartyError = fieldValidation.validateText(ReceiveParty.value);
        const receivePartyAddressError = fieldValidation.validateText(ReceivePartyAddress.value);
        const receiveValueError = fieldValidation.validateTransValue(ReceiveValue.value);
        const secretError = fieldValidation.validateText(Secret.value);
        const timeoutnumError = fieldValidation.validateTimeout(Timeoutnum.value);

        if ([sendValueError, receivePartyError, receivePartyAddressError, receiveValueError, secretError, timeoutnumError].every(e => e === false)) {
            this.setState({ ...initialState, allFieldsValidated: true });

            axios({
                method: 'POST',
                url: 'http://172.26.186.111:10050/corda/initswap',
                data: {
                    SendParty: localStorage.getItem("PARTY_NAME"),
                    SendPartyAddress: (location.state.detail).split("|")[0],
                    SendValue: SendValue.value,
                    SendType: SendType.value,
                    ReceiveParty: ReceiveParty.value,
                    ReceivePartyAddress: ReceivePartyAddress.value,
                    ReceiveValue: ReceiveValue.value,
                    ReceiveType: ReceiveType.value,
                    Secret: Secret.value,
                    Timeoutnum: Timeoutnum.value
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                if (res.data.code === 200) {
                    window.alert("You have successfully initiated a Smart Contract to " + ReceiveParty.value + ".");
                    console.log("SUCCESSFULLY INITIATED SMART CONTRACT: " + res.status);

                    this.props.history.push({
                        pathname: "/dashboard/pending-swapslist"
                    });
                } else {
                    window.alert("Error occurred while initiating a Smart Contract to " + ReceiveParty.value + ". Please try again later.");
                    console.log("ERROR INITIATING SMART CONTRACT: " + res.status);
                }
            }).catch((err) => {
                window.alert("Error occurred while initiating a Smart Contract to " + ReceiveParty.value + ". Please try again later.");
                console.log("ERROR INITIATING SMART CONTRACT: " + err);
            });
        } else {
            this.setState(state => ({
                SendValue: { ...state.SendValue, validateOnChange: true, error: sendValueError },
                ReceiveParty: { ...state.ReceiveParty, validateOnChange: true, error: receivePartyError },
                ReceivePartyAddress: { ...state.ReceivePartyAddress, validateOnChange: true, error: receivePartyAddressError },
                ReceiveValue: { ...state.ReceiveValue, validateOnChange: true, error: receiveValueError },
                Secret: { ...state.Secret, validateOnChange: true, error: secretError },
                Timeoutnum: { ...state.Timeoutnum, validateOnChange: true, error: timeoutnumError },
            }));
        }
    };

    render() {
        // const { router, params, location, routes } = this.props;
        const { location } = this.props;
        const { SendValue, SendType, ReceiveParty, ReceivePartyAddress, ReceiveValue, ReceiveType, Secret, Timeoutnum } = this.state;

        return (
            <div className="bg-purple-200 mx-auto max-w-6xl py-3 px-3 lg:px-4 shadow-xl mb-12">
                <form onSubmit={e => this.initiateSmartContract(e)}>
                    <div className="bg-white shadow-lg rounded px-8 pb-4 mb-3 flex-col">
                        <div className="-mx-3 md:flex mb-6 border-b-2 border-purple-300 pt-3 pb-3">
                            <div className="md:w-11/11 md:mb-0">
                                <p className="font-semibold text-2xl text-purple-800">Initiate Swap</p>
                                <p className="uppercase pt-2 text-xs text-indigo-500 font-bold">
                                    [ Account Balance: {this.state.Balance + (location.state.detail).split("|")[1]} Ether ]
                                </p>
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-5/11 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2">
                                    Currency Type to Use for the Swap <br />
                                    <span className="text-red-500">(To be Received by Receipient)</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        className={classnames('form-control', { 'is-valid': SendValue.error === false }, { 'is-invalid': SendValue.error }, 'w-full h-auto block py-3 px-3 pr-36 bg-purple-200 text-sm text-black rounded-md')}
                                        type="text" name="SendValue" value={SendValue.value} placeholder="(Please enter Currency Value)"
                                        onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                        onBlur={e => this.handleBlur(fieldValidation.validateText, e)} />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <select
                                            className="h-auto py-3 pl-2 pr-4 border-l-2 border-gray-400 bg-transparent text-sm text-black rounded-md"
                                            name="SendType" value={SendType.value} defaultValue="house"
                                            onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                            onBlur={e => this.handleBlur(fieldValidation.validateText, e)}>
                                            <option value="DEFAULT" >Choose the tokentype ...</option>
                                            <option value="house" >HouseToken</option>
                                            <option value="ETH">Ether</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/11 px-3 pb-3 m-auto flex justify-center">
                                <SwapHorizontalCircleTwoToneIcon />
                            </div>
                            <div className="md:w-5/11 px-3">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2">
                                    Currency Type to Receive from the Swap <br />
                                    <span className="text-red-500">(To be Received by Initiator)</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        className={classnames('form-control', { 'is-valid': ReceiveValue.error === false }, { 'is-invalid': ReceiveValue.error }, 'w-full h-auto py-3 px-3 pr-36 bg-purple-200 text-sm text-black rounded-md')}
                                        type="text" name="ReceiveValue" value={ReceiveValue.value} placeholder="(Please enter Currency Value)"
                                        onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                        onBlur={e => this.handleBlur(fieldValidation.validateText, e)} />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <select
                                            className="h-auto py-3 pl-2 pr-4 border-l-2 border-gray-400 bg-transparent text-sm text-black rounded-md"
                                            name="ReceiveType" value={ReceiveType.value} defaultValue="house"
                                            onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                            onBlur={e => this.handleBlur(fieldValidation.validateText, e)}>
                                            <option value="DEFAULT" >Choose the tokentype ...</option>
                                            <option value="house">HouseToken</option>
                                            <option  value="ETH">Ether</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-2/3 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2">
                                    Secret Key
                                </label>
                                <input
                                    className={classnames('form-control', { 'is-valid': Secret.error === false }, { 'is-invalid': Secret.error }, 'w-full h-auto block py-3 px-3 mb-3 bg-purple-200 text-sm text-black rounded-md')}
                                    type="text" name="Secret" placeholder="" value={Secret.value}
                                    onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                    onBlur={e => this.handleBlur(fieldValidation.validateText, e)} />
                            </div>
                            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2">
                                    Timeout Duration (In Seconds)
                                </label>
                                <input
                                    className={classnames('form-control', { 'is-valid': Timeoutnum.error === false }, { 'is-invalid': Timeoutnum.error }, 'w-full h-auto block py-3 px-3 mb-3 bg-purple-200 text-sm text-black rounded-md')}
                                    type="text" name="Timeoutnum" placeholder="(EXAMPLE: 60)" value={Timeoutnum.value}
                                    onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                    onBlur={e => this.handleBlur(fieldValidation.validateText, e)} />
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2">
                                    Recipient Party Name
                                </label>
                                <input
                                    className={classnames('form-control', { 'is-valid': ReceiveParty.error === false }, { 'is-invalid': ReceiveParty.error }, 'w-full h-auto block py-3 px-3 mb-3 bg-purple-200 text-sm text-black rounded-md')}
                                    type="text" name="ReceiveParty" placeholder="" value={ReceiveParty.value}
                                    onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                    onBlur={e => this.handleBlur(fieldValidation.validateText, e)} />
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2">
                                    Recipient Address
                                </label>
                                <input
                                    className={classnames('form-control', { 'is-valid': ReceivePartyAddress.error === false }, { 'is-invalid': ReceivePartyAddress.error }, 'w-full h-auto block py-3 px-3 mb-3 bg-purple-200 text-sm text-black rounded-md')}
                                    type="text" name="ReceivePartyAddress" placeholder="(EXAMPLE: 0x012345abcde012345)" value={ReceivePartyAddress.value}
                                    onChange={e => this.handleChange(fieldValidation.validateText, e)}
                                    onBlur={e => this.handleBlur(fieldValidation.validateText, e)} />
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-2">
                            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                                <button className="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center"
                                    type="submit"
                                    onMouseDown={() => this.setState({ submitCalled: true })}>
                                    <PostAddTwoToneIcon />
                                    <span>&nbsp;Initiate Swap</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
