import React, { useContext } from 'react'
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { LoginContext } from "../ContextProvider/Context"

import Swal from "sweetalert2"

const BookIssueRequest = () => {

    const { logindata, setLoginData } = useContext(LoginContext);
    const navigateTo = useNavigate();
    const { id } = useParams("");

    const preLoadedValues = {
        quantity: 0
    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: preLoadedValues
    });

    const showPopUp = (status) => {
        if (status === 422) {
            Swal.fire({
                title: '',
                text: "Data Submission Failed.",
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
        else if(status == 400){
            Swal.fire({
                title: '',
                text: "Either stock is 0 or the quantity asked for is greater than stock!",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                }
            })
        }
        else if(status == 401){
            Swal.fire({
                title: '',
                text: "Book or user does not exist!",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo("/BookList");
                }
            })
        }
        else{
            // console.log("Data Has Been Added Successfully!");

            Swal.fire({
                title: '',
                text: "Data logged in Successfully!",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Ok',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo("/BookList");
                }
            })
        }
    }



    const formSubmit = async (formData, typeOfSubmit) => {

        const {
            dateOfIssue,
            quantity
        } = formData;

        console.log(formData, id, logindata.ValidUserOne._id);

        if (typeOfSubmit == "credit") {

            const res = await fetch("http://localhost:8000/directAcceptIssueRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                //whenever we send data to database, we convert it into JSON type string first
                body: JSON.stringify({
                    userId: logindata.ValidUserOne._id,
                    bookId: id,
                    dateOfIssue,
                    quantity
                })
            });

            const data = await res.json();
            console.log(data);

            showPopUp(res.status);
        }
        else{
            const res = await fetch("http://localhost:8000/bookIssueRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                //whenever we send data to database, we convert it into JSON type string first
                body: JSON.stringify({
                    userId: logindata.ValidUserOne._id,
                    bookId: id,
                    dateOfIssue,
                    quantity
                })
            });

            const data = await res.json();
            console.log(data);

            showPopUp(res.status);
        }
    }

    return (
        <div className='card-div'>
            <div className='container'>
                <div className='card-header'>
                    <h2>Issue Request</h2>
                    <NavLink to="/BookList">
                        <button className="btn btn-primary">Book List</button>
                    </NavLink>
                </div>
                <form className="mt-4" >
                    <div className="row">

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor='quantity' className="form-label">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                                name="quantity"
                                {...register("quantity", { min: 0, required: true })}
                            />
                            {errors.quantity?.type === "min" && (
                                <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                            )}
                            {errors.quantity?.type === "required" && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>

                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label htmlFor="dateOfIssue" className="form-label">
                                Date Of Issue
                            </label>
                            <input
                                type="date"
                                className={`form-control ${errors.dateOfIssue ? "is-invalid" : ""}`}
                                id="dateOfIssue"
                                {...register("dateOfIssue", { required: true })}
                            />
                            {errors.dateOfIssue && (
                                <div className="invalid-feedback">This Field Is Required.</div>
                            )}
                        </div>
                    </div>
                </form>
                <div className="d-flex justify-content-end mt-2">
                    <button className="btn btn-primary mx-4" type="submit" onClick={handleSubmit((data) => {
                        formSubmit(data, "generate");
                    })}>Generate Issue</button>
                    <button className="btn btn-success" type="submit" onClick={handleSubmit((data) => {
                        formSubmit(data, "credit");
                    })}>Credit</button>
                </div>
            </div>
        </div>
    )
}

export default BookIssueRequest