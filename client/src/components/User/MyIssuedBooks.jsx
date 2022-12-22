import { useState, useEffect, useContext } from 'react'
import { LoginContext } from "../ContextProvider/Context"
import Swal from "sweetalert2"

const myIssuedBooks = () => {

    const [getRequestData, setRequestData] = useState([]);
    const [data, setData] = useState(false);
    const { logindata, setLoginData } = useContext(LoginContext);

    //For printing all the users from the database
    const getdata = async () => {

        const res = await fetch("http://localhost:8000/showIssuedBooksRequest", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const fetchedData = await res.json();

        if (res.status === 422 || !fetchedData) {
            console.log("Requests could not be fetched.");
        }
        else {
            setRequestData(fetchedData);
            setData(true);
            console.log("All Requests have been fetched properly.");
        }
    }

    const bookReturn = async (id) => {

        const res2 = await fetch(`http://localhost:8000/bookReturn/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const updateData = await res2.json();
        console.log(updateData);


        if (res2.status === 422) {
            console.log("Data could not be updated.");
        }
        else {
            console.log("Data has been updated.");
            getdata();

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
                title: 'Data updated successfully.'
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
            getdata();
        }
    }

    const acceptRequest = async (id) => {
        const res2 = await fetch(`http://localhost:8000/acceptBookIssueRequest/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const updatedRequestData = await res2.json();
        console.log(updatedRequestData);

        if (res2.status === 422) {
            console.log("Request Could Not Be Accepted.");

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'error',
                title: 'Request could not be accepted.'
              })


        }
        else {
            console.log("Request Accepted Successfully.");
            getdata();

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
                title: 'Request accepted successfully.'
              })
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

    useEffect(() => {
        if (logindata.ValidUserOne != undefined) {
            if (logindata.ValidUserOne.name) {
                getdata();
            }
        }
    }, []);

    return (
        <>{data ? <div className="container list-section mt-4">
            <div className="add_btn mt-2 mb-4">
                <h2>Issued Books By {getRequestData ? logindata.ValidUserOne.name : ""}</h2>
            </div>
            <table className="table table-bordered text-center">
                <thead>
                    <tr className="attribute-row">
                        <th scope="col">S.No</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Date Of Requisition</th>
                        <th scope="col">Issue Status</th>
                        <th scope="col">Return Status</th>
                        <th scope="col">Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        getRequestData && getRequestData.filter((element) => {
                            if (element.userId == logindata.ValidUserOne._id) {
                                return element;
                            }
                        }).map((element, serialNum) => {
                            return (
                                <tr className="record-row" key={serialNum}>
                                    <th scope="row">{serialNum + 1}</th>
                                    <td>{element.bookName} </td>
                                    <td>{element.authorName}</td>
                                    <td>{element.quantity}</td>
                                    <td>{element.dateOfRequisition}</td>
                                    {
                                        element.dateOfIssue ?
                                            <>
                                                
                                                <td style={{ color: "green" }}>{element.createdAt ? element.createdAt.slice(0, 10) : ""}</td>
                                            </> :
                                            <>
                                                <td style={{ color: "red" }}>Not Accepted</td>
                                            </>
                                    }
                                    {
                                        element.dateOfReturn ?
                                            <td style={{ color: "green" }}>{`${element.dateOfReturn}`}</td> :
                                            <td style={{ color: "red" }}>Not Returned</td>
                                    }
                                    <td className="d-flex justify-content-around">
                                        {
                                            element.dateOfIssue ?
                                                <>
                                                    {
                                                        <button className="btn" style={{backgroundColor: "#C7DFC5", color:"black"}} disabled={element.dateOfReturn ? true : false} onClick={() => bookReturn(element._id)}>Return</button>
                                                    }

                                                </> :
                                                <>
                                                    {/* <button className="btn mx-2" style={{backgroundColor:"#EAE8FF", color:"black"}} onClick={() => checkDelete(element._id)}>Remove</button> */}
                                                    <button className="btn mx-2" style={{backgroundColor: "lightblue", color:"black"}} onClick={() => acceptRequest(element._id)}>Credit</button>
                                                </>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
            :
            <div className="m-auto" >
                <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                </div>
            </div>}
        </>
    )
}

export default myIssuedBooks