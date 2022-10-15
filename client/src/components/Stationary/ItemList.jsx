import React from 'react'
import SearchIcon from "../../images/search-icon.png"
import { NavLink } from 'react-router-dom';

import Swal from 'sweetalert2'

const ItemList = () => {

    const [getItemData, setItemData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");

    // console.log(getBookData);

    //for printing all the books from the database
    const getdata = async () => {

        const res = await fetch("http://localhost:8000/getItems", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            console.log("Items could not be fetched.");
        }
        else {
            setItemData(data)
            console.log("All Items have been fetched properly.");
        }
    }


    React.useEffect(() => {
        // let x = 100;
        getdata();
        // const interval = setInterval(() => {

        //     // console.log(++x);
        // }, 1000);
        // return () => clearInterval(interval);
    }, []);


    const deleteItem = async (id) => {

        const res2 = await fetch(`http://localhost:8000/deleteItem/${id}`, {
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
            title: 'Are You Sure?',
            text: "Data will be removed permanently!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No ',
          }).then((result) => {
            if (result.isConfirmed) {
              deleteItem(id);
            }
          })
    }

    return (
        <div className="mt-2">
            <div className="container">
                <div className="add_btn mt-2 mb-4">
                    <div>
                        <img src={SearchIcon} alt="" width="30px" height="30px" />
                        <input className="search-button" type="search" placeholder="Search..." aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value) }} />
                    </div>
                    <NavLink to="/ItemList/registerItem" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add New Item</NavLink>
                </div>
                <table className="table">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">S.No</th>
                            <th scope="col">Item</th>
                            <th className="author-attribute" scope="col">Purchase Date</th>
                            <th scope="col">Quantity Received</th>
                            <th className="stock-attribute" scope="col">Stock</th>
                            <th className="action-attribute" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getItemData.filter((element) => {
                                if (searchTerm === "") {
                                    return element;
                                }
                                else if (element.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || element.dateOfPurchase.toLowerCase().includes(searchTerm.toLowerCase()) || element.quantityReceived.toString().includes(searchTerm.toString())) {
                                    return element;
                                }
                            }).map((element, id) => {
                                return (
                                    <tr className="record-row" key={id}>
                                        <th scope="row">{id + 1}</th>
                                        <td>{element.itemName} </td>
                                        <td>{element.dateOfPurchase}</td>
                                        <td>{element.quantityReceived}</td>
                                        <td>{element.stock}</td>
                                        <td className="d-flex justify-content-between">
                                            <NavLink to={`view/${element._id}`}> <button className="btn btn-outline-success">View</button></NavLink>
                                            <NavLink to={`edit/${element._id}`}>  <button className="btn btn-outline-primary">Edit</button></NavLink>
                                            <button className="btn btn-outline-danger" onClick={() => checkDelete(element._id)}>Delete</button>
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

export default ItemList