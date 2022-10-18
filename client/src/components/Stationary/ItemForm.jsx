import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"

const ItemForm = ({ preLoadedValues, id }) => {


    const navigate = useNavigate("");

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
        const {
            itemName,
            quantityReceived,
            stock,
            dateOfPurchase,
            vendorName,
            requisitionCourtName,
            dateOfRequisitionReceipt,
            dateOfItemIssuance,
            lastRemaining } = formData;

        const res2 = await fetch(`http://localhost:8000/updateItem/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                itemName,
                quantityReceived,
                stock,
                dateOfPurchase,
                vendorName,
                requisitionCourtName,
                dateOfRequisitionReceipt,
                dateOfItemIssuance,
                lastRemaining
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
                    navigate("/ItemList");
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
                    navigate("/ItemList");
                }
            })
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
                    <NavLink to="/ItemList">
                        <button className="btn btn-primary home-btn">List</button>
                    </NavLink>
                </div>
                <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="row">

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="itemName" className="form-label">
                                Item Name
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.itemName ? "is-invalid" : ""}`}
                                id="itemName"
                                name="itemName"
                                {...register("itemName", { required: true })}
                            />
                            {errors.itemName && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="quantityReceived" className="form-label">
                                Quantity Received
                            </label>
                            <input
                                type="number"
                                className={`form-control ${errors.quantityReceived ? "is-invalid" : ""}`}
                                id="quantityReceived"
                                name="quantityReceived"
                                {...register("quantityReceived", { min: 0, required: true })}
                            />
                            {errors.quantityReceived?.type === "min" && (
                                <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                            )}
                            {errors.quantityReceived?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="stock" className="form-label">
                                Stock
                            </label>
                            <input
                                type="number"
                                className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                                id="stock"
                                name="stock"
                                {...register("stock", { min: 0, required: true })}
                            />
                            {errors.stock?.type === "min" && (
                                <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                            )}
                            {errors.stock?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor='dateOfPurchase' className="form-label">Date Of Purchase</label>
                            <input
                                type="date"
                                id="dateOfPurchase"
                                className={`form-control ${errors.dateOfPurchase ? "is-invalid" : ""}`}
                                name="dateOfPurchase"
                                {...register("dateOfPurchase", { required: true })}
                            />
                            {errors.dateOfPurchase?.type === "required" && (
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
                                name="vendorName"
                                {...register("vendorName", { validate: checkNumbers })}
                            />
                            {errors.vendorName?.type === "validate" && (
                                <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="requisitionCourtName" className="form-label">
                                Name Of Requisition Court
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.requisitionCourtName ? "is-invalid" : ""}`}
                                id="requisitionCourtName"
                                name="requisitionCourtName"
                                {...register("requisitionCourtName", { validate: checkNumbers })}
                            />
                            {errors.requisitionCourtName?.type === "validate" && (
                                <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="dateOfRequisitionReceipt" className="form-label">
                                Date Of Requisition Receipt
                            </label>
                            <input
                                type="date"
                                className={`form-control ${errors.dateOfRequisitionReceipt ? "is-invalid" : ""}`}
                                id="dateOfRequisitionReceipt"
                                name="dateOfRequisitionReceipt"
                                {...register("dateOfRequisitionReceipt")}
                            />
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="dateOfItemIssuance" className="form-label">
                                Date Of Issuance Of Item
                            </label>
                            <input
                                type="date"
                                className={`form-control ${errors.dateOfItemIssuance ? "is-invalid" : ""}`}
                                id="dateOfItemIssuance"
                                name="dateOfItemIssuance"
                                {...register("dateOfItemIssuance")}
                            />
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="lastRemaining" className="form-label">
                                Last Remaining
                            </label>
                            <input
                                type="number"
                                className={`form-control ${errors.lastRemaining ? "is-invalid" : ""}`}
                                id="lastRemaining"
                                name="lastRemaining"
                                {...register("lastRemaining", { min: 0, required: true })}
                            />
                            {errors.lastRemaining?.type === "min" && (
                                <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                            )}
                            {errors.lastRemaining?.type === "required" && (
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
};

export default ItemForm;