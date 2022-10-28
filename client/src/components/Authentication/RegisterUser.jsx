import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Swal from "sweetalert2"

const RegisterUser = () => {

    const navigateTo = useNavigate();
    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset
    } = useForm();


    const onFormSubmit = async (formData) => {

        const {
            name,
            email,
            department,
            departmentId,
            dob,
            password,
            cpassword } = formData;


        const res = await fetch("http://localhost:8000/registerUser", {
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
                password,
                cpassword
            })
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422) {
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
        else if(res.status === 400){
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

            reset(); 
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
                    reset();
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

    const checkSame = (value) => {
        if (!value || !getValues('password')) {
            return true
        }
        return value === getValues('password');
    }

    return (
        <div className='card-div' style={{ padding: "1em 3em 1em" }}>
            <h1 style={{ textAlign: "center", fontWeight: "600", color: "rgb(6, 0, 97)", lineHeight: "1.5", opacity: "0.9" }}>Sign Up</h1>
            <p style={{ textAlign: "center", opacity: "0.6", color: "rgb(6, 0, 97)" }}>Thanks for preferring CManager.<br />We hope you will like it.</p>
            <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
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
                        <label htmlFor="password" className="form-label">
                            Password<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="input-group mb-3">
                            <button className="password-btn btn" type="button" id="button-addon2" onClick={() => setPassShow(!passShow)}>
                                {!passShow ? "Show" : "Hide"}</button>
                            <input
                                type={!passShow ? "password" : "text"}
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                id="password"
                                name="password"
                                {...register("password", { maxLength: 15, minLength: 6, required: true })}
                                aria-describedby="button-addon2" />
                            {errors.password?.type === "minLength" && (
                                <div className="invalid-feedback">Password Should Be Of Minimum 6 Letters</div>
                            )}
                            {errors.password?.type === "maxLength" && (
                                <div className="invalid-feedback">Password Cannot Exceed 15 Letters</div>
                            )}
                            {errors.password?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required</div>
                            )}
                        </div>
                    </div>

                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="cpassword" className="form-label">
                            Confirm Password<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="input-group mb-3">
                            <button className="password-btn btn" type="button" id="button-addon1" onClick={() => setCPassShow(!cpassShow)}>
                                {!cpassShow ? "Show" : "Hide"}</button>
                            <input
                                type={!cpassShow ? "password" : "text"}
                                className={`form-control ${errors.cpassword ? "is-invalid" : ""}`}
                                id="cpassword"
                                name="cpassword"
                                {...register("cpassword", { validate: checkSame, maxLength: 15, minLength: 6, required: true })}
                                aria-describedby="button-addon1" />
                            {errors.cpassword?.type === "validate" && (
                                <div className="invalid-feedback">Passwords Are Not Same</div>
                            )}
                            {errors.cpassword?.type === "minLength" && (
                                <div className="invalid-feedback">Password Should Be Of Minimum 6 Letters</div>
                            )}
                            {errors.cpassword?.type === "maxLength" && (
                                <div className="invalid-feedback">Password Cannot Exceed 15 Letters</div>
                            )}
                            {errors.cpassword?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required</div>
                            )}
                        </div>
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
                        <button className="btn btn-primary submit-button" type="submit">Create Account</button>
                        <p style={{ textAlign: "center", opacity: "0.6", color: "rgb(6, 0, 97)", marginTop: "1rem" }}>Already, have an Account? <NavLink to="/login">Sign In</NavLink> </p>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default RegisterUser