import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import durg from "../../images/durg.jpg"

const Login = () => {

    const navigateTo = useNavigate();
    const [passShow, setPassShow] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onFormSubmit = async (formData) => {

        const { email, password } = formData;

        const data = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into string first
            body: JSON.stringify({
                email,
                password
            })
        });

        const res = await data.json();

        if (res.status === 201) {

            localStorage.setItem("usersdatatoken", res.result.token);
            navigateTo("/BookList");
            reset();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
            })

        }
        else {
            Swal.fire({
                title: 'Login Failed.',
                text: `${"Try Again!"}`,
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    reset();
                }
            })
        }
    }

    return (
        <>
            <div className='flexArea'>
                

                <div className='card-div authenticatePages' style={{ padding: "1em 3em 1em", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1 style={{ fontWeight: "600", color: "rgb(6, 0, 97)", lineHeight: "1.5" }}>Log In</h1>
                    <p style={{  color: "rgb(6, 0, 97)" }}>Enter Your Email And Password.</p>
                    <form className="mt-2" onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="row">

                            <div className="mb-3 col-12">
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

                            <div className="mb-3 col-12">
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

                            <div className="d-grid">
                                <button className="btn btn-primary submit-button" type="submit">Login</button>
                            </div>
                            <p style={{ textAlign: "right", color: "rgb(6, 0, 97)", fontWeight: "500", marginTop: "2rem" }}>Don't have an account? <NavLink to="/registerUser">Sign Up</NavLink> </p>
                            <p style={{ textAlign: "right", color: "rgb(6, 0, 97)", fontWeight: "500" }}>Forgot password? <NavLink to="/passwordReset">Click Here</NavLink> </p>
                        </div>
                    </form>
                </div>
                <div className='imageArea'></div>
            </div>
        </>
    )
}

export default Login