
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { NavLink, useParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const ForgotPassword = () => {

    const { id, token } = useParams();
    const navigateTo = useNavigate();
    const [passShow, setPassShow] = useState(false);
    const [data, setData] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const userValid = async () => {
        const res = await fetch(`http://localhost:8000/forgotPassword/${id}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json()

        if (data.status == 201) {
            console.log("user valid")
        } else {
            navigateTo("*");
        }
    }

    const onFormSubmit = async (formData) => {

        const { password } = formData;

        const data = await fetch(`http://localhost:8000/${id}/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        });

        const res = await data.json()

        if (res.status == 201) {
            reset();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 10000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Password Updated Successfully!'
            })


        }
        else {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 10000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: 'Token Expired Generate New Link!'
            })
        }
    }

    useEffect(() => {
        userValid()
        setTimeout(() => {
            setData(true)
        }, 3000)
    }, [])

    return (
        <>
            {
                data ?
                    <div className='card-div' style={{ padding: "1em 3em 1em", maxWidth: "500px" }}>
                        <h1 style={{ textAlign: "center", fontWeight: "500", color: "rgb(6, 0, 97)", lineHeight: "2" }}>Enter New Password</h1>
                        <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="row">
                                <div className="mb-3 col-12">
                                    <label htmlFor="password" className="form-label">
                                        New Password<span style={{ color: "red" }}>*</span>
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
                                <div className='d-grid'>
                                    <button className="btn btn-primary submit-button" type="submit">Submit</button>
                                </div>
                                <p style={{ textAlign: "center", color: "rgb(6, 0, 97)", fontWeight: "500", marginTop: "1rem" }}>Go Back To Login Page <NavLink to="/login">Click Here</NavLink> </p>
                            </div>
                        </form>
                    </div> :

                    <div className="m-auto" >
                        <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                        </div>
                    </div>
            }
        </>
    )
}

export default ForgotPassword