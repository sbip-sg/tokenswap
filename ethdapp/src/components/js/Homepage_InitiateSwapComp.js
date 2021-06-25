import React, {useRef} from "react";
import Web3 from 'web3';

import SwapHorizontalCircleTwoToneIcon from "@material-ui/icons/SwapHorizontalCircleTwoTone";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import detectEthereumProvider from "@metamask/detect-provider";
// import solc from 'solc'

export const Homepage_InitiateSwapComp = () => {
    const abi = JSON.parse('[ { "inputs": [ { "internalType": "address", "name": "_recipient", "type": "address" }, { "internalType": "bytes32", "name": "_hash", "type": "bytes32" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "amount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "fund", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getSecret", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "hash", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lockTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "recipient", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "refund", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "startTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_secret", "type": "string" } ], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]');
    const code = '0x60806040526105dc6001553480156200001757600080fd5b506040516200101f3803806200101f83398181016040528101906200003d9190620000fc565b81600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806003819055505050620001ba565b600081519050620000df8162000186565b92915050565b600081519050620000f681620001a0565b92915050565b6000806040838503121562000116576200011562000181565b5b60006200012685828601620000ce565b92505060206200013985828601620000e5565b9150509250929050565b6000620001508262000161565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600080fd5b620001918162000143565b81146200019d57600080fd5b50565b620001ab8162000157565b8114620001b757600080fd5b50565b610e5580620001ca6000396000f3fe6080604052600436106100915760003560e01c806366d003ac1161005957806366d003ac1461015757806378e97925146101825780638da5cb5b146101ad578063aa8c217c146101d8578063b60d42881461020357610091565b806309bd5a60146100965780630d668087146100c157806331fb67c2146100ec578063590e1ae3146101155780635b9fdc301461012c575b600080fd5b3480156100a257600080fd5b506100ab61020d565b6040516100b89190610a25565b60405180910390f35b3480156100cd57600080fd5b506100d6610213565b6040516100e39190610ae2565b60405180910390f35b3480156100f857600080fd5b50610113600480360381019061010e919061084f565b610219565b005b34801561012157600080fd5b5061012a6103fe565b005b34801561013857600080fd5b506101416105b2565b60405161014e9190610a40565b60405180910390f35b34801561016357600080fd5b5061016c6106d4565b6040516101799190610a0a565b60405180910390f35b34801561018e57600080fd5b506101976106fa565b6040516101a49190610ae2565b60405180910390f35b3480156101b957600080fd5b506101c2610700565b6040516101cf9190610a0a565b60405180910390f35b3480156101e457600080fd5b506101ed610726565b6040516101fa9190610ae2565b60405180910390f35b61020b61072c565b005b60035481565b60015481565b6003548160405160200161022d91906109de565b6040516020818303038152906040528051906020012014610283576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027a90610a82565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610313576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161030a90610a62565b60405180910390fd5b806002908051906020019061032992919061073c565b506000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600654604051610374906109f5565b60006040518083038185875af1925050503d80600081146103b1576040519150601f19603f3d011682016040523d82523d6000602084013e6103b6565b606091505b50509050806103fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f190610aa2565b60405180910390fd5b5050565b60015460005461040e9190610b85565b421161044f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161044690610ac2565b60405180910390fd5b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104df576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d690610a62565b60405180910390fd5b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600654604051610529906109f5565b60006040518083038185875af1925050503d8060008114610566576040519150601f19603f3d011682016040523d82523d6000602084013e61056b565b606091505b50509050806105af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105a690610aa2565b60405180910390fd5b50565b6060600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610644576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161063b90610a62565b60405180910390fd5b6002805461065190610c63565b80601f016020809104026020016040519081016040528092919081815260200182805461067d90610c63565b80156106ca5780601f1061069f576101008083540402835291602001916106ca565b820191906000526020600020905b8154815290600101906020018083116106ad57829003601f168201915b5050505050905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60005481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60065481565b4260008190555034600681905550565b82805461074890610c63565b90600052602060002090601f01602090048101928261076a57600085556107b1565b82601f1061078357805160ff19168380011785556107b1565b828001600101855582156107b1579182015b828111156107b0578251825591602001919060010190610795565b5b5090506107be91906107c2565b5090565b5b808211156107db5760008160009055506001016107c3565b5090565b60006107f26107ed84610b22565b610afd565b90508281526020810184848401111561080e5761080d610d58565b5b610819848285610c21565b509392505050565b600082601f83011261083657610835610d53565b5b81356108468482602086016107df565b91505092915050565b60006020828403121561086557610864610d62565b5b600082013567ffffffffffffffff81111561088357610882610d5d565b5b61088f84828501610821565b91505092915050565b6108a181610bdb565b82525050565b6108b081610bed565b82525050565b60006108c182610b53565b6108cb8185610b69565b93506108db818560208601610c30565b6108e481610d67565b840191505092915050565b60006108fa82610b53565b6109048185610b7a565b9350610914818560208601610c30565b80840191505092915050565b600061092d600a83610b69565b915061093882610d78565b602082019050919050565b6000610950600c83610b69565b915061095b82610da1565b602082019050919050565b6000610973600083610b5e565b915061097e82610dca565b600082019050919050565b6000610996601083610b69565b91506109a182610dcd565b602082019050919050565b60006109b9600983610b69565b91506109c482610df6565b602082019050919050565b6109d881610c17565b82525050565b60006109ea82846108ef565b915081905092915050565b6000610a0082610966565b9150819050919050565b6000602082019050610a1f6000830184610898565b92915050565b6000602082019050610a3a60008301846108a7565b92915050565b60006020820190508181036000830152610a5a81846108b6565b905092915050565b60006020820190508181036000830152610a7b81610920565b9050919050565b60006020820190508181036000830152610a9b81610943565b9050919050565b60006020820190508181036000830152610abb81610989565b9050919050565b60006020820190508181036000830152610adb816109ac565b9050919050565b6000602082019050610af760008301846109cf565b92915050565b6000610b07610b18565b9050610b138282610c95565b919050565b6000604051905090565b600067ffffffffffffffff821115610b3d57610b3c610d24565b5b610b4682610d67565b9050602081019050919050565b600081519050919050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000610b9082610c17565b9150610b9b83610c17565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610bd057610bcf610cc6565b5b828201905092915050565b6000610be682610bf7565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015610c4e578082015181840152602081019050610c33565b83811115610c5d576000848401525b50505050565b60006002820490506001821680610c7b57607f821691505b60208210811415610c8f57610c8e610cf5565b5b50919050565b610c9e82610d67565b810181811067ffffffffffffffff82111715610cbd57610cbc610d24565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f77726f6e67207573657200000000000000000000000000000000000000000000600082015250565b7f77726f6e67207365637265740000000000000000000000000000000000000000600082015250565b50565b7f5472616e73666572206661696c65642e00000000000000000000000000000000600082015250565b7f746f6f206561726c79000000000000000000000000000000000000000000000060008201525056fea2646970667358221220c861e30684ad784b97187039d907d25a9ca51630151ba11fd096596886d35fab64736f6c63430008060033';
    const Alice = '0xE3B9Ac1636924738CCE6B12d96bA05BF456E81a7';
    const hash = '0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd';
    const [currentForExc, currentToRec, secretKey, recipientPartyName, recipientPartyAddress] = new Array(5).fill(useRef(null))
    
    const deploySmartContract = async () => {
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        /* [TEST]: DEPLOYMENT OF SMART CONTRACT */
        var myContract = await new web3.eth.Contract(abi);
        console.log(currentForExc.current.value);
        const deployTx = myContract.deploy({
            data: code,
            arguments: [recipientPartyAddress.current.value, secretKey.current.value]
        }).send({
            from: accounts[0]
        }).on('receipt', function (receipt) {
            console.log(receipt.contractAddress) // contains the new contract address
        });

        console.log(myContract);
        console.log('address: ' + myContract.address);
    }

    return (
        <div className="flex ml-3 mr-4 mt-10 space-x-6 flex items-center justify-center">
            <div className="bg-white ml-2 shadow-sm w-10/12 rounded-xl border-2 border-purple-300">
                <div className="border-b-2 border-purple-300 p-3">
                    <p className="font-semibold text-lg">Initiate Swap</p>
                </div>
                <div className="flex flex-wrap pl-4 pr-4 pt-4">
                    <div className="w-5/12 bg-white h-auto">
                        <label htmlFor="txt_currencyForExc" className="block text-sm font-medium text-gray-700">
                            Currency Type to Use for the Swap:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm border-2 border-purple-400">
                            <input type="text" name="txt_currencyForExc" id="txt_currencyForExc"
                                className="md:w-auto pl-3 pr-3 rounded-md border-r border-purple-400" placeholder="Currency Value"  ref={currentForExc}/>
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
                                className="md:w-auto pl-3 pr-3 rounded-md border-r border-purple-400" placeholder="Currency Value" ref={currentToRec} />
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
                                className="w-full pl-3 pr-3 rounded-md" placeholder="" ref={secretKey}/>
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
                                className="w-full pl-3 pr-3 rounded-md" placeholder="" ref={recipientPartyName}/>
                        </div>
                    </div>
                    <div className="w-1/12 bg-white">&nbsp;</div>
                    <div className="w-6/12 bg-white h-auto">
                        <label htmlFor="txt_recipientAddress" className="block text-sm font-medium text-gray-700">
                            Recipient Address:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm border-2 border-purple-400">
                            <input type="text" name="txt_recipientAddress" id="txt_recipientAddress"
                                className="w-full pl-3 pr-3 rounded-md" placeholder="e.g. 0x012345abcde012345" ref={recipientPartyAddress}/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap pl-4 pr-4 mt-6 mb-6">
                    <div className="w-4/12 bg-white">&nbsp;</div>
                    <div className="w-4/12 bg-white h-auto">
                        <button onClick={deploySmartContract} class="bg-purple-400 hover:bg-gray-400 text-gray-800 text-sm font-bold py-2 px-4 rounded inline-flex items-center">
                            <PostAddTwoToneIcon />
                            <span>&nbsp;Initiate Swap</span>
                        </button>
                    </div>
                    <div className="w-4/12 bg-white">&nbsp;</div>
                </div>
            </div>
        </div>
    );
}
