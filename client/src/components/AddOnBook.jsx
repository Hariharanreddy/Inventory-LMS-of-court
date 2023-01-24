import React, { useEffect } from 'react'
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"

const AddOnBook = () => {
    const [getBookData, setBookData] = React.useState([]);
    const [data, setData] = React.useState(false);

    const navigateTo = useNavigate();
    const { id } = useParams("");

    const preLoadedValues = {
        quantityPurchased: 0
    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: preLoadedValues
    });

    const onFormSubmit = async (formData) => {

        const {
            vendorName,
            dateOfPurchase,
            quantityPurchased
        } = formData;


        const res = await fetch("http://localhost:8000/addOn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into JSON type string first
            body: JSON.stringify({
                itemId: id,
                vendorName,
                dateOfPurchase,
                quantityPurchased
            })
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422) {
            Swal.fire({
                title: '',
                text: "Data Submission Failed.",
                icon: 'error',
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
            console.log("Data Has Been Added Successfully!");

            Swal.fire({
                title: '',
                text: "Data has been added successfully!",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo("/BookList");
                }
            })
        }
    }

    const getdata = async () => {

        const res = await fetch(`http://localhost:8000/getBook/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data2 = await res.json();

        if (res.status === 422 || !data2) {
            console.log("Client side :Form Data could not be fetched.");
        }
        else {
            setBookData(data2);
            setData(true);
            console.log("Client side :Form Data has been fetched successfully.");
        }

    }

    useEffect(() => {
        getdata();
    }, []);

    function checkNumbers(name) {
        var letters = /^[A-Za-z ]+$/;
        if (name.match(letters) || name == "") {
            return true;
        }
        else {
            return false;
        }
    }

    return (
        <>
            {data ?
                <div className='card-div'>

                    <div className='card-header'>

                        <h2>Add On</h2>
                        <NavLink to="/BookList">
                            <button className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }}> &lt; Back</button>
                        </NavLink>

                    </div>

                    <div className='item-details'>

                        <h6>Title -{'>'} {getBookData.bookName} ({getBookData.yearOfPublication})</h6>
                        <h6>Author -{'>'} {getBookData.authorName}</h6>
                        <h6>Price -{'>'} Rs.{getBookData.price}</h6>
                        <h6>Current Stock -{'>'} {getBookData.stock}</h6>

                    </div>

                    <p className="fw-normal fst-italic text-primary">Today's Date will be registered, if not specified.</p>
                    <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="row">

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="vendorName" className="form-label">
                                    Vendor Name
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.vendorName ? "is-invalid" : ""}`}
                                    id="vendorName"
                                    {...register("vendorName", { validate: checkNumbers, required: true })}
                                />
                                {errors.vendorName?.type === "validate" && (
                                    <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
                                )}
                                {errors.vendorName?.type === "required" && (
                                    <div className="invalid-feedback">This Field Is Required.</div>
                                )}
                            </div>

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor='quantityPurchased' className="form-label">Quantity Purchased</label>
                                <input
                                    type="number"
                                    id="quantityPurchased"
                                    className={`form-control ${errors.quantityPurchased ? "is-invalid" : ""}`}
                                    name="quantityPurchased"
                                    {...register("quantityPurchased", { min: 0, required: true })}
                                />
                                {errors.quantityPurchased?.type === "min" && (
                                    <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                                )}
                                {errors.quantityPurchased?.type === "required" && (
                                    <div className="invalid-feedback">This Field Is Required.</div>
                                )}
                            </div>

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="dateOfPurchase" className="form-label">
                                    Date Of Acquisition
                                </label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.dateOfPurchase ? "is-invalid" : ""}`}
                                    id="dateOfPurchase"
                                    {...register("dateOfPurchase")}
                                />
                            </div>

                            <div className="d-grid">
                                <button className="btn btn-primary submit-button" type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
                : <div className="m-auto" >
                    <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                    </div>
                </div>}
        </>
    )
}

export default AddOnBook