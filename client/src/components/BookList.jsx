import React, { useContext } from 'react'
import SearchIcon from "../images/search-icon.png"
import { NavLink, useNavigate } from 'react-router-dom';
import {BsArrowDownUp} from "react-icons/bs"
import { LoginContext } from "./ContextProvider/Context"

const BookList = () => {

    const [getBookData, setBookData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { logindata, setLoginData } = useContext(LoginContext);
    const [data, setData] = React.useState(false);
    const [sort, setSort] = React.useState({ order: "desc" });
    const [page, setPage] = React.useState(1);

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

    React.useEffect(() => {
        getdata();
    }, [searchTerm, sort, page])

    return (
        <>
            {data ?
                <div className="container list-section mt-4">
                    <div className="add_btn mt-2 mb-4">
                        <div>
                            <img src={SearchIcon} alt="" width="30px" height="30px" />
                            <input className="search-button" type="search" placeholder="Title or Author" aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                        </div>
                        <h3 className='mx-4 align-self-center' style={{ color: "rgb(6, 0, 97)", fontWeight: "bold" }}> Total Count : {getBookData.total}</h3>
                        <div>
                            <button className='btn mx-4 btn-dark' onClick={() => {
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
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <button disabled={page <= 1 ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => {setPage(page-1);}}>Prev Page</button>
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