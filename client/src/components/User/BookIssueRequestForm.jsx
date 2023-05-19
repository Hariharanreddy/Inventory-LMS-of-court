import React, { useContext, useEffect } from 'react'
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { LoginContext } from "../ContextProvider/Context"
import Swal from "sweetalert2"

const BookIssueRequest = () => {

    const [getBookData, setBookData] = React.useState([]);
    const [data, setData] = React.useState(false);
    const [disable, setDisable] = React.useState(false);
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
        if (status == 422) {

            setDisable(false);
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
        else if (status == 400) {

            setDisable(false);
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
        else if (status == 401) {

            setDisable(false);
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
        else {
            console.log("Data Has Been Added Successfully!");

            setDisable(false);
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

        setDisable(true);

        const {
            dateOfRequisition,
            quantity
        } = formData;

        console.log(formData, id, logindata.ValidUserOne._id);

        if (typeOfSubmit == "credit") {

            const res = await fetch("/api/directAcceptIssueRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                //whenever we send data to database, we convert it into JSON type string first
                body: JSON.stringify({
                    userId: logindata.ValidUserOne._id,
                    bookId: id,
                    dateOfRequisition,
                    quantity
                })
            });

            const data = await res.json();
            console.log(data);

            showPopUp(res.status);
        }
        else {
            const res = await fetch("/api/bookIssueRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                //whenever we send data to database, we convert it into JSON type string first
                body: JSON.stringify({
                    userId: logindata.ValidUserOne._id,
                    bookId: id,
                    dateOfRequisition,
                    quantity
                })
            });

            const data = await res.json();
            console.log(data);

            showPopUp(res.status);
        }
    }

    const getdata = async () => {

        const res = await fetch(`/api/getBook/${id}`, {
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
            setBookData(data2);
            setData(true);
            console.log("Client side :Form Data has been fetched successfully.");
        }

    }

    useEffect(() => {
        getdata();
    }, []);

    return (
        <>{
            data ?
                <div className='card-div'>
                    <div className='card-header'>
                        <h2>Issue Request</h2>
                        <NavLink to="/BookList">
                            <button className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }}> &lt; Back</button>
                        </NavLink>
                    </div>

                    <div className='item-details'>

                        <h6>Title -{'>'} {getBookData.bookName} ({getBookData.yearOfPublication})</h6>
                        <h6>Author -{'>'} {getBookData.authorName}</h6>
                        <h6>Price -{'>'} Rs.{getBookData.price}</h6>
                        <h6>Current Stock -{'>'} {getBookData.stock}</h6>

                    </div>

                    <p className="fw-normal fst-italic text-primary">Today's Date will be registered, if not specified.</p>
                    <form className="mt-3" >
                        <div className="row">
                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor='quantity' className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                                    name="quantity"
                                    {...register("quantity", { min: 1, required: true })}
                                />
                                {errors.quantity?.type === "min" && (
                                    <div className="invalid-feedback">Quantity cannot be 0.</div>
                                )}
                                {errors.quantity?.type === "required" && (
                                    <div className="invalid-feedback">This Field Is Required.</div>
                                )}
                            </div>

                            <div className="mb-3 col-lg-6 col-md-6 col-12">
                                <label htmlFor="dateOfRequisition" className="form-label">
                                    Date Of Requisition
                                </label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.dateOfRequisition ? "is-invalid" : ""}`}
                                    id="dateOfRequisition"
                                    {...register("dateOfRequisition")}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="d-flex justify-content-end mt-2 mb-2">
                        <button className="btn mx-4" style={{ backgroundColor: "#EAE8FF", color: "black" }} disabled={disable} type="submit" onClick={handleSubmit((data) => {
                            formSubmit(data, "generate");
                        })}>Generate Issue</button>
                        <button className="btn" style={{ backgroundColor: "lightblue", color: "black" }} disabled={disable} type="submit" onClick={handleSubmit((data) => {
                            formSubmit(data, "credit");
                        })}>Credit</button>
                    </div>
                </div>
                : <div className="m-auto" >
                    <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                    </div>
                </div>}
        </>

    )
}

export default BookIssueRequest