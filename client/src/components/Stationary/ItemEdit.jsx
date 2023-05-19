import { useEffect, useState } from 'react'
import { useParams, useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"

const ItemEdit = () => {

    const { id } = useParams("");
    const [data, setData] = useState(null);
    const [disable, setDisable] = useState(false);
    const navigateTo = useNavigate("");

    const getdata = async () => {

        const res = await fetch(`/api/getItem/${id}`, {
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

        const { 
            itemName,
            initialStock,
            stock,
            price } = formData;

        const res2 = await fetch(`/api/updateItem/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              itemName,
              initialStock,
              stock,
              price
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

    const deleteItem = async (id) => {

        setDisable(true);

        const res2 = await fetch(`/api/deleteItem/${id}`, {
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
            console.log("Data has been deleted.");
            setDisable(false);
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
                deleteItem(id);
            }
        })
    }

    return (data ?

        <>
            <div className='card-div'>
                <div className='edit-form'>
                    <div className='card-header'>
                        <h2>Edit Details</h2>
                        <div>

                            <button className="btn" style={{ backgroundColor: "#ff6666", color: "white" }} onClick={() => checkDelete(id)}>Delete</button>
                            <button className="btn mx-2" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => navigateTo(-1)}> &lt; Back</button>
                            
                        </div>
                    </div>
                    <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="row">

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="itemName" className="form-label">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.itemName ? "is-invalid" : ""}`}
                                    id="itemName"
                                    name="itemName"
                                    {...register("itemName", { required: true })}
                                />
                                {errors.itemName && (
                                    <div className="invalid-feedback">This Field Is Required.</div>
                                )}
                            </div>

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor='stock' className="form-label">Current Stock</label>
                                <input
                                    type="number"
                                    id="stock"
                                    className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                                    name="stock"
                                    {...register("stock", { min: 0, required: true })}
                                />
                                {errors.stock?.type === "min" && (
                                    <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                                )}
                                {errors.stock?.type === "required" && (
                                    <div className="invalid-feedback">This Field Is Required.</div>
                                )}
                            </div>

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor='initialStock' className="form-label">Initial Stock</label>
                                <input
                                    type="number"
                                    id="initialStock"
                                    className={`form-control ${errors.initialStock ? "is-invalid" : ""}`}
                                    name="initialStock"
                                    {...register("initialStock", { min: 0, required: true })}
                                />
                                {errors.initialStock?.type === "min" && (
                                    <div className="invalid-feedback">Quantity cannot be less than 0.</div>
                                )}
                                {errors.initialStock?.type === "required" && (
                                    <div className="invalid-feedback">This Field Is Required.</div>
                                )}
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
                                <button className="btn btn-primary submit-button" type="submit" disabled={disable}>Submit</button>
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

export default ItemEdit;