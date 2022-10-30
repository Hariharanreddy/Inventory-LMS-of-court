import { NavLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"

const PasswordReset = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onFormSubmit = async (formData) => {

        const { email } = formData;

        const data = await fetch("http://localhost:8000/sendPasswordLink", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const res = await data.json();

        if (res.status == 201) {
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
                title: 'Pasword Reset Link sent successfully to your email!'
            })

            reset();
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
                title: 'Submission failed for some reason!'
            })
        }
    }

    return (
        <div className='card-div' style={{ padding: "1em 3em 1em", maxWidth: "500px" }}>
            <h1 style={{ textAlign: "center", fontWeight: "600", color: "rgb(6, 0, 97)", lineHeight: "1.5" }}>Enter Your Email</h1>
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
                    <div className='d-grid'>
                        <button className="btn btn-primary submit-button" type="submit">Submit</button>
                    </div>
                    <p style={{ textAlign: "center", color: "rgb(6, 0, 97)", fontWeight: "500", marginTop: "1rem" }}>Go Back To Login Page <NavLink to="/login">Click Here</NavLink> </p>
                </div>
            </form>
        </div>
    )
}

export default PasswordReset