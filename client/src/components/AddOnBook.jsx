import React from 'react'
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"

const AddOnBook = () => {
    const navigateTo = useNavigate();
    const {id} = useParams("");

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

        const res = await fetch("http://localhost:8000/addOnBook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into JSON type string first
            body: JSON.stringify({
                bookId:id,  
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
        <div className='card-div'>
            <div className='container'>
                <div className='card-header'>
                    <h2>Add On</h2>
                    <NavLink to="/BookList">
                        <button className="btn btn-primary">Book List</button>
                    </NavLink>
                </div>
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
                                Date Of Purchase
                            </label>
                            <input
                                type="date"
                                className={`form-control ${errors.dateOfPurchase ? "is-invalid" : ""}`}
                                id="dateOfPurchase"
                                {...register("dateOfPurchase", { required: true })}
                            />
                            {errors.dateOfPurchase && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="d-grid">
                            <button className="btn btn-primary submit-button" type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddOnBook