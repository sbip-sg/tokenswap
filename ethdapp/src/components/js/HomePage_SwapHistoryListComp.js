import React, { PureComponent } from "react";
import ReactPaginate from "react-paginate";

import axios from "axios";

export class HomePage_SwapHistoryListComp extends PureComponent {
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
            <div className="bg-purple-200 mx-auto max-w-6xl py-3 px-3 lg:px-4 shadow-xl">
                <form>
                    <div className="bg-white shadow-lg rounded px-8 pb-4 mb-3 flex-col">
                        <div className="-mx-3 md:flex mb-6 border-b-2 border-purple-300 pt-3 pb-3">
                            <div className="md:w-11/11 md:mb-0">
                                <p className="font-semibold text-2xl text-purple-800">Swap Transaction History</p>
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
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Contract ID</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Initiating Party</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Receiving Party</th>
                                                    <th scope="col" className="sticky top-0 px-5 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Rate</th>
                                                    <th scope="col" className="sticky top-0 px-5 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Swap Status</th>
                                                    <th scope="col" className="sticky top-0 px-4 py-3 bg-purple-400 text-white text-left text-sm font-medium uppercase">Last Transaction Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300">
                                                {(this.state.tableData.length) ? (this.state.tableData).map((swapTransactionIndex, i) => (
                                                    <tr key={swapTransactionIndex.addressPartyA} className="cursor-pointer" onClick={() => {
                                                        if (swapTransactionIndex.sendtype === "house") {
                                                            swapTransactionIndex.sendtype = "HouseToken";
                                                        } else if (swapTransactionIndex.sendtype === "ETH") {
                                                            swapTransactionIndex.sendtype = "Ether";
                                                        }

                                                        if (swapTransactionIndex.receivetype === "house") {
                                                            swapTransactionIndex.receivetype = "HouseToken";
                                                        } else if (swapTransactionIndex.receivetype === "ETH") {
                                                            swapTransactionIndex.receivetype = "Ether";
                                                        }

                                                        history.push({
                                                            pathname: "/dashboard/swap-details",
                                                            state: {
                                                                detail: swapTransactionIndex.htlcid + "|" +
                                                                    swapTransactionIndex.sendparty + "|" +
                                                                    swapTransactionIndex.sendpartyaddress + "|" +
                                                                    swapTransactionIndex.receiveparty + "|" +
                                                                    swapTransactionIndex.receivepartyaddress + "|" +
                                                                    swapTransactionIndex.sendvalue + " " + swapTransactionIndex.sendtype + " ~ " + swapTransactionIndex.receivevalue + " " + swapTransactionIndex.receivetype + "|" +
                                                                    swapTransactionIndex.htlcstatus + "|" +
                                                                    swapTransactionIndex.sendtimeout + "|" +
                                                                    swapTransactionIndex.htlchash
                                                            }
                                                        });
                                                    }}>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.htlcid}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.sendparty}<br />
                                                            ({(swapTransactionIndex.sendpartyaddress).substr(0, 6)}....{(swapTransactionIndex.sendpartyaddress).substr((swapTransactionIndex.sendpartyaddress).length-6, (swapTransactionIndex.sendpartyaddress).length)})
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.receiveparty}<br />
                                                            ({(swapTransactionIndex.receivepartyaddress).substr(0, 6)}....{(swapTransactionIndex.receivepartyaddress).substr((swapTransactionIndex.receivepartyaddress).length-6, (swapTransactionIndex.receivepartyaddress).length)})
                                                        </td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.sendvalue}&nbsp;{swapTransactionIndex.sendtype}&nbsp;~&nbsp;{swapTransactionIndex.receivevalue}&nbsp;{swapTransactionIndex.receivetype}
                                                        </td>
                                                        <td className="px-5 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            {swapTransactionIndex.htlcstatus}
                                                        </td>
                                                        <td className="px-4 py-4 bg-white text-gray-900 text-sm whitespace-nowrap">
                                                            [DATE]<span className="hidden">|{swapTransactionIndex.sendtimeout}|{swapTransactionIndex.htlchash}</span>
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
                </form>
            </div>
        );
    }
}
