import React from 'react'
import { NavLink, useParams, useNavigate } from "react-router-dom"

const Edit = () => {

    const navigate = useNavigate("");

    const { id } = useParams("");
    // console.log(id);

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

    //For fetching the book details
    const getdata = async () => {

        const res = await fetch(`http://localhost:8000/getBook/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            console.log("Error");
        }
        else {
            setINP(data)
            console.log("getData() successfully executed");
        }
    }

    React.useEffect(() => {
        getdata();
    }, [])


    const updateBook = async (e) => {
        e.preventDefault();

        const { bookName,
            category,
            authorName,
            stock,
            publisherName,
            yearOfPublication,
            price,
            vendorName,
            dateOfPurchase } = inpval;

        const res2 = await fetch(`http://localhost:8000/updateBook/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
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

        const data2 = await res2.json();
        console.log(data2);

        if (res2.status == 422 || !data2) {
            alert("Data could not be updated!");
        }
        else {
            navigate("/");
            alert("Data Updated Successfully");
        }
    }

    return (
        <div className='card-div'>
            <div className='container edit-form'>
                <div className='card-header'>
                    <h2>Edit Book</h2>
                    <div>
                        <NavLink to={`/view/${id}`}  >
                            <button className="btn btn-outline-success">Detail</button>
                        </NavLink>
                        <NavLink to="/">
                            <button className="btn btn-primary home-btn">Home</button>
                        </NavLink>
                    </div>
                </div>
                <form className="mt-4 ">
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
                            <button className="btn btn-primary w-40 h-50 submit-button" type="submit" onClick={updateBook}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Edit