import React from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, Alert,Card} from "react-bootstrap";
import intl from 'react-intl-universal';

import auth from "../support/Auth.js";
import { useEffect, useState } from 'react'
import Web3 from 'web3'

import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import NotificationsTwoToneIcon from "@material-ui/icons/NotificationsTwoTone";
import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";
import detectEthereumProvider from '@metamask/detect-provider';

export const Common_TopNavbar = () => {
    //export const Common_TopNavbar = () => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [isLogged, setIsLogged] = useState(false)
    const [currentChainID, setCurrentChainID] = useState(-1)

    const SignIn = async () => {
        //Detect Provider
        const provider = await detectEthereumProvider()
        const web3 = new Web3(provider)
        if (!provider) {
            setMessage(messages => [...messages, { head: "Wallet not found", body: `Please install MetaMask!`, variant: 'warning' }]) 
        } 
        else {
            const address = await ConnectWallet()
            if (address)
                setMessage(messages => [...messages, { head: "User Login", body: `addres: ${address}`, variant: 'success' }])
        }
    }

    const ConnectWallet = async () => {
        console.log("Try Connect");

        try {
            await window.ethereum.enable();

            const id = await window.ethereum.request({ method: 'eth_chainId' })
            setCurrentChainID(() => parseInt(id, 16))

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            setIsLogged(true)
            setCurrentAccount(accounts[0])
            return accounts[0]

        } catch (err) {
            if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                console.log('Please connect to MetaMask.')
                setMessage(messages => [...messages, { head: "User Rejected Request", body: 'Please connect to MetaMask.', variant: 'info' }])

            } else if (err.code === -32002) {
                console.log('Please unlock MetaMask.')
                setMessage(messages => [...messages, { head: "User Request Pending", body: 'Please unlock MetaMask and try agin.', variant: 'info' }])
            } else {
                console.error(err);
                setMessage(messages => [...messages, { head: "Error", body: err.message, variant: 'info' }])
            }
        }
    }

    const handleAccountsChanged = (accounts) => {
        console.log('handleAccountsChanged');
        //if(!isLogged) return
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            setMessage(messages => [...messages, { head: "User Rejected Request", body: 'Please connect to MetaMask.', variant: 'info' }])
        } else if (accounts[0] !== currentAccount) {
            console.log(accounts[0])
            console.log(messages);
            setCurrentAccount(() => accounts[0])
            setMessage(messages => [...messages, { head: "Account Changed", body: `addres: ${accounts[0]}`, variant: 'warning' }])
        }
    }

    useEffect(() => {
        window.onbeforeunload = function () { return "Prevent reload" }
        /*
        [COMMENT: TEMPORARY COMMENTED BECAUSE OF DEPLOYMENT ISSUE]
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', (_chainId) => {
            console.log(_chainId);
            setCurrentChainID(() => parseInt(_chainId, 16))
            //window.location.reload()
        });
        */
    }, []);

    const SignOut = async () => {
        setIsLogged(false)
        setCurrentAccount('')
    }

    const shortAddr = () => {
        return `${currentAccount.substr(0, 4)}...${currentAccount.substring(currentAccount.length - 4, currentAccount.length)}`
    }

    const [messages, setMessage] = useState([

    ])

    const Message = (props) => {
        const [show, setShow] = useState(true);
        const close = () => {
            setShow(false)
            setMessage(messages.filter((item, index) => index !== props.id))
        }
        if (show) {
            return (
                <Alert variant={props.variant ? props.variant : 'dark'} onClose={close} dismissible>
                    <Alert.Heading>{props.head}</Alert.Heading>
                    <p>
                        {props.body}
                    </p>
                </Alert>
            )
        } else {
            return (<></>)
        }
    }


    return (
        <div className="flex shadow-sm pl-3 pr-3 pt-3 pb-2 border-b border-gray-300 justify-between">
            <div className="flex shadow bg-white space-x-3 border border-purple-900">
                <span class="w-auto flex justify-end items-center text-gray-500 p-2">
                    <SearchTwoToneIcon />
                </span>
                <input class="w-auto rounded p-2 text-sm" type="text" placeholder="Try searching for users..." />
                <button class="bg-purple-400 hover:bg-red-300 rounded text-white p-2 pl-4 pr-4">
                    <p class="font-semibold text-xs">Search</p>
                </button>
            </div>

            <div className="flex space-x-4 text-purple-700 text-sm mr-3">
            <div>
      {/* <Card chainId={currentChainID} />{' '} */}
      <Button className="connect-button" disabled={isLogged} onClick={SignIn} variant="primary">{isLogged ? shortAddr() : "Connect Wallet"}</Button>{' '}
      <Button onClick={SignOut} style={{visibility: isLogged ? "visible" : "hidden"}} variant="danger">X</Button>
    </div>
                <Link style={{ textDecoration: 'none' }}
                    onClick={() => {
                        auth.logout(() => {
                            this.props.history.push("/");
                        });
                    }}
                ><NotificationsTwoToneIcon /></Link>
                <Link style={{ textDecoration: 'none' }}
                    onClick={() => {
                        auth.logout(() => {
                            this.props.history.push("/");
                        });
                    }}
                ><AccountCircleTwoToneIcon /></Link>
                <Link style={{ textDecoration: 'none' }}
                    onClick={() => {
                        auth.logout(() => {
                            this.props.history.push("/");
                        });
                    }}
                ><ExitToAppTwoToneIcon />&nbsp;Logout</Link>
            </div>
            <div className="message-list" >
        {
          messages.map((item,i) => (
            <Message head={item.head} body={item.body} variant={item.variant} id={i} key={i} />
          ))
        }
    </div>
        </div>
    );
}
