import React, { useContext, useRef } from 'react'
import SearchIcon from "../images/search-icon.png"
import { NavLink, useNavigate } from 'react-router-dom';
import { BsArrowDownUp } from "react-icons/bs"
import { LoginContext } from "./ContextProvider/Context"
import { CSVLink } from "react-csv"

const headers = [
    { label: "Title", key: "bookName" },
    { label: "Author", key: "authorName" },
    { label: "Category", key: "category" },
    { label: "Initial Stock", key: "initialStock" },
    { label: "Publisher Name", key: "publisherName" },
    { label: "Year Of Publication", key: "yearOfPublication" },
    { label: "Price", key: "price" }
]

const BookList = () => {

    const [getBookData, setBookData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { logindata, setLoginData } = useContext(LoginContext);
    const [data, setData] = React.useState(false);

    //for sorting and pagination
    const [sort, setSort] = React.useState({ order: "desc" });
    const [page, setPage] = React.useState(1);

    //for exporting to csv
    const [dataToDownload, setDataToDownload] = React.useState([]);
    const csvDownloadRef = useRef(0);

    const navigateTo = useNavigate();

    //for printing all the books from the database
    const getdata = async () => {

        const res = await fetch(`http://localhost:8000/getBooks?page=${page}&sort=stock,${sort.order}&search=${searchTerm}`, {
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
            setBookData(data);
            setData(true);
            console.log("All Books have been fetched properly.");
        }
    }

    const getdataToDownload = async () => {

        const res = await fetch(`http://localhost:8000/getBooksToDownload?sort=stock,${sort.order}&search=${searchTerm}`, {
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

    const Valid = async () => {
        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch("http://localhost:8000/validuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await res.json();

        if (data.status == 401 || !data) {
            navigateTo("/login");
        }
        else {
            setLoginData(data);
            navigateTo("/BookList");
        }
    }

    React.useEffect(() => {
        Valid()

        // const prevSearchState = window.localStorage.getItem('searchTerm');
        // if (prevSearchState) {
        //     setSearchTerm(JSON.parse(prevSearchState));
        // }
    }, []);

    // React.useEffect(() => {
    //     window.localStorage.setItem('searchTerm', JSON.stringify(searchTerm));
    // }, [searchTerm]);

    React.useEffect(() => {
        getdata();
    }, [searchTerm, sort, page]);

    return (
        <>
            {data ?
                <div className="container list-section mt-4">

                    <div className="add_btn mt-2">

                        <h4>Book List</h4>
                        <h4 style={{ color: "grey", fontWeight: "500" }}> Results : {getBookData.total}</h4>

                    </div>

                    <div className='add_btn mb-2'>

                        <div>

                            <img src={SearchIcon} alt="" width="30px" height="30px" />
                            <input className="search-button" type="search" placeholder="Title or Author" aria-label="Search" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); }} />

                        </div>

                        <div>

                            <CSVLink data={dataToDownload} headers={headers} filename="book_data.csv" target="_blank" ref={csvDownloadRef} />
                            <button className='btn' onClick={getdataToDownload}>Export To CSV</button>
                            <button className='btn mx-2' onClick={() => {
                                if (sort.order == "desc") {
                                    setSort({ order: "asc" });
                                }
                                else {
                                    setSort({ order: "desc" });
                                }
                            }}><BsArrowDownUp /> Sort Stock</button>

                            <NavLink to="/BookList/registerBook" className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }}><i className="fa-solid fa-plus"></i> Add Book</NavLink>

                        </div>

                    </div>
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr className="attribute-row">
                                <th scope="col">Title</th>
                                <th scope="col">Author</th>
                                <th scope="col">Initial Stock</th>
                                <th scope="col">Current Stock</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getBookData.booksData.length == 0 ?
                                <tr className="record-row">
                                    <td colspan={8}> No Data Found </td>
                                </tr>
                                : getBookData.booksData.map((element, id) => {
                                    return (
                                        <tr className="record-row" key={id}>
                                            <td>{element.bookName}</td>
                                            <td>{element.authorName}</td>
                                            <td>{element.initialStock}</td>
                                            <td>{element.stock}</td>
                                            <td className="d-flex justify-content-around">
                                                <>
                                                    <NavLink to={`view/${element._id}`}><button className="btn" style={{ backgroundColor: "#D8D2E1", color: "black" }}>Details</button></NavLink>
                                                    <NavLink to={`edit/${element._id}`}><button className="btn" style={{ backgroundColor: "#EAE8FF", color: "black" }}>Edit</button></NavLink>
                                                    <NavLink to={`addOn/${element._id}`}><button className="btn text-black">Add</button></NavLink>
                                                    <NavLink to={`bookIssueRequestForm/${element._id}`}><button className="btn" style={{ backgroundColor: "lightblue", color: "black" }}>Issue</button></NavLink>
                                                </>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <button disabled={page <= 1 ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => { setPage(page - 1); }}>Prev Page</button>
                        <p className='mx-4 my-1' style={{ color: "grey", fontWeight: "bold" }}>  {page > Math.ceil(getBookData.total / 6) && Math.ceil(getBookData.total) != 0 ? setPage(1) : page} of {Math.ceil(getBookData.total / 6)}</p>
                        <button disabled={page >= Math.ceil(getBookData.total / 6) ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => setPage(page + 1)}>Next Page</button>
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

export default BookList