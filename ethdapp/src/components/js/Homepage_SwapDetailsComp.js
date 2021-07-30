import React, { Component,Spinner } from "react";

import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

import SwapHorizontalCircleTwoToneIcon from "@material-ui/icons/SwapHorizontalCircleTwoTone";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import CancelPresentationSharpIcon from "@material-ui/icons/CancelPresentationSharp";
import SettingsBackupRestoreTwoToneIcon from "@material-ui/icons/SettingsBackupRestoreTwoTone";

const abi = JSON.parse('[ { "inputs": [ { "internalType": "address", "name": "_recipient", "type": "address" }, { "internalType": "bytes32", "name": "_hash", "type": "bytes32" }, { "internalType": "uint256", "name": "_lockTime", "type": "uint256" } ], "stateMutability": "payable", "type": "constructor" }, { "inputs": [], "name": "amount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getSecret", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "hash", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lockTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "recipient", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "refund", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "startTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_secret", "type": "string" } ], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]');
const code = "0x60806040526105dc60015560405162000f5938038062000f5983398181016040528101906200002f91906200011b565b82600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160038190555042600081905550806001819055503460068190555050505062000207565b600081519050620000e781620001b9565b92915050565b600081519050620000fe81620001d3565b92915050565b6000815190506200011581620001ed565b92915050565b6000806000606084860312156200013157600080fd5b60006200014186828701620000d6565b93505060206200015486828701620000ed565b9250506040620001678682870162000104565b9150509250925092565b60006200017e826200018f565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b620001c48162000171565b8114620001d057600080fd5b50565b620001de8162000185565b8114620001ea57600080fd5b50565b620001f881620001af565b81146200020457600080fd5b50565b610d4280620002176000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80635b9fdc30116100665780635b9fdc30146100fa57806366d003ac1461011857806378e97925146101365780638da5cb5b14610154578063aa8c217c1461017257610093565b806309bd5a60146100985780630d668087146100b657806331fb67c2146100d4578063590e1ae3146100f0575b600080fd5b6100a0610190565b6040516100ad91906109f3565b60405180910390f35b6100be610196565b6040516100cb9190610ab0565b60405180910390f35b6100ee60048036038101906100e991906107ba565b61019c565b005b6100f8610381565b005b610102610535565b60405161010f9190610a0e565b60405180910390f35b610120610657565b60405161012d91906109d8565b60405180910390f35b61013e61067d565b60405161014b9190610ab0565b60405180910390f35b61015c610683565b60405161016991906109d8565b60405180910390f35b61017a6106a9565b6040516101879190610ab0565b60405180910390f35b60035481565b60015481565b600354816040516020016101b091906109ac565b6040516020818303038152906040528051906020012014610206576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101fd90610a50565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610296576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161028d90610a30565b60405180910390fd5b80600290805190602001906102ac9291906106af565b506000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166006546040516102f7906109c3565b60006040518083038185875af1925050503d8060008114610334576040519150601f19603f3d011682016040523d82523d6000602084013e610339565b606091505b505090508061037d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161037490610a70565b60405180910390fd5b5050565b6001546000546103919190610b5e565b42116103d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103c990610a90565b60405180910390fd5b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610462576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045990610a30565b60405180910390fd5b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166006546040516104ac906109c3565b60006040518083038185875af1925050503d80600081146104e9576040519150601f19603f3d011682016040523d82523d6000602084013e6104ee565b606091505b5050905080610532576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161052990610a70565b60405180910390fd5b50565b6060600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146105c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105be90610a30565b60405180910390fd5b600280546105d490610c3c565b80601f016020809104026020016040519081016040528092919081815260200182805461060090610c3c565b801561064d5780601f106106225761010080835404028352916020019161064d565b820191906000526020600020905b81548152906001019060200180831161063057829003601f168201915b5050505050905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60005481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60065481565b8280546106bb90610c3c565b90600052602060002090601f0160209004810192826106dd5760008555610724565b82601f106106f657805160ff1916838001178555610724565b82800160010185558215610724579182015b82811115610723578251825591602001919060010190610708565b5b5090506107319190610735565b5090565b5b8082111561074e576000816000905550600101610736565b5090565b600061076561076084610afc565b610acb565b90508281526020810184848401111561077d57600080fd5b610788848285610bfa565b509392505050565b600082601f8301126107a157600080fd5b81356107b1848260208601610752565b91505092915050565b6000602082840312156107cc57600080fd5b600082013567ffffffffffffffff8111156107e657600080fd5b6107f284828501610790565b91505092915050565b61080481610bb4565b82525050565b61081381610bc6565b82525050565b600061082482610b2c565b61082e8185610b42565b935061083e818560208601610c09565b61084781610cfb565b840191505092915050565b600061085d82610b2c565b6108678185610b53565b9350610877818560208601610c09565b80840191505092915050565b6000610890600a83610b42565b91507f77726f6e672075736572000000000000000000000000000000000000000000006000830152602082019050919050565b60006108d0600c83610b42565b91507f77726f6e672073656372657400000000000000000000000000000000000000006000830152602082019050919050565b6000610910600083610b37565b9150600082019050919050565b600061092a601083610b42565b91507f5472616e73666572206661696c65642e000000000000000000000000000000006000830152602082019050919050565b600061096a600983610b42565b91507f746f6f206561726c7900000000000000000000000000000000000000000000006000830152602082019050919050565b6109a681610bf0565b82525050565b60006109b88284610852565b915081905092915050565b60006109ce82610903565b9150819050919050565b60006020820190506109ed60008301846107fb565b92915050565b6000602082019050610a08600083018461080a565b92915050565b60006020820190508181036000830152610a288184610819565b905092915050565b60006020820190508181036000830152610a4981610883565b9050919050565b60006020820190508181036000830152610a69816108c3565b9050919050565b60006020820190508181036000830152610a898161091d565b9050919050565b60006020820190508181036000830152610aa98161095d565b9050919050565b6000602082019050610ac5600083018461099d565b92915050565b6000604051905081810181811067ffffffffffffffff82111715610af257610af1610ccc565b5b8060405250919050565b600067ffffffffffffffff821115610b1757610b16610ccc565b5b601f19601f8301169050602081019050919050565b600081519050919050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000610b6982610bf0565b9150610b7483610bf0565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610ba957610ba8610c6e565b5b828201905092915050565b6000610bbf82610bd0565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015610c27578082015181840152602081019050610c0c565b83811115610c36576000848401525b50505050565b60006002820490506001821680610c5457607f821691505b60208210811415610c6857610c67610c9d565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f830116905091905056fea26469706673582212209a4d34aa1bf49daecc096b3ae2eba25a8cb1db9913c5a6f21f97b9975298bcad64736f6c63430008000033";
// const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

export class Homepage_SwapDetailsComp extends Component {
    constructor(props) {
        super(props);
        this.loading = false;
        this.state = {
            showDeployButton: false,
            showWithdrawButton: false,
            showRefundButton: false
        }
        console.log(((this.props.location).state.detail))
        if (((this.props.location).state.detail).split("|")[9].trim() === "process" &&
            ((this.props.location).state.detail).split("|")[3] === localStorage.getItem("PARTY_NAME") &&
            ((this.props.location).state.detail).split("|")[10] === "sendfund" &&
            ((this.props.location).state.detail).split("|")[11] === "null") {
            console.log("show deploy smartcontract");
            this.state.showDeployButton = true;
            this.state.showWithdrawButton = false;
            this.state.showRefundButton = false;
        } else if (((this.props.location).state.detail).split("|")[9].trim() === "process" &&
            ((this.props.location).state.detail).split("|")[10] === "sendfund" &&
            ((this.props.location).state.detail).split("|")[11] === "receivefund") {
            this.state.showDeployButton = false;
            this.state.showWithdrawButton = true;
            this.state.showRefundButton = true;
        } else if (((this.props.location).state.detail).split("|")[9].trim() === "process" &&
            ((this.props.location).state.detail).split("|")[1] === localStorage.getItem("PARTY_NAME") &&
            ((this.props.location).state.detail).split("|")[10] === "sendfund" &&
            ((this.props.location).state.detail).split("|")[11] === "receivewithdraw") {
            this.state.showDeployButton = false;
            this.state.showWithdrawButton = true;
            this.state.showRefundButton = false;
        } else if (((this.props.location).state.detail).split("|")[9].trim() === "process" &&
            ((this.props.location).state.detail).split("|")[3] === localStorage.getItem("PARTY_NAME") &&
            ((this.props.location).state.detail).split("|")[10] === "sendwithdraw" &&
            ((this.props.location).state.detail).split("|")[11] === "receivefund") {
            this.state.showDeployButton = false;
            this.state.showWithdrawButton = true;
            this.state.showRefundButton = false;
        } else if (((this.props.location).state.detail).split("|")[9].trim() === "process" &&
        ((this.props.location).state.detail).split("|")[3] === localStorage.getItem("PARTY_NAME") &&
            ((this.props.location).state.detail).split("|")[10] === "sendrefund" &&
            ((this.props.location).state.detail).split("|")[11] === "receivefund") {
            this.state.showDeployButton = false;
            this.state.showWithdrawButton = false;
            this.state.showRefundButton = true;
    }
    }

    deploySmartContract = async(e) => {
        e.preventDefault();
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        /* ============ THIS SECTION REQUIRES FIXING ======== */
        let contractAddress;
        var myContract = await new web3.eth.Contract(abi);
        var deploySuccess = false;
        this.loading = true;
        console.log(((this.props.location).state.detail).split("|")[2]+" " +((this.props.location).state.detail).split("|")[8])
        console.log("ETH number "+ ((((this.props.location).state.detail).split("|")[5]).split("~")[1]).split(" ")[1])
        const deployTx = await myContract.deploy({
            data: code, 
            arguments: [((this.props.location).state.detail).split("|")[2], ((this.props.location).state.detail).split("|")[8],((this.props.location).state.detail).split("|")[7]/2]
           
        }).send({
            from: accounts[0],
            value: ((((this.props.location).state.detail).split("|")[5]).split("~")[1]).split(" ")[1]*1000000000000000000
        }).on('receipt', function (receipt) {
            console.log(receipt.contractAddress) // contains the new contract address
            contractAddress = receipt.contractAddress;
            deploySuccess = true;
        });
        //update ethereumsmartcontract and status
        // //call smartcontract function
        // myContract = await new web3.eth.Contract(abi,contractAddress);
        // myContract.methods.fund().send(
        //     {from: accounts[0],
        //     value: 0.1*1000000000000000000
        //     })
        // .then(function(receipt){
        //     // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
        //     console.log(receipt);
        // });
       
        if(deploySuccess){
            axios({
                method : 'POST',
                url:'http://172.26.186.111:10050/htlc/updatehtlc',
                data:{
                    HTLCId: ((this.props.location).state.detail).split("|")[0],
                    status:"receivefund",
                    PartyName: localStorage.getItem("PARTY_NAME"),
                    EthContractAddress: contractAddress 
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                window.alert("You have successfully fund your currency used for this exchange.");
                console.log("SUCCESSFULLY Fund: " + res.status);
                console.log("updated htlcstatus " + "receivefund");
                this.props.history.push({
                    pathname: "/dashboard/pending-swapslist"
                });
            }).catch((err) => {
                
                console.log("updated htlcstatus errors: " + err); 
            });
        }
        this.loading = false;
    }
    withdrawExchangedSwap =async(e)=>{
        e.preventDefault();
        if(((this.props.location).state.detail).split("|")[1] === localStorage.getItem("PARTY_NAME")){
            this.withdrawExchangedSwap_ETH(e);
        }
        else if(((this.props.location).state.detail).split("|")[3] === localStorage.getItem("PARTY_NAME")){
            this.withdrawExchangedSwap_Corda(e);
        }
    }

    withdrawExchangedSwap_ETH = async(e) => {
        e.preventDefault();
        let contractAddress = ((this.props.location).state.detail).split("|")[12];
        console.log(contractAddress);
        let secret;
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var withdrawSuccess = false;
        //get secret
        await axios({
            method :'POST',
            url:'http://172.26.186.111:10050/htlc/getsecret',
            data:{
                HTLCId: ((this.props.location).state.detail).split("|")[0],
                PartyName:localStorage.getItem("PARTY_NAME"),
            },
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
        }).then((res) => {
            //window.alert("You have successfully fund your currency used for this exchange.");
            //console.log("SUCCESSFULLY Fund: " + res.status);
            secret = res.data.data;
        }).catch((err) => {
            window.alert("Error occurred while funding your currency used for this exchange. Please try again later.");
            console.log("ERROR PERFORMING WITHDRAW: " + err);
        });
        console.log("secret"+secret)
        var myContract = await new web3.eth.Contract(abi,contractAddress);
        await myContract.methods.withdraw(secret).send(
            {from: accounts[0]
            })
        .then(function(receipt){
            // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
            console.log(receipt);
            withdrawSuccess = true;
        });

        //update htlcstatus
        if(withdrawSuccess){
            axios({
                method : 'POST',
                url:'http://172.26.186.111:10050/htlc/updatehtlc',
                data:{
                    HTLCId: ((this.props.location).state.detail).split("|")[0],
                    status:"sendwithdraw",
                    PartyName: localStorage.getItem("PARTY_NAME")
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                window.alert("You have successfully fund your currency used for this exchange.");
                console.log("SUCCESSFULLY Fund: " + res.status);
                console.log("updated htlcstatus " + "sendwithdraw");
                this.props.history.push({
                    pathname: "/dashboard/pending-swapslist"
                });
            }).catch((err) => {
                
                console.log("updated htlcstatus errors: " + err);
            });
        }
    }

    withdrawExchangedSwap_Corda = async(e) => {
        e.preventDefault();
        //get secret from smartcontract
        let contractAddress = ((this.props.location).state.detail).split("|")[12];
        let secret;
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var myContract = await new web3.eth.Contract(abi,contractAddress);
        await myContract.methods.getSecret().call(
            {from: accounts[0]
            })
        .then(function(result){
            // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
            console.log(result);
            secret = result;
        });

        var withdrawSuccess = false;
        if (window.confirm('Are you sure you want to withdraw your currency used for this exchange and cancel this Smart Contract initiation requst?')) {
           await axios({
                method: 'POST',
                url: 'http://172.26.186.111:10050/corda/htlc_withdraw',
                data: {
                    HTLCId: ((this.props.location).state.detail).split("|")[0],
                    Secret: secret
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                
                withdrawSuccess = true;
                
            }).catch((err) => {
                //timeout
                window.alert("Error occurred while withdrawing your currency used for this exchange. Please try again later.");
                console.log("ERROR PERFORMING WITHDRAW: " + err);
            });
        }
        //update
        if(withdrawSuccess){
            axios({
                method : 'POST',
                url:'http://172.26.186.111:10050/htlc/updatehtlc',
                data:{
                    HTLCId: ((this.props.location).state.detail).split("|")[0],
                    status:"receivewithdraw",
                    PartyName: localStorage.getItem("PARTY_NAME")
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                window.alert("You have successfully withdrawn your currency used for this exchange. The Smart Contract initiation requst has been cancelled.");
                console.log("SUCCESSFULLY WITHDRAWN: " + res.status);
                console.log("updated htlcstatus " + "receivewithdraw");
                this.props.history.push({
                    pathname: "/dashboard/pending-swapslist"
                });
            }).catch((err) => {
                
                console.log("updated htlcstatus errors: " + err);
            });
        }
    }
    refundExchangedSwap =async(e)=>{
        e.preventDefault();
        if(((this.props.location).state.detail).split("|")[3] === localStorage.getItem("PARTY_NAME")){
            this.refundExchangedSwap_ETH(e);
        }
        else if(((this.props.location).state.detail).split("|")[1] === localStorage.getItem("PARTY_NAME")){
            this.refundExchangedSwap_Corda(e);
        }
    }

    refundExchangedSwap_ETH = async(e) => {
        e.preventDefault();

        let contractAddress = ((this.props.location).state.detail).split("|")[12];
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var myContract = await new web3.eth.Contract(abi,contractAddress);
        var refundSuccess = false;
        await myContract.methods.refund().send(
            {from: accounts[0]
            })
        .then(function(receipt){
            // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
            console.log(receipt);
            refundSuccess = true;
        });
        //update htlcstatus
        if(refundSuccess){
            axios({
                method : 'POST',
                url:'http://172.26.186.111:10050/htlc/updatehtlc',
                data:{
                    HTLCId: ((this.props.location).state.detail).split("|")[0],
                    status:"sendwithdraw",
                    PartyName: localStorage.getItem("PARTY_NAME")
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                window.alert("You have successfully cancelled this Smart Contract initiation requst. All currencies used for this exchange have been refunded to both parties.");
                console.log("SUCCESSFULLY REFUNDED: " + res.status);
                console.log("updated htlcstatus " + "receiverefund");
                this.props.history.push({
                    pathname: "/dashboard/pending-swapslist"
                });
            }).catch((err) => {
                
                console.log("updated htlcstatus errors: " + err);
            });
        }
    }

    refundExchangedSwap_Corda = async(e) => {
        e.preventDefault();
        var refundSuccess = false;
        if (window.confirm('Are you sure you want to cancel this Smart Contract initiation requst and refund all currencies used for this exchange?')) {
            await axios({
                method: 'POST',
                url: 'http://172.26.186.111:10050/corda/htlc_refund',
                data: {
                    HTLCId: ((this.props.location).state.detail).split("|")[0]
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                refundSuccess = true;
                
            }).catch((err) => {
                window.alert("Error occurred while cancelling this Smart Contract initiation requst. Please try again later.");
                console.log("ERROR PERFORMING REFUND: " + err);
            });
        }
        //update htlcstatus
        if(refundSuccess){
            axios({
                method : 'POST',
                url:'http://172.26.186.111:10050/htlc/updatehtlc',
                data:{
                    HTLCId: ((this.props.location).state.detail).split("|")[0],
                    status:"sendrefund",
                    PartyName: localStorage.getItem("PARTY_NAME")
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'cordaUUID': localStorage.getItem("LOGIN_ACCESS_TOKEN") }
            }).then((res) => {
                window.alert("You have successfully cancelled this Smart Contract initiation requst. All currencies used for this exchange have been refunded to both parties.");
                console.log("SUCCESSFULLY REFUNDED: " + res.status);
                console.log("updated htlcstatus " + "sendrefund");
                this.props.history.push({
                    pathname: "/dashboard/pending-swapslist"
                });
            }).catch((err) => {
                
                console.log("updated htlcstatus errors: " + err);   
            });
        }
    }

    render() {
        const { location } = this.props;
        const { showDeployButton, showWithdrawButton, showRefundButton } = this.state;

        return (
            <div className="bg-purple-200 mx-auto max-w-6xl py-3 px-3 lg:px-4 shadow-xl mb-12">
                <form>
                    <div className="bg-white shadow-lg rounded px-8 pb-4 mb-3 flex-col">
                        <div className="-mx-3 md:flex mb-6 border-b-2 border-purple-300 pt-3 pb-3">
                            <div className="md:w-11/11 md:mb-0">
                                <p className="font-semibold text-2xl text-purple-800">Swap Details</p>
                                <p className="uppercase pt-2 text-xs text-indigo-500 font-bold">
                                    [ Swap Status: {(location.state.detail).split("|")[6]} ]
                                </p>
                            </div>
                        </div>
                        {!this.loading?<b/>:<Spinner animation="border" role="status">
  <span className="sr-only">Loading...</span>
</Spinner>}
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-5/11 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_currencyForExc">
                                    Currency Type to Use for the Swap <br />
                                    <span className="text-red-500">(To be Received by Receipient)</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input className="w-full block py-3 pl-3 pr-36 bg-purple-200 text-sm text-black rounded-md" type="text" id="txt_currencyForExc" placeholder="" value={(((location.state.detail).split("|")[5]).split(" ~ ")[0]).split(" ")[0]} disabled />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <select className="py-3 pl-2 pr-4 border-l-2 border-gray-400 bg-transparent text-sm text-black rounded-md" id="sel_currencyForExc" name="sel_currencyForExc"
                                            value={(((location.state.detail).split("|")[5]).split(" ~ ")[0]).split(" ")[1]} disabled>
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
                                    Currency Type to Receive from the Swap <br />
                                    <span className="text-red-500">(To be Received by Initiator)</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input className="w-full block py-3 pl-3 pr-36 bg-purple-200 text-sm text-black rounded-md" type="text" id="txt_currencyToRec" placeholder="" value={(((location.state.detail).split("|")[5]).split(" ~ ")[1]).split(" ")[0]} disabled />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <select className="py-3 pl-2 pr-4 border-l-2 border-gray-400 bg-transparent text-sm text-black rounded-md" id="sel_currencyToRec" name="sel_currencyToRec"
                                            value={(((location.state.detail).split("|")[5]).split(" ~ ")[1]).split(" ")[1]} disabled>
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
                                <input className="py-3 pl-3 mb-3 w-full bg-purple-200 text-black text-sm border border-gray-300 rounded" type="text" id="txt_secretKey" placeholder="" value={(location.state.detail).split("|")[8]} disabled />
                            </div>
                            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_timeoutDuration">
                                    Timeout Duration (In Seconds)
                                </label>
                                <input className="py-3 pl-3 mb-3 w-full bg-purple-200 text-black text-sm border border-gray-300 rounded" type="text" id="txt_timeoutDuration" placeholder="" value={(location.state.detail).split("|")[7]} disabled />
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_initiatorPartyName">
                                    Initiator Party Name
                                </label>
                                <input className="py-3 pl-3 mb-3 w-full bg-purple-200 text-black text-sm border border-gray-300 rounded" type="text" id="txt_initiatorPartyName" placeholder="" value={(location.state.detail).split("|")[1]} disabled />
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_initiatorAddress">
                                    Initiator Address
                                </label>
                                <input className="py-3 pl-3 mb-3 w-full bg-purple-200 text-black text-sm border border-gray-300 rounded" type="text" id="txt_initiatorAddress" placeholder="" value={(location.state.detail).split("|")[2]} disabled />
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_recipientPartyName">
                                    Recipient Party Name
                                </label>
                                <input className="py-3 pl-3 mb-3 w-full bg-purple-200 text-black text-sm border border-gray-300 rounded" type="text" id="txt_recipientPartyName" placeholder="" value={(location.state.detail).split("|")[3]} disabled />
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label className="uppercase tracking-wide text-xs text-purple-800 font-bold mb-2" for="txt_recipientAddress">
                                    Recipient Address
                                </label>
                                <input className="py-3 pl-3 mb-3 w-full bg-purple-200 text-black text-sm border border-gray-300 rounded" type="text" id="txt_recipientAddress" placeholder="" value={(location.state.detail).split("|")[4]} disabled />
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mb-2">
                            <div className="md:w-4/11 mb-6 md:mb-0">&nbsp;</div>
                            {showDeployButton
                                ?
                                <div className="md:w-3/11 px-1 mb-6 md:mb-0 justify-content-center">
                                    <button onClick={this.deploySmartContract} className="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                                        <PostAddTwoToneIcon />
                                        <span>&nbsp;Deploy Smart Contract</span>
                                    </button>
                                </div>
                                : null
                            }
                            {showWithdrawButton
                                ?
                                <div className="md:w-2.5/11 px-1 mb-6 md:mb-0">
                                    <button onClick={this.withdrawExchangedSwap} className="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                                        <CancelPresentationSharpIcon />
                                        <span>&nbsp;Withdraw Exchanged Swap</span>
                                    </button>
                                </div>
                                : null
                            }
                            {showRefundButton
                                ?
                                <div className="md:w-2.5/11 px-1 mb-6 md:mb-0">
                                    <button onClick={this.refundExchangedSwap} className="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                                        <SettingsBackupRestoreTwoToneIcon />
                                        <span>&nbsp;Refund Exchanged Swap</span>
                                    </button>
                                </div>
                                : null
                            }
                            <div className="md:w-3/11 mb-6 md:mb-0">&nbsp;</div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
