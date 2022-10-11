import React from 'react'
import { NavLink } from 'react-router-dom';

const Home = () => {

    const [getBookData, setBookData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");

    // console.log(getBookData);

    //for printing all the books from the database
    const getdata = async () => {

        const res = await fetch("http://localhost:8000/getBooks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            console.log("Books could not be fetched.");
        }
        else {
            setBookData(data)
            console.log("All Books have been fetched properly.");
        }
    }

    //to run the getdata function everytime the page refreshes
    React.useEffect(() => {
        getdata();
    }, [])

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


    return (
        <div className="mt-5">
            <div className="container">
                <div className="add_btn mt-2 mb-4">
                    <input className="search-button" type="search" placeholder="Search Book Name or Category..." aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value) }} />
                    <NavLink to="/registerBook" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add New Book</NavLink>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">S.No</th>
                            <th scope="col">Book Name</th>
                            <th className="author-attribute" scope="col">Author Name</th>
                            <th scope="col">Category</th>
                            <th className="stock-attribute" scope="col">Stock</th>
                            <th className="action-attribute" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getBookData.filter((element) => {
                                if (searchTerm === "") {
                                    return element;
                                }
                                else if (element.bookName.toLowerCase().includes(searchTerm.toLowerCase()) || element.category.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    return element;
                                }
                            }).map((element, id) => {
                                return (
                                    <tr className="record-row">
                                        <th scope="row">{id + 1}</th>
                                        <td>{element.bookName} </td>
                                        <td>{element.authorName}</td>
                                        <td>{element.category}</td>
                                        <td>{element.stock}</td>
                                        <td className="d-flex justify-content-between">
                                            <NavLink to={`view/${element._id}`}> <button className="btn btn-outline-success">View</button></NavLink>
                                            <NavLink to={`edit/${element._id}`}>  <button className="btn btn-outline-primary">Edit</button></NavLink>
                                            <button className="btn btn-outline-danger" onClick={() => deleteBook(element._id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default Home