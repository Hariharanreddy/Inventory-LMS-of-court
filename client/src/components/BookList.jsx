import React, { useContext } from 'react'
import SearchIcon from "../images/search-icon.png"
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginContext } from "./ContextProvider/Context"


import Swal from 'sweetalert2'

const BookList = () => {

    const [getBookData, setBookData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { logindata, setLoginData } = useContext(LoginContext);
    const [data, setData] = React.useState(false);

    const navigateTo = useNavigate();

    //for printing all the books from the database
    const getdata = async () => {

        const res = await fetch("http://localhost:8000/getBooks", {
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
            setBookData(data)
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
            console.log(data);
            setLoginData(data);
            navigateTo("/BookList");
        }
    }

    React.useEffect(() => {
        Valid()
            .then(() => {
                setData(true);
                getdata();
            })
    }, []);


    const deleteBook = async (id) => {

        const res2 = await fetch(`http://localhost:8000/deleteBook/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const deleteData = await res2.json();
        console.log(deleteData);


        if (res2.status === 422) {
            console.log("Data could not be deleted.");
        }
        else {
            console.log("Data has been deleted.");
            getdata();
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
                deleteBook(id);
            }
        })
    }

    const sendRequest = async (bookid) => {

        const res = await fetch("http://localhost:8000/bookIssueRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into string first
            body: JSON.stringify({
                userId: logindata.ValidUserOne._id,
                bookId:bookid
            })
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422) {
            Swal.fire({
                title: '',
                text: "Request could not be sent",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                }
            })
        }
        else {
            console.log("Issue request has been sent successfully!");

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'success',
                title: 'Issue request has been sent successfully!'
              })
        }
    }

    return (
        <>
            {data ? <div className="container list-section mt-4">
                <div className="add_btn mt-2 mb-4">
                    <div>
                        <img src={SearchIcon} alt="" width="30px" height="30px" />
                        <input className="search-button" type="search" placeholder="Search..." aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                    </div>
                    <>{logindata.ValidUserOne.isAdmin ? <NavLink to="/BookList/registerBook" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add Book</NavLink> : ""}</>
                </div><table className="table">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">S.No</th>
                            <th scope="col">Title</th>
                            <th className="author-attribute" scope="col">Author</th>
                            <th scope="col">Category</th>
                            <th className="stock-attribute" scope="col">Stock</th>
                            <th className="action-attribute" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getBookData && getBookData.filter((element) => {
                            if (searchTerm === "") {
                                return element;
                            }
                            else if (element.bookName.toLowerCase().includes(searchTerm.toLowerCase()) || element.category.toLowerCase().includes(searchTerm.toLowerCase()) || element.authorName.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return element;
                            }
                        }).map((element, id) => {
                            return (
                                <tr className="record-row" key={id}>
                                    <th scope="row">{id + 1}</th>
                                    <td>{element.bookName} </td>
                                    <td>{element.authorName}</td>
                                    <td>{element.category}</td>
                                    <td>{element.stock}</td>
                                    <td className="d-flex justify-content-around">
                                        {logindata.ValidUserOne.isAdmin ?
                                            <>
                                                <NavLink to={`view/${element._id}`}> <button className="btn btn-outline-success">Details</button></NavLink>
                                                <NavLink to={`edit/${element._id}`}>  <button className="btn btn-outline-primary">Edit</button></NavLink>
                                                <button className="btn btn-outline-danger" onClick={() => checkDelete(element._id)}>Delete</button>
                                            </> :
                                            <>
                                                <button className="btn btn-outline-primary" onClick={() => sendRequest(element._id)}>Issue</button>
                                                <NavLink to={`view/${element._id}`}> <button className="btn btn-outline-success">Details</button></NavLink>
                                            </>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div> :
                <div className="m-auto" >
                    <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                    </div>
                </div>}
        </>
    )
}

export default BookList