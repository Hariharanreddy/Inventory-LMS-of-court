import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"

const RegisterItem = (props) => {

    const navigateTo = useNavigate();
    const [disable, setDisable] = React.useState(false);

    const preLoadedValues = {
        price: 0,
        initialStock: 0
    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: preLoadedValues
    });

    const onFormSubmit = async (formData) => {

        setDisable(true);

        const {
            itemName,
            initialStock,
            price
        } = formData;


        const res = await fetch("/api/registerItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into string first
            body: JSON.stringify({
                itemName,
                initialStock,
                price,
                itemType: props.type
            })
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 406) {
            setDisable(false);
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
        else if (res.status == 422) {
            setDisable(false);
            Swal.fire({
                title: '',
                text: "Data Submission Failed!",
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
            console.log("Item Has Been Added Successfully!");
            setDisable(false);
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
                    navigateTo(`/ItemList${props.type}`);
                }
            })
        }

    }

    return (
        <div className='card-div'>
            <div className='card-header'>
                <h2>Add New Item</h2>
                <NavLink to={`/ItemList${props.type}`}>
                    <button className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }}> &lt; Back</button>
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
                        <label htmlFor="initialStock" className="form-label">
                            Initial Stock
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.initialStock ? "is-invalid" : ""}`}
                            id="initialStock"
                            {...register("initialStock", { min: 0, required: true })}
                        />
                        {errors.initialStock?.type === "min" && (
                            <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                        )}
                        {errors.initialStock?.type === "required" && (
                            <div className="invalid-feedback">This Field Is Required.</div>
                        )}
                    </div>

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="price" className="form-label">
                            Price
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.price ? "is-invalid" : ""}`}
                            id="price"
                            {...register("price", { min: 0, required: true })}
                        />
                        {errors.price?.type === "min" && (
                            <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                        )}
                        {errors.price?.type === "required" && (
                            <div className="invalid-feedback">This Field Is Required.</div>
                        )}
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-primary submit-button" type="submit" disabled={disable}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterItem