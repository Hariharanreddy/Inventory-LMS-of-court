import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

const Login = () => {

    const navigateTo = useNavigate();
    const [passShow, setPassShow] = useState(false);
    const [isSafeToReset, setIsSafeToReset] = useState(false);  //for emptying the input fields after submission happens.

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        if (!isSafeToReset) {
            return;
        }

        reset(); // asynchronously reset your form values
        setIsSafeToReset(false);
    }, [isSafeToReset]);

    const onFormSubmit = async (formData) => {

        const { email, password } = formData;

        const res = await fetch("http://localhost:8000/login", {
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

        const res2 = await res.json();

        if (res2.status === 201) {
            console.log(res2.result.token);
            localStorage.setItem("usersdatatoken", res2.result.token);
            setIsSafeToReset(true);            
            navigateTo("/dash");
        }
        else{
            
        }
    }

    return (
        <div className='card-div' style={{ padding: "1em 3em 1em", maxWidth: "500px" }}>
            <h1 style={{ textAlign: "center", fontWeight: "600", color: "rgb(6, 0, 97)", lineHeight: "1.5" }}>Log In</h1>
            <p style={{ textAlign: "center", opacity: "0.6", color: "rgb(6, 0, 97)" }}>Welcome to CManager,<br />we are glad that you are back.</p>
            <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
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
                    <p style={{ textAlign: "center", opacity: "0.6", color: "rgb(6, 0, 97)", marginTop: "1rem" }}>Don't have an Account? <NavLink to="/registerUser">Sign Up</NavLink> </p>
                </div>
            </form>
        </div>
    )
}

export default Login