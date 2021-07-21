import React, { PureComponent } from "react";
import ReactPaginate from "react-paginate";

import axios from "axios";

import { Common_CardUI } from "./Common_CardUI.js";

export class HomePage_DashboardComp extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            tableData: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0
        }
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData()
        });
    };

    loadMoreData() {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            tableData: slice
        });
    }

    /* componentDidMount() is invoked immediately after a component is mounted */
    componentDidMount() {
        this.getData();
    }

    getData() {
        axios({
            method: 'POST',
            url: 'http://172.26.186.111:10050/htlc/currenthtlc',
            data: { PartyName: localStorage.getItem("PARTY_NAME") },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }).then(res => {
            var resultData = JSON.parse(res.data['data']);
            var sliceResultData = resultData.slice(this.state.offset, this.state.offset + this.state.perPage);
            this.setState({
                pageCount: Math.ceil(resultData.length / this.state.perPage),
                orgtableData: res.data['data'],
                tableData: sliceResultData
            });
        });
    }

    render() {
        const { history } = this.props;

        return (
            <div className="bg-purple-200 mx-auto max-w-6xl py-3 px-1 lg:px-3 shadow-xl">
                <div className="px-8 py-1">
                    <p className="font-bold font-sans text-sm text-purple-700">
                        Welcome, {localStorage.getItem("PARTY_NAME")}!
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
                            <p className="text-purple-800 font-semibold">List of Pending Swap Requests</p>
                        </div>
                        <div className="flex flex-col p-3">
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block max-w-full sm:px-6 lg:px-8">
                                    <div className="shadow max-h-96 overflow-auto border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full">
                                            <thead className="divide-y divide-gray-300">
                                                <tr>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Contract ID</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Initiating Party</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Receiving Party</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Rate</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300">
                                                {(this.state.tableData.length) ? (this.state.tableData).map((pendingSwapIndex, i) => (
                                                    <tr key={pendingSwapIndex.addressPartyA} className="cursor-pointer" onClick={() => {
                                                        if (pendingSwapIndex.sendtype === "house") {
                                                            pendingSwapIndex.sendtype = "HouseToken";
                                                        } else if (pendingSwapIndex.sendtype === "ETH") {
                                                            pendingSwapIndex.sendtype = "Ether";
                                                        }
    
                                                        if (pendingSwapIndex.receivetype === "house") {
                                                            pendingSwapIndex.receivetype = "HouseToken";
                                                        } else if (pendingSwapIndex.receivetype === "ETH") {
                                                            pendingSwapIndex.receivetype = "Ether";
                                                        }
    
                                                        history.push({
                                                            pathname: "/dashboard/swap-details",
                                                            state: {
                                                                detail: pendingSwapIndex.htlcid + "|" +
                                                                    pendingSwapIndex.sendparty + "|" +
                                                                    pendingSwapIndex.sendpartyaddress + "|" +
                                                                    pendingSwapIndex.receiveparty + "|" +
                                                                    pendingSwapIndex.receivepartyaddress + "|" +
                                                                    pendingSwapIndex.sendvalue + " " + pendingSwapIndex.sendtype + " ~ " + pendingSwapIndex.receivevalue + " " + pendingSwapIndex.receivetype + "|" +
                                                                    pendingSwapIndex.htlcstatus + "|" +
                                                                    pendingSwapIndex.sendtimeout + "|" +
                                                                    pendingSwapIndex.htlchash
                                                            }
                                                        });
                                                    }}>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.htlcid}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.sendparty}<br />
                                                            ({(pendingSwapIndex.sendpartyaddress).substr(0, 4)}....{(pendingSwapIndex.sendpartyaddress).substr((pendingSwapIndex.sendpartyaddress).length-4, (pendingSwapIndex.sendpartyaddress).length)})
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.receiveparty}<br />
                                                            ({(pendingSwapIndex.receivepartyaddress).substr(0, 4)}....{(pendingSwapIndex.receivepartyaddress).substr((pendingSwapIndex.receivepartyaddress).length-4, (pendingSwapIndex.receivepartyaddress).length)})
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.sendvalue}&nbsp;{pendingSwapIndex.sendtype}&nbsp;~&nbsp;{pendingSwapIndex.receivevalue}&nbsp;{pendingSwapIndex.receivetype}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {pendingSwapIndex.htlcstatus}
                                                        </td>
                                                    </tr>
                                                )) :
                                                    (
                                                        <tr>
                                                            <td className="px-4 py-4 bg-white text-gray-900 text-sm text-center whitespace-nowrap" colspan="6">No Records Found</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <ReactPaginate
                                        previousLabel={"prev"}
                                        nextLabel={"next"}
                                        breakLabel={"..."}
                                        activeClassName={"active"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        containerClassName={"pagination mt-3 justify-content-center"}
                                        subContainerClassName={"pages pagination"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        pageCount={this.state.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick} />
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
            </div >
        );
    }
}
