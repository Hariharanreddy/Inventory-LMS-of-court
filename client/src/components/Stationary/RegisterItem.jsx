import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"

const RegisterItem = () => {

    const navigateTo = useNavigate();

    const preLoadedValues = {
        itemName: "",
        quantityReceived: 0,
        stock: 0,
        dateOfPurchase: "",
        vendorName: "",
        requisitionCourtName: "",
        dateOfRequisitionReceipt: "",
        dateOfItemIssuance: "",
        lastRemaining: 0
    };

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


        const res = await fetch("http://localhost:8000/registerItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into string first
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

        const data = await res.json();
        console.log(data);

        if (res.status === 422) {
            Swal.fire({
                title: '',
                text: "Item name is already present!",
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
            console.log("Item Has Been Added Successfully!");
            
            Swal.fire({
                title: '',
                text: "Item has been added successfully!",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo("/ItemList");
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
                    <h2>Add New Item</h2>
                    <NavLink to="/ItemList">
                        <button className="btn btn-primary">List</button>
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
}

export default RegisterItem