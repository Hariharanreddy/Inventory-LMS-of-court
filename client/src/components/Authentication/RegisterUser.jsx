import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"

const RegisterUser = () => {

    const navigateTo = useNavigate();
    const [disable, setDisable] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm();


    const onFormSubmit = async (formData) => {

        setDisable(true);
        const {
            name,
            email,
            department,
            departmentId,
            dob,
            phoneNo } = formData;


        const res = await fetch("/api/registerUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into string first
            body: JSON.stringify({
                name,
                email,
                department,
                departmentId,
                dob,
                phoneNo,
                password: "123456",
                cpassword: "123456"
            })
        });

        const data = await res.json();
        console.log(data);

        if (res.status == 422) {

            setDisable(false);

            Swal.fire({
                title: 'Sign Up Unsuccessful!',
                text: `${"Try Using Another Email."}`,
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
        else if (res.status == 400) {

            setDisable(false);

            Swal.fire({
                title: 'Email Already Exist!',
                text: `${"Try Using Another Email."}`,
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
            console.log("User Has Been Added Successfully!")

            setDisable(false);

            Swal.fire({
                title: 'User has been added successfully!',
                text: "",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo("/login");
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
        <div className='card-div-authenticate-page' style={{ padding: "1em 3em 1em" }}>
            <h1 style={{fontWeight: "600", fontSize:"40px", color: "rgb(6, 0, 97)", lineHeight: "2.5"}}>Sign Up</h1>
            <p style={{  color: "rgb(6, 0, 97)" }}>Please, Enter Your Details.</p>
            <form className="mt-2" onSubmit={handleSubmit(onFormSubmit)}>
                <div className="row">

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="name" className="form-label">
                            Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            id="name"
                            {...register("name", { validate: checkNumbers, required: true })}
                        />
                        {errors.name?.type === "validate" && (
                            <div className="invalid-feedback">Numbers And Special Characters Are Not Allowed</div>
                        )}
                        {errors.name?.type === "required" && (
                            <div className="invalid-feedback">This Field Is Required</div>
                        )}
                    </div>

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="email" className="form-label">
                            Email<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            id="email"
                            {...register("email", { pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, required: true })}
                        />
                        {errors.email?.type === "pattern" && (
                            <div className="invalid-feedback">Invalid Email Format</div>
                        )}
                        {errors.email?.type === "required" && (
                            <div className="invalid-feedback">This Field Is Required</div>
                        )}
                    </div>

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="department" className="form-label">
                            Department<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.department ? "is-invalid" : ""}`}
                            id="department"
                            {...register("department", { validate: checkNumbers, required: true })}
                        />
                        {errors.department?.type === "validate" && (
                            <div className="invalid-feedback">Numbers Or Special Characters Are Not Allowed</div>
                        )}
                        {errors.department?.type === "required" && (
                            <div className="invalid-feedback">This Field Is Required</div>
                        )}
                    </div>

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor='departmentId' className="form-label">
                            Department Id<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="departmentId"
                            className={`form-control ${errors.departmentId ? "is-invalid" : ""}`}
                            name="departmentId"
                            {...register("departmentId", { required: true })}
                        />
                        {errors.departmentId?.type === "required" && (
                            <div className="invalid-feedback">This Field Is Required</div>
                        )}
                    </div>

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="phoneNo" className="form-label">
                            Phone No<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.phoneNo ? "is-invalid" : ""}`}
                            id="phoneNo"
                            {...register("phoneNo", { min: 0, maxLength: 10, minLength: 10, required: true })}
                        />
                        {errors.phoneNo?.type === "min" && (
                            <div className="invalid-feedback">Number Cannot Be Negative</div>
                        )}
                        {errors.phoneNo?.type === "maxLength" && (
                            <div className="invalid-feedback">Number Cannot Exceed 10 Digits</div>
                        )}
                        {errors.phoneNo?.type === "minLength" && (
                            <div className="invalid-feedback">Number Cannot Be Less Than 10 Digits</div>
                        )}
                        {errors.phoneNo?.type === "required" && (
                            <div className="invalid-feedback">This Field Is Required</div>
                        )}
                    </div>

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="dob" className="form-label">
                            Date Of Birth<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="date"
                            className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                            id="dob"
                            {...register("dob", { required: true })}
                        />
                        {errors.dob && (
                            <div className="invalid-feedback">This Field Is Required</div>
                        )}
                    </div>

                    <div className="d-grid">
                        <button className="btn submit-button" type="submit" disabled={disable}>Create Account</button>
                        <p style={{ fontWeight:"500", color: "rgb(6, 0, 97)", marginTop: "1.2em" }}>Already, have an Account? <NavLink to="/login">Sign In</NavLink> </p>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default RegisterUser