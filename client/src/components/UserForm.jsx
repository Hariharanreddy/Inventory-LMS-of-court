import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from 'sweetalert2'

const UserForm = ({ preLoadedValues, id }) => {

    const navigateTo = useNavigate("");

    //For fetching the book details
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: preLoadedValues
    });

    const onFormSubmit = async (formData) => {
        // console.log(formData);
        const { bookName,
            category,
            authorName,
            stock,
            initialStock,
            publisherName,
            yearOfPublication,
            price } = formData;

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
                initialStock,
                publisherName,
                yearOfPublication,
                price
            })
        });

        const data2 = await res2.json();
        console.log(data2);

        if (res2.status == 422 || !data2) {
            Swal.fire({
                title: '',
                text: "Data could not updated for some reason!",
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo("/ItemList");
                }
            })
        }
        else {
            Swal.fire({
                title: '',
                text: "Data updated successfully!",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo("/BookList");
                }
            })
        }
    }

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
            navigateTo("/BookList");
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
        if (name == "" || name.match(letters)) {
            return true;
        }
        else {
            return false;
        }
    }

    return (
        <div className='card-div'>
            <div className='container edit-form'>
                <div className='card-header'>
                    <h2>Edit Details</h2>
                    <div>
                        <button className="btn btn-danger" onClick={() => checkDelete(id)}>Delete</button>
                        <NavLink to="/BookList">
                            <button className="btn btn-primary home-btn">Book List</button>
                        </NavLink>
                    </div>
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
                                name="bookName"
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
                                name="category"
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
                                name="authorName"
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
                            <label htmlFor='stock' className="form-label">Current Stock</label>
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
                            <label htmlFor='initialStock' className="form-label">Initial Stock</label>
                            <input
                                type="number"
                                id="initialStock"
                                className={`form-control ${errors.initialStock ? "is-invalid" : ""}`}
                                name="initialStock"
                                {...register("initialStock", {min: 0, required: true})}
                            />
                            {errors.initialStock?.type === "min" && (
                                <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                            )}
                            {errors.initialStock?.type === "required" && (
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
                                name="publisherName"
                                {...register("publisherName", { validate: checkNumbers })}
                            />
                            {errors.publisherName?.type === "validate" && (
                                <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
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
                            <label htmlFor="yearOfPublication" className="form-label">
                                Publication Year
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.yearOfPublication ? "is-invalid" : ""}`}
                                id="yearOfPublication"
                                name="yearOfPublication"
                                {...register("yearOfPublication", { validate: noOfDigits, max: year.getFullYear() + 1, valueAsNumber: true })}
                            />
                            {errors.yearOfPublication?.type === "max" && (
                                <div className="invalid-feedback">Year Should Not Exceed Present Year. </div>
                            )}
                            {errors.yearOfPublication?.type == "validate" && (
                                <div className="invalid-feedback">Digits Should Be Equal To 4.</div>
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
};

export default UserForm;