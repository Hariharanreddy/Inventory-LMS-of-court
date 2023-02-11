import React, { useRef, useContext } from 'react'
import SearchIcon from "../images/search-icon.png"
import { NavLink, useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv"
import { LoginContext } from "./ContextProvider/Context"

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
    const [data, setData] = React.useState(false);
    const [sortStock, setSortStock] = React.useState("");
    const { logindata, setLoginData } = useContext(LoginContext);
    const [disable, setDisable] = React.useState(false);

    //for filtering and pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [page, setPage] = React.useState(1);

    //for exporting to csv
    const [dataToDownload, setDataToDownload] = React.useState([]);
    const csvDownloadRef = useRef(0);

    const navigateTo = useNavigate("");



    const getdataToDownload = async () => {

        setDisable(true);

        const res = await fetch(`http://localhost:8000/getBooksToDownload?search=${searchTerm}&sortStock=${sortStock}`, {
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
    }, []);


    // React.useEffect(() => {
    //     Valid()

    //     // const prevSearchState = window.localStorage.getItem('searchTerm');
    //     // if (prevSearchState) {
    //     //     setSearchTerm(JSON.parse(prevSearchState));
    //     // }
    // }, []);

    // React.useEffect(() => {
    //     window.localStorage.setItem('searchTerm', JSON.stringify(searchTerm));
    // }, [searchTerm]);

    React.useEffect(() => {

        let active = true;

        //for printing all the books from the database
        const getdata = async () => {

            const res = await fetch(`http://localhost:8000/getBooks?page=${page}&search=${searchTerm}&sortStock=${sortStock}`, {
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
                // console.log(data);

                if (active) {
                    setBookData(data);
                    setData(true);
                }

                console.log("All Books have been fetched properly.");
            }
        }


        getdata();
        
        return () => {
            active = false;
        };

    }, [searchTerm, page, sortStock]);

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
                            <input className="search-button" type="search" placeholder="Title or Author" aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                            <input className="search-button mx-2" type="number" placeholder="Filter Stock" aria-label="Search" onChange={(e) => { setSortStock(e.target.value); }} />

                        </div>

                        <div>

                            <CSVLink data={dataToDownload} headers={headers} filename="book_data.csv" target="_blank" ref={csvDownloadRef} />
                            <button className='btn mx-2' onClick={getdataToDownload} disabled={disable}>Export To CSV</button>
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
                                    <td colSpan={8}> No Data Found </td>
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
                        <p className='mx-4 my-1' style={{ color: "grey", fontWeight: "bold" }}>  {page > Math.ceil(getBookData.total / 7) && Math.ceil(getBookData.total) != 0 ? setPage(1) : page} of {Math.ceil(getBookData.total / 7)}</p>
                        <button disabled={page >= Math.ceil(getBookData.total / 7) ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => setPage(page + 1)}>Next Page</button>
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