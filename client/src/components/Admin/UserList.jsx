import React, { useRef } from 'react'
import SearchIcon from "../../images/search-icon.png"
import { CSVLink } from "react-csv"
import { NavLink } from 'react-router-dom';

const headers = [
    { label: "Name", key: "name" },
    { label: "E-Mail", key: "email" },
    { label: "Department", key: "department" },
    { label: "Department Id", key: "departmentId" },
    { label: "Date Of Birth", key: "dob" },
    { label: "Phone No", key: "phoneNo" },
    { label: "Status", key: "isActive" }
]

const UserList = () => {

    const [getUserData, setUserData] = React.useState([]);
    const [data, setData] = React.useState(false);


    //for filtering and pagination
    const [status, setStatus] = React.useState("");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [page, setPage] = React.useState(1);

    //for exporting to csv
    const [dataToDownload, setDataToDownload] = React.useState([]);
    const csvDownloadRef = useRef(0);

    const getdataToDownload = async () => {

        const res = await fetch(`http://localhost:8000/getUsersToDownload?search=${searchTerm}&isActiveOrNot=${status}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.status === 422 || !data) {
            console.log("Users could not be fetched.");
        }
        else {
            console.log(data);
            setDataToDownload(data);
            setTimeout(() => {
                csvDownloadRef.current.link.click();
            }, 2000);
            console.log("All Users have been fetched properly.");
        }
    }

    React.useEffect(() => {
        console.log("coming")

        let active = true;

        //for printing all the books from the database
        const getdata = async () => {

            const res = await fetch(`http://localhost:8000/getUsers?page=${page}&search=${searchTerm}&isActiveOrNot=${status}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (res.status === 422 || !data) {
                console.log("Users could not be fetched.");
            }
            else {
                // console.log(data);

                if (active) {
                    setUserData(data);
                    setData(true);
                }

                console.log("All Users have been fetched properly.");
            }
        }


        getdata();

        return () => {
            active = false;
        };

    }, [searchTerm, page, status]);

    return (
        <>
            {data ?
                <div className="container list-section mt-4">

                    <div className="add_btn mt-2">

                        <h4>Users List</h4>
                        <h4 style={{ color: "grey", fontWeight: "500" }}> Results : {getUserData.total}</h4>

                    </div>

                    <div className='add_btn mb-2'>

                        <div>

                            <img src={SearchIcon} alt="" width="30px" height="30px" />
                            <input className="search-button" type="search" placeholder="Name or Department" aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />

                        </div>

                        <div>

                            <span className="dropdown mx-2">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Status
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a className="dropdown-item" onClick={(e) => { setStatus(""); }} >All</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => { setStatus("true"); }} >Active</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => { setStatus("false"); }} >Not Active</a></li>
                                </ul>
                            </span>

                            <CSVLink data={dataToDownload} headers={headers} filename="users_data.csv" target="_blank" ref={csvDownloadRef} />
                            <button className='btn mx-2' onClick={getdataToDownload}>Export To CSV</button>

                        </div>

                    </div>
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr className="attribute-row">
                                <th scope="col">Name</th>
                                <th scope="col">Department</th>
                                <th scope="col">Id</th>
                                <th scope="col">Phone No</th>
                                <th scope="col">Email</th>
                                <th scope="col">D.O.B</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getUserData.usersData.length == 0 ?
                                <tr className="record-row">
                                    <td colSpan={8}> No Data Found </td>
                                </tr>
                                : getUserData.usersData.map((element, id) => {
                                    return (
                                        <tr className="record-row" key={id}>
                                            <td>{element.name}</td>
                                            <td>{element.department}</td>
                                            <td>{element.departmentId}</td>
                                            <td>{element.phoneNo}</td>
                                            <td style={{textTransform:"lowercase"}}>{element.email}</td>    
                                            <td>{element.dob.toString().slice(0, 10)}</td>
                                            {
                                                element.isActive ?
                                                    <td style={{ color: "green" }}>Active</td>
                                                    :
                                                    <td style={{ color: "red" }}>Not Active</td>
                                            }
                                            
                                            <td className="d-flex justify-content-around">
                                                <>
                                                    <NavLink to={`edit/${element._id}`}><button className="btn" style={{ backgroundColor: "#EAE8FF", color: "black" }}>Edit</button></NavLink>
                                                </>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <button disabled={page <= 1 ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => { setPage(page - 1); }}>Prev Page</button>
                        <p className='mx-4 my-1' style={{ color: "grey", fontWeight: "bold" }}>  {page > Math.ceil(getUserData.total / 7) && Math.ceil(getUserData.total) != 0 ? setPage(1) : page} of {Math.ceil(getUserData.total / 7)}</p>
                        <button disabled={page >= Math.ceil(getUserData.total / 7) ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => setPage(page + 1)}>Next Page</button>
                    </div>
                </div>
                :
                <div className="m-auto" >
                    <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                    </div>
                </div>
            }
        </>
    )
}

export default UserList