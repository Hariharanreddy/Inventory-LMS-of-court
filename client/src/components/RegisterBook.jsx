import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"

const Register = () => {

    const navigateTo = useNavigate();

    const [inpval, setINP] = React.useState({
        bookName: "",
        category: "",
        authorName: "",
        stock: 0,
        publisherName: "",
        yearOfPublication: "",
        price: 0,
        vendorName: "",
        dateOfPurchase: ""
    })

    const setdata = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setINP((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }

    //Sending Entered Data To Backend
    const addInputData = async (e) => {
        e.preventDefault();
        // console.log("button working");

        const { bookName,
            category,
            authorName,
            stock,
            publisherName,
            yearOfPublication,
            price,
            vendorName,
            dateOfPurchase } = inpval;

        const res = await fetch("http://localhost:8000/registerBook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into string first
            body: JSON.stringify({
                bookName,
                category,
                authorName,
                stock,
                publisherName,
                yearOfPublication,
                price,
                vendorName,
                dateOfPurchase
            })
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            alert("Error");
        } else {
            alert("Book Has Been Added Successfully!");
            console.log("Book Has Been Added Successfully!");
            navigateTo("/");
        }
    }

    return (
        <div className='card-div'>
            <div className='container'>
                <div className='card-header'>
                    <h2>Add New Book</h2>
                    <NavLink to="/">
                        <button className="btn btn-primary">Home</button>
                    </NavLink>
                </div>
                <form className="mt-4">
                    <div className="row">
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Book Name</label>
                            <input type="text" value={inpval.bookName} onChange={setdata} name="bookName" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Category</label>
                            <input type="text" value={inpval.category} onChange={setdata} name="category" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Author Name</label>
                            <input type="text" value={inpval.authorName} onChange={setdata} name="authorName" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Stock Available</label>
                            <input type="number" value={inpval.stock} onChange={setdata} name="stock" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Publisher Name</label>
                            <input type="text" value={inpval.publisherName} onChange={setdata} name="publisherName" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Publication Year</label>
                            <input type="number" value={inpval.yearOfPublication} onChange={setdata} name="yearOfPublication" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Price</label>
                            <input type="number" value={inpval.price} onChange={setdata} name="price" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Vendor Name</label>
                            <input type="text" value={inpval.vendorName} onChange={setdata} name="vendorName" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label">Date Of Purchase</label>
                            <input type="date" value={inpval.dateOfPurchase} onChange={setdata} name="dateOfPurchase" className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12 submit-button-div">
                            <br />
                            <button className="btn btn-primary w-40 h-50 submit-button" type="submit" onClick={addInputData}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register