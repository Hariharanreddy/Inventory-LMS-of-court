import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { LoginContext } from "../ContextProvider/Context"
import Swal from 'sweetalert2'

const UserIssuedBooks = () => {

    const [getRequestData, setRequestData] = React.useState([]);
    const { id } = useParams("");
    const { logindata, setLoginData } = useContext(LoginContext);
    const [data, setData] = React.useState(false);

    //for printing all the users from the database
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
            setRequestData(data)
            console.log("All Requests have been fetched properly.");
        }
    }


    React.useEffect(() => {
        if (logindata.ValidUserOne != undefined) {
            if (logindata.ValidUserOne.name) {
                setData(true);
                getdata();
            }
        }
    }, []);

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

    const checkDelete = (id) => {
        Swal.fire({
            title: 'Are You Sure?',
            text: "Issue Request will be removed permanently!",
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
        <>{data ? <div className="container list-section mt-4">
            <div className="add_btn mt-2 mb-4">
                <h2>Issued Books By User</h2>
            </div>
            <table className="table">
                <thead>
                    <tr className="attribute-row">
                        <th scope="col">S.No</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col">Date Of Issue</th>
                        {logindata.ValidUserOne.isAdmin ?
                            <th className="action-attribute" scope="col">Action</th> :
                            <th className="action-attribute" scope="col">Status</th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        getRequestData && getRequestData.filter((element) => {
                            if (element.userId == id) {
                                return element;
                            }
                        }).map((element, serialNum) => {
                            return (
                                <tr className="record-row" key={serialNum}>
                                    <th scope="row">{serialNum + 1}</th>
                                    <td>{element.bookName} </td>
                                    <td>{element.authorName}</td>
                                    <td>{element.createdAt ? element.createdAt.slice(0, 10) : ""}</td>
                                    {
                                        logindata.ValidUserOne.isAdmin ?
                                            <td className="d-flex justify-content-center">
                                                <button className="btn btn-outline-danger" onClick={() => checkDelete(element._id)}>Delete</button>
                                            </td>
                                            :
                                            <td className="d-flex justify-content-center">
                                                <td>{element.isIssued ? "Accepted" : "Not Accepted"}</td>
                                            </td>
                                    }
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

export default UserIssuedBooks