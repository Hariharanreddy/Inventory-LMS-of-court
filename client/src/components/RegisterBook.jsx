import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"


const Register = () => {

    const navigateTo = useNavigate();

    const preLoadedValues = {
        // bookName: "",
        // category: "",
        // authorName: "",
        stock: 0,
        // publisherName: "",
        // yearOfPublication: "",
        price: 0
        // vendorName: "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues : preLoadedValues
    });

    const onFormSubmit = async (formData) => {
        // console.log(formData);

        if(formData.price == undefined){
            formData.price = 0;
        }
        
        const { bookName,
            category,
            authorName,
            stock,
            publisherName,
            yearOfPublication,
            price,
            vendorName,
            dateOfPurchase } = formData;


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

        if (res.status === 422) {
            Swal.fire({
                title: '',
                text: "Book name is already present!",
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
            console.log("Book Has Been Added Successfully!");

            Swal.fire({
                title: '',
                text: "Book has been added successfully!",
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

    var year = new Date();

    function noOfDigits(number) {
        if (isNaN(number) || number == null || number.toString().length == 4) {
            return true;
        }
        else {
            return false;
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
                    <h2>Add New Book</h2>
                    <NavLink to="/BookList">
                        <button className="btn btn-primary">Home</button>
                    </NavLink>
                </div>
                <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="row">

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="bookName" className="form-label">
                                Book Name
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.bookName ? "is-invalid" : ""}`}
                                id="bookName"
                                {...register("bookName", { required: true })}
                            />
                            {errors.bookName && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="category" className="form-label">
                                Category
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.category ? "is-invalid" : ""}`}
                                id="category"
                                {...register("category", { validate: checkNumbers, required: true })}
                            />
                            {errors.category?.type === "validate" && (
                                <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
                            )}
                            {errors.category?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="authorName" className="form-label">
                                Author Name
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.authorName ? "is-invalid" : ""}`}
                                id="authorName"
                                {...register("authorName", { validate: checkNumbers, required: true })}
                            />
                            {errors.authorName?.type === "validate" && (
                                <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
                            )}
                            {errors.authorName?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor='stock' className="form-label">Stock Available</label>
                            <input
                                type="number"
                                id="stock"
                                className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                                name="stock"
                                {...register("stock", {min: 0, required: true})}
                            />
                            {errors.stock?.type === "min" && (
                                <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                            )}
                            {errors.stock?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="publisherName" className="form-label">
                                Publisher Name
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.publisherName ? "is-invalid" : ""}`}
                                id="publisherName"
                                {...register("publisherName", { validate: checkNumbers })}
                            />
                            {errors.publisherName?.type === "validate" && (
                                <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="yearOfPublication" className="form-label">
                                Publication Year
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.yearOfPublication ? "is-invalid" : ""}`}
                                id="yearOfPublication"
                                {...register("yearOfPublication", { validate: noOfDigits, max: year.getFullYear() + 1, valueAsNumber: true })}
                            />
                            {errors.yearOfPublication?.type === "max" && (
                                <div className="invalid-feedback">Year Should Not Exceed Present Year. </div>
                            )}
                            {errors.yearOfPublication?.type == "validate" && (
                                <div className="invalid-feedback">Digits Should Be Equal To 4.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input
                                type="number"
                                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                id="price"
                                name="price"
                                {...register("price", { min:0, required: true })}
                            />
                            {errors.price?.type === "min" && (
                                <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                            )}
                            {errors.price?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="vendorName" className="form-label">
                                Vendor Name
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.vendorName ? "is-invalid" : ""}`}
                                id="vendorName"
                                {...register("vendorName", { validate: checkNumbers })}
                            />
                            {errors.vendorName?.type === "validate" && (
                                <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
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
                        <div className="mb-3 col-lg-6 col-md-6 col-12 submit-button-div">
                            <br />
                            <button className="btn btn-primary w-40 h-50 submit-button" type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register