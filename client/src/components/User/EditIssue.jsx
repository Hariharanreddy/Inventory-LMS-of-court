import { useEffect, useState } from 'react'
import { useParams, useNavigate, NavLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"

const EditIssue = () => {

    const { id } = useParams("");
    const [data, setData] = useState(null);
    const navigateTo = useNavigate("");

    const getdata = async () => {

        const res = await fetch(`http://localhost:8000/getSpecificIssuedBookRequest/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data2 = await res.json();

        if (res.status == 422 || !data2) {
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
        // console.log(typeof data.dateOfRequisition.toString().slice(0,10));

        if (data) {

            if (data.dateOfRequisition != null) {
                data.dateOfRequisition = data.dateOfRequisition.toString().slice(0, 10);
            }

            if (data.dateOfIssue != null) {
                data.dateOfIssue = data.dateOfIssue.toString().slice(0, 10);
            }

            if (data.dateOfReturn != null) {
                data.dateOfReturn = data.dateOfReturn.toString().slice(0, 10);
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

        const {
            dateOfRequisition,
            dateOfIssue,
            dateOfReturn,
            quantity,
            price
        } = formData;

        const res2 = await fetch(`http://localhost:8000/updateSpecificIssuedBookRequest/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dateOfRequisition,
                dateOfIssue,
                dateOfReturn,
                quantity,
                price
            })
        });

        const data2 = await res2.json();
        console.log(data2);

        if (res2.status != 201 || !data2) {
            Swal.fire({
                title: '',
                text: "Data could not be updated for some reason!",
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No ',
            }).then((result) => {
                if (result.isConfirmed) {
                }
            })
        }
        else {
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
                    navigateTo("/MyIssuedBooks");
                }
            })
        }
    }

    const deleteRequest = async (id) => {
        const res2 = await fetch(`http://localhost:8000/deleteBookIssueRequest/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const deleteData = await res2.json();
        console.log(deleteData);

        if (res2.status === 422) {
            console.log("Data could not be deleted.");
        }
        else {
            console.log("Data has been deleted.");
            navigateTo("/MyIssuedBooks");
        }
    }

    const checkDelete = (id) => {
        Swal.fire({
            title: 'Are You Sure?',
            text: "Request will be removed permanently!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No ',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest(id);
            }
        })
    }


    return (data ?

        <>
            <div className='card-div'>
                <div className='container edit-form'>
                    <div className='card-header'>
                        <h2>Edit Issue</h2>
                        <button className="btn" style={{ backgroundColor: "#ff6666", color: "white" }} onClick={() => checkDelete(id)}>Delete</button>
                    </div>
                    <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="row">

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="dateOfRequisition" className="form-label">
                                    Date Of Requisition<span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.dateOfRequisition ? "is-invalid" : ""}`}
                                    id="dateOfRequisition"
                                    {...register("dateOfRequisition", { required: true })}
                                />
                                {errors.dateOfRequisition && (
                                    <div className="invalid-feedback">This Field Is Required</div>
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
                                    <div className="invalid-feedback">This Field Is Required</div>
                                )}
                            </div>

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="dateOfReturn" className="form-label">
                                    Date Of Return
                                </label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.dateOfReturn ? "is-invalid" : ""}`}
                                    id="dateOfReturn"
                                    {...register("dateOfReturn")}
                                />
                            </div>


                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                    id="price"
                                    name="price"
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
                                <button className="btn btn-primary submit-button" type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>

        : <div className="m-auto" >
            <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
            </div>
        </div>)
}

export default EditIssue;