import React, { useRef } from 'react'
import SearchIcon from "../images/search-icon.png"
import { useParams, useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv"
import Swal from "sweetalert2"

const headers = [
    { label: "Vendor", key: "vendorName" },
    { label: "Date Of Purchase(MM-DD-YYYY)", key: "dateOfPurchase" },
    { label: "Quantity Purchased", key: "quantityPurchased" }
]
const PurchaseList = () => {

    const [getPurchaseData, setPurchaseData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [data, setData] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [disable, setDisable] = React.useState(false);
    const [runUseEffect, setRunUseEffect] = React.useState(false);

    //for exporting to csv
    const [dataToDownload, setDataToDownload] = React.useState([]);
    const csvDownloadRef = useRef(0);

    const { id } = useParams("");
    const navigateTo = useNavigate("");

    const getdataToDownload = async () => {

        setDisable(true);

        const res = await fetch(`/api/getPurchaseListToDownload?id=${id}&search=${searchTerm}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.status === 422 || !data) {
            setDisable(false);
            console.log("Books could not be fetched.");
        }
        else {
            console.log(data);

            setDisable(false);
            setDataToDownload(data);
            setTimeout(() => {
                csvDownloadRef.current.link.click();
            }, 2000);
            console.log("All Books have been fetched properly.");
        }
    }

    const deletePurchase = async (id) => {

        setDisable(true);

        const res2 = await fetch(`/api/deletePurchase/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const deleteData = await res2.json();
        console.log(deleteData);


        if (res2.status === 422) {
            setDisable(false);
            console.log("Data could not be deleted.");

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: 'Data could not be deleted.'
            })
        }
        else {
            console.log("Data has been deleted.");

            setDisable(false);

            setRunUseEffect(() => {
                return runUseEffect ? false : true;
            })

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Deleted Data Successfully'
            })
        }
    }

    const checkDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Data will be removed permanently!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No ',
        }).then((result) => {
            if (result.isConfirmed) {
                deletePurchase(id);
            }
        })
    }

    React.useEffect(() => {
        let active = true;

        //For Printing all the purchases of the book from the database
        const getdata = async () => {

            const res = await fetch(`/api/getPurchaseList?id=${id}&page=${page}&search=${searchTerm}`, {
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

                if (active) {
                    setPurchaseData(data)
                    setData(true);
                }

                console.log("client side, data fetched successfully.");
            }
        }

        getdata();

        return () => {
            active = false;
        };

    }, [searchTerm, page, runUseEffect]);

    return (
        <>
            {data ? <div className="container list-section mt-4">

                <div className="add_btn mt-2">

                    <h4>Vendor / Purchase List</h4>
                    <h4 style={{ color: "grey", fontWeight: "500" }}> Results : {getPurchaseData.total}</h4>

                </div>

                <div className="add_btn mt-2">

                    <div>
                        <img src={SearchIcon} alt="" width="30px" height="30px" />
                        <input className="search-button" type="search" placeholder="Vendor Name or D.O.P" aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                    </div>

                    <div>
                        <CSVLink data={dataToDownload} headers={headers} filename="PurchaseList_data.csv" target="_blank" ref={csvDownloadRef} />
                        <button className='btn mx-2' onClick={getdataToDownload} disabled={disable}>Export To CSV</button>
                        <button className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => navigateTo(-1)}> &lt; Back</button>
                    </div>
                </div>

                <table className="table table-bordered text-center">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">Vendor</th>
                            <th scope="col">Quantity Purchased</th>
                            <th scope="col">Date Of Purchase (YYYY-MM-DD)</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPurchaseData.total == 0 ?
                            <tr className="record-row">
                                <td colSpan={8}> No Data Found </td>
                            </tr>
                            : getPurchaseData.listData.map((element, id) => {
                                return (
                                    <tr className="record-row" key={id}>
                                        <td>{element.vendorName}</td>
                                        <td>{element.quantityPurchased}</td>
                                        <td>{element.dateOfPurchase}</td>
                                        <td><button className="btn" style={{ backgroundColor: "#ff6666", color: "white" }} onClick={() => checkDelete(element._id)}>Delete</button></td>
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