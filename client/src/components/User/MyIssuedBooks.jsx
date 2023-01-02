import { useState, useEffect, useContext, useRef } from 'react'
import SearchIcon from "../../images/search-icon.png"
import { NavLink } from 'react-router-dom';
import { CSVLink } from "react-csv"
import Swal from "sweetalert2"

const headers = [
    { label: "Purchased By", key: "userName" },
    { label: "Department", key: "userDepartment" },
    { label: "Title", key: "bookName" },
    { label: "Author", key: "authorName" },
    { label: "Quantity", key: "quantity" },
    { label: "Price", key: "price" },
    { label: "Publisher Name", key: "publisherName" },
    { label: "Publication Year", key: "yearOfPublication" },
    { label: "Date Of Requisition", key: "dateOfRequisition" },
    { label: "Date Of Issue", key: "dateOfIssue" },
    { label: "Date Of Return", key: "dateOfReturn" }
]

const myIssuedBooks = (props) => {

    const [getRequestData, setRequestData] = useState([]);
    const [data, setData] = useState(false);
    const [runUseEffect, setRunUseEffect] = useState(false);

    //for pagination and searching
    const [searchTerm, setSearchTerm] = useState("");
    const [searchUserName, setSearchUserName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);

    //for exporting to csv
    const [dataToDownload, setDataToDownload] = useState([]);
    const csvDownloadRef = useRef(0);

    const getdataToDownload = async () => {

        const res = await fetch(`http://localhost:8000/getIssuedBookListToDownload?startDate=${startDate}&endDate=${endDate}&search=${searchTerm}&id=${props.userId ? props.userId : ""}&searchName=${searchUserName}`, {
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

    const bookReturn = async (id) => {

        const res2 = await fetch(`http://localhost:8000/bookReturn/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const updateData = await res2.json();
        console.log(updateData);


        if (res2.status === 422) {
            console.log("Data could not be updated.");
        }
        else {
            console.log("Data has been updated.");

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
                title: 'Data updated successfully.'
            })
        }
    }

    const acceptRequest = async (id) => {
        const res2 = await fetch(`http://localhost:8000/acceptBookIssueRequest/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const updatedRequestData = await res2.json();

        if (res2.status == 422 || res2.status == 401 || res2.status == 404) {
            console.log("Request Could Not Be Accepted.");

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
                title: 'Request could not be accepted.'
            })


        }
        else if (res2.status == 409) {
            Swal.fire({
                title: '',
                text: "Either stock is 0 or the quantity asked for is greater than stock!",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                }
            })
        }
        else {
            console.log("Request Accepted Successfully.");
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
                title: 'Request accepted successfully.'
            })
        }
    }

    useEffect(() => {
        setSearchUserName("");
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        setPage(1);
    }, [props.userId]);

    useEffect(() => {
        let active = true;
        console.log("what !")

        //For printing all the users from the database
        const getdata = async () => {

            const res = await fetch(`http://localhost:8000/showIssuedBooksRequest?page=${page}&startDate=${startDate}&endDate=${endDate}&search=${searchTerm}&id=${props.userId ? props.userId : ""}&searchName=${searchUserName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const fetchedData = await res.json();

            if (res.status === 422 || !fetchedData) {
                console.log("Requests could not be fetched.");
            }
            else {
                console.log(fetchedData);

                if (active) {
                    setRequestData(fetchedData);
                    setData(true);
                }
                
                console.log("All Requests have been fetched properly.");
            }
        }

        getdata();

        return () => {
            active = false;
        };

    }, [page, searchTerm, startDate, endDate, props.userId, searchUserName, runUseEffect]);

    // console.log(props.userId);

    return (
        <>{data ?
            <div className="container list-section mt-4">

                <div className="add_btn mt-2">

                    {props.name
                        ? <>
                            <h4>Issued Books By - <span style={{ color: "grey", fontWeight: "500" }}>{props.name}</span></h4>
                        </>
                        : <h4>All Book Issue Requests</h4>}
                    <h4 style={{ color: "grey", fontWeight: "500" }}> Results : {getRequestData.total}</h4>

                </div>

                <div className='add_btn mb-2'>

                    <div className='align-self-end'>

                        <img src={SearchIcon} alt="" width="30px" height="30px" />
                        {props.userId
                            ? <input className="search-button" type="search" value={searchTerm} placeholder="Seach By Title" aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                            : <input className="search-button" type="search" value={searchUserName} placeholder="Seach By UserName" aria-label="Search" onChange={(e) => { setSearchUserName(e.target.value); }} />}

                    </div>

                    <form>
                        <div className='row'>

                            <div className="col-lg-6 col-md-6 col-12">
                                <label htmlFor="startDate">D.O.R From :</label>
                                <input className="form-control" id="startDate" type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); }} />
                            </div>

                            <div className="col-lg-6 col-md-6 col-12">
                                <label htmlFor="endDate">To :</label>
                                <input className="form-control" id="endDate" type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); }} />
                            </div>

                        </div>
                    </form>

                    <div className='align-self-end'>
                        <CSVLink data={dataToDownload} headers={headers} filename="issued_book_data.csv" target="_blank" ref={csvDownloadRef} />
                        <button className='btn' onClick={getdataToDownload}>Export To CSV</button>
                    </div>

                </div>
                <table className="table table-bordered text-center">
                    <thead>
                        <tr className="attribute-row">

                            {props.userId
                                ? <th scope="col">Title / Author</th>
                                : <>
                                    <th scope="col">User Name</th>
                                    <th scope="col">Title / Author</th>
                                </>
                            }

                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Date Of Requisition</th>
                            <th scope="col">Issue Status</th>
                            <th scope="col">Return Status</th>
                            <th scope="col">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {getRequestData.total == 0
                            ? <tr className="record-row">
                                <td colSpan={8}> No Data Found </td>
                            </tr>
                            : getRequestData.issueList.map((element, serialNum) => {
                                return (
                                    <tr className="record-row" key={serialNum}>

                                        {props.userId
                                            ?
                                            <td>{element.bookName} {element.yearOfPublication ? `(${element.yearOfPublication})` : ""} ({element.authorName})</td>
                                            :
                                            <>
                                                <td>{element.userName}</td>
                                                <td>{element.bookName} {element.yearOfPublication ? `(${element.yearOfPublication})` : ""} ({element.authorName})</td>
                                            </>}

                                        <td>Rs.{element.price}</td>
                                        <td>{element.quantity}</td>
                                        <td>{element.dateOfRequisition.slice(0, 10)}</td>
                                        {
                                            element.dateOfIssue ?
                                                <td style={{ color: "green" }}>{element.dateOfIssue ? element.dateOfIssue.slice(0, 10) : ""}</td>
                                                :
                                                <td style={{ color: "red" }}>Not Issued</td>
                                        }
                                        {
                                            element.dateOfReturn ?
                                                <td style={{ color: "green" }}>{`${element.dateOfReturn.slice(0, 10)}`}</td> :
                                                <td style={{ color: "red" }}>Not Returned</td>
                                        }
                                        <td className="d-flex justify-content-around">
                                            <>

                                                {
                                                    element.dateOfIssue
                                                        ? <>
                                                            <NavLink to={`editIssue/${element._id}`}><button className="btn mx-2" style={{ backgroundColor: "#EAE8FF", color: "black" }}>Edit</button></NavLink>
                                                            <button className="btn" style={{ backgroundColor: "#C7DFC5", color: "black" }} disabled={element.dateOfReturn ? true : false} onClick={() => bookReturn(element._id)}>Return</button>
                                                        </>
                                                        : <button className="btn mx-2" style={{ backgroundColor: "lightblue", color: "black" }} onClick={() => acceptRequest(element._id)}>Credit</button>
                                                }
                                            </>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                    <button disabled={page <= 1 ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => { setPage(page - 1); }}>Prev Page</button>
                    <p className='mx-4 my-1' style={{ color: "grey", fontWeight: "bold" }}>  {page > Math.ceil(getRequestData.total / 6) && Math.ceil(getRequestData.total) != 0 ? setPage(1) : page} of {Math.ceil(getRequestData.total / 6)}</p>
                    <button disabled={page >= Math.ceil(getRequestData.total / 6) ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => setPage(page + 1)}>Next Page</button>
                </div>
            </div>
            :
            <div className="m-auto" >
                <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                </div>
            </div>}
        </>
    )
}

export default myIssuedBooks