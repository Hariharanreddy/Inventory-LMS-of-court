import React, { useRef } from 'react'
import SearchIcon from "../images/search-icon.png"
import { useParams } from 'react-router-dom';
import { CSVLink } from "react-csv"

const headers = [
    { label: "Vendor", key: "vendorName" },
    { label: "Date Of Purchase", key: "dateOfPurchase" },
    { label: "Quantity Purchased", key: "quantityPurchased" }
]
const PurchaseList = () => {

    const [getPurchaseData, setPurchaseData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [data, setData] = React.useState(false);
    const [page, setPage] = React.useState(1);

    //for exporting to csv
    const [dataToDownload, setDataToDownload] = React.useState([]);
    const csvDownloadRef = useRef(0);

    const { id } = useParams("");

    //For Printing all the purchases of the book from the database
    const getdata = async () => {

        const res = await fetch(`http://localhost:8000/getPurchaseList?id=${id}&page=${page}&search=${searchTerm}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            console.log("client side, data couldn't be fetched.");
        }
        else {
            setPurchaseData(data)
            setData(true);
            console.log("client side, data fetched successfully.");
        }
    }

    const getdataToDownload = async () => {

        const res = await fetch(`http://localhost:8000/getPurchaseListToDownload?id=${id}&search=${searchTerm}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.status === 422 || !data) {
            console.log("Books could not be fetched.");
        }
        else {
            console.log(data);
            setDataToDownload(data);
            setTimeout(() => {
                csvDownloadRef.current.link.click();
            }, 2000);
            console.log("All Books have been fetched properly.");
        }
    }

    React.useEffect(() => {
        getdata();
    }, [searchTerm, page]);

    return (
        <>
            {data ? <div className="container list-section mt-4">
                <div className="add_btn mt-2 mb-4">
                    <div>
                        <img src={SearchIcon} alt="" width="30px" height="30px" />
                        <input className="search-button" type="search" placeholder="Search..." aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                    </div>
                    <h4 className='mx-4' style={{ color: "rgb(6, 0, 97)", fontWeight: "bold" }}> Results : {getPurchaseData.total}</h4>
                    <div>
                        <CSVLink data={dataToDownload} headers={headers} filename="BookPurchaseList_data.csv" target="_blank" ref={csvDownloadRef} />
                        <button className='btn' onClick={getdataToDownload}>Export To CSV</button>
                    </div>
                </div>
                <table className="table table-bordered text-center">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">Vendor</th>
                            <th scope="col">Quantity Purchased</th>
                            <th scope="col">Date Of Purchase</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPurchaseData.total == 0 ?
                            <tr className="record-row">
                                <td colspan={8}> No Data Found </td>
                            </tr>
                            : getPurchaseData.listData.map((element, id) => {
                                return (
                                    <tr className="record-row" key={id}>
                                        <td>{element.vendorName}</td>
                                        <td>{element.quantityPurchased}</td>
                                        <td>{element.dateOfPurchase}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                    <button disabled={page <= 1 ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => { setPage(page - 1); }}>Prev Page</button>
                        <p className='mx-4 my-1' style={{ color: "grey", fontWeight: "bold" }}>  {page > Math.ceil(getPurchaseData.total / 10) && Math.ceil(getPurchaseData.total) != 0 ? setPage(1) : page} of {Math.ceil(getPurchaseData.total / 10)}</p>
                    <button disabled={page >= Math.ceil(getPurchaseData.total / 10) ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => setPage(page + 1)}>Next Page</button>
                </div>
            </div> :
                <div className="m-auto" >
                    <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                    </div>
                </div>
        }
        </>
    )
}

export default PurchaseList