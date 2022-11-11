import React from 'react'
import Swal from 'sweetalert2'

const IssueRequests = () => {

    const [getRequestData, setRequestData] = React.useState([]);

    //For Printing All the issue requests from the database
    const getdata = async () => {
        
        const res = await fetch("http://localhost:8000/showIssuedBooksRequest", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });  

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            console.log("Requests could not be fetched.");
        }
        else {
            console.log("All Requests have been fetched properly.");
            setRequestData(data)
        }
    }

    React.useEffect(() => {
        getdata();
    }, [])


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
            text: "User will be removed permanently!",
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

    return (
            <div className="container list-section mt-4">
                <div className="add_btn mt-2 mb-4">
                    <h2>Book Issue Requests</h2>
                </div>
                <table className="table">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">Book Name</th>
                            <th scope="col">Author</th>
                            <th scope="col">Stock</th>
                            <th scope="col">User Name</th>
                            <th scope="col">Department</th>
                            <th className="action-attribute" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getRequestData && getRequestData.filter((element) => {
                                if(element.isIssued == false){
                                    return element;
                                }
                            }).map((element, id) => {
                                return (
                                    <tr className="record-row" key={id}>
                                        <td>{element.bookName} </td>
                                        <td>{element.authorName}</td>
                                        <td>{element.stock}</td>
                                        <td>{element.userName}</td>
                                        <td>{element.userDepartment}</td>
                                        <td className="d-flex justify-content-around">
                                            <button className="btn btn-outline-success" onClick={() => acceptRequest(element._id)}>Accept</button>
                                            <button className="btn btn-outline-danger" onClick={() => checkDelete(element._id)}>Reject</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
    )
}

export default IssueRequests