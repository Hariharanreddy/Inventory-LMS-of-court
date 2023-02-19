import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { useForm, useController } from "react-hook-form"
import Swal from "sweetalert2"

const UserEdit = () => {

    const { id } = useParams("");
    const [data, setData] = useState(null);
    const [disable, setDisable] = useState(false);
    const navigateTo = useNavigate("");

    const getdata = async () => {

        const res = await fetch(`/api/getUser/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data2 = await res.json();

        if (res.status === 422 || !data2) {
            console.log("Client side :Form Data could not be fetched.");
        }
        else {
            setData(data2);
            console.log("Client side :Form Data has been fetched successfully.");
        }
    }

    useEffect(() => {
        getdata();
    }, []);

    useEffect(() => {
        if (data) {
            if (data.dob != null) {
                data.dob = data.dob.toString().slice(0, 10);
            }
        }

        reset(data);
    }, [data]);

    //For fetching the book details
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onFormSubmit = async (formData) => {

        setDisable(true);
        console.log(formData, "hariharan");

        const {
            name,
            email,
            department,
            departmentId,
            dob,
            phoneNo,
            isActive} = formData;

        const res2 = await fetch(`/api/updateUser/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email: email.toLowerCase(),
                department,
                departmentId,
                dob,
                phoneNo,
                isActive
            })
        });

        const data2 = await res2.json();
        console.log(data2);

        if (res2.status == 422 || !data2) {

            setDisable(false);

            Swal.fire({
                title: '',
                text: "Data could not updated for some reason!",
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo(-1);
                }
            })
        }
        else {

            setDisable(false);

            Swal.fire({
                title: '',
                text: "Data updated successfully!",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigateTo(-1)
                }
            })
        }
    }

    const deleteUser = async (id) => {

        setDisable(true);

        const res2 = await fetch(`/api/deleteUser/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const deleteData = await res2.json();
        console.log(deleteData);


        if (res2.status != 201) {
            setDisable(false);
            console.log("Data could not be deleted.");
        }
        else {
            setDisable(false);
            console.log("Data has been deleted.");
            navigateTo(-1);
        }
    }

    const checkDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Data will be removed permanently!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No ',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(id);
            }
        })
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

    return (data ?

        <>
            <div className='card-div'>
                <div className='edit-form'>
                    <div className='card-header'>
                        <h2>Edit User Details</h2>
                        <div>

                            <button className="btn" style={{ backgroundColor: "#ff6666", color: "white" }} onClick={() => checkDelete(id)}>Delete</button>
                            <button className="btn mx-2" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => navigateTo(-1)}> &lt; Back</button>

                        </div>
                    </div>
                    <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="row">

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="name" className="form-label">
                                    User Name<span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    id="name"
                                    name="name"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">This Field Is Required.</div>
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

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor='isActive' className="form-label">
                                    Status
                                </label>
                                <input
                                    type="text"
                                    id="isActive"
                                    className={`form-control ${errors.isActive ? "is-invalid" : ""}`}
                                    name="isActive"
                                    {...register("isActive")}
                                />
                            </div>

                            <div className="d-grid">
                                <button className="btn btn-primary submit-button" type="submit" disabled={disable}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </>
        : <div className="m-auto" >
            <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
            </div>
        </div>)
}

export default UserEdit;