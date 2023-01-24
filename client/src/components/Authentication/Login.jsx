import { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import label from "../../images/label.png"
import Swal from "sweetalert2"

const Login = () => {

    const navigateTo = useNavigate();
    const [disable, setDisable] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onFormSubmit = async (formData) => {

        setDisable(true);
        const { email } = formData;

        const data = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //whenever we send data to database, we convert it into string first
            body: JSON.stringify({
                email,
                password: "123456"
            })
        });

        const res = await data.json();

        if (res.status === 201) {

            localStorage.setItem("usersdatatoken", res.result.token);
            navigateTo("/BookList");
            reset();
            setDisable(false);

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
                    setDisable(false);
                }
            })
        }
    }

    return (
        <>
            <div className='flexArea'>

                <div className='landingPageSection'>
                    <img src={label} style={{ width: "60px", marginTop: "20px", marginLeft: "20px" }} />
                    <div className="landingPageTitle">

                        <h1 style={{ color: "white", fontWeight: "800", fontSize: "60px", letterSpacing: "2px" }}>Library</h1>

                        {/* <div class="words">
                            <h1 className='rotating-text'>Library</h1>
                            <h1 className='rotating-text'>Stationery</h1>         
                        </div> */}

                        <h1 style={{ color: "rgb(6, 0, 97)", fontWeight: "800", fontSize: "60px", letterSpacing: "2px" }}>Management</h1>
                        <h1 style={{ color: "white", fontWeight: "800", fontSize: "60px", letterSpacing: "2px", marginBottom: "0.8em" }}>System</h1>
                        <marquee width="100%" direction="left" height="50px">
                            <h3 style={{ fontWeight: "700", fontSize: "40px", letterSpacing: "1px" }}>Durg District Court</h3>
                        </marquee>
                        {/* <button className="btn-effect" style={{alignSelf:"right"}}><NavLink to="/login"><span style={{color:"#060061"}}>Click Here</span></NavLink></button> */}
                    </div>
                </div>

                <div className='card-div-authenticate-page' style={{ padding: "1em 3em 1em", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1 style={{ fontWeight: "600", fontSize: "40px", color: "rgb(6, 0, 97)", lineHeight: "2.0" }}>Please, Log In</h1>
                    <p style={{ color: "rgb(6, 0, 97)" }}>Enter user's Email.</p>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
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

                            {/* <div className="mb-3 col-12">
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
                            </div> */}

                            <div className="d-grid">
                                <button className="btn submit-button" type="submit" disabled={disable}>Login</button>
                            </div>
                            <p style={{ color: "rgb(6, 0, 97)", fontWeight: "500", marginTop: "2rem" }}>Don't have an account? <NavLink to="/registerUser">Sign Up</NavLink> </p>
                        </div>
                    </form>
                </div>
                {/* <div className='imageArea'></div> */}
            </div>
        </>
    )
}

export default Login