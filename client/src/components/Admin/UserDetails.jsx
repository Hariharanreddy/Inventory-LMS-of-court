import React from 'react'
import { NavLink, useParams } from 'react-router-dom';

const UserDetails = () => {

    const [getUserData, setUserData] = React.useState({});

    const { id } = useParams("");

    //For fetching the user details
    const getdata = async () => {

        const res = await fetch(`http://localhost:8000/getUser/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            console.log("Client side, data couldn't be fetched.");
        }
        else {
            setUserData(data)
            console.log("Client side, data fetched successfully.");
        }
    }

    React.useEffect(() => {
        getdata();
    }, [])

    return (
        <>
            <div className="card-div">
                <div className="add_btn mb-4">
                    <h2>User Details</h2>
                    <NavLink to="/UserList">
                        <button className="btn btn-primary home-btn">List</button>
                    </NavLink>
                </div>
                <table className="table" >
                    <thead>
                        <tr className='attribute-row'>
                            <th scope="col">Property</th>
                            <th scope="col">Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='record-row'>
                            <th scope="row">Name</th>
                            <td>{getUserData.name}</td>
                        </tr>
                        <tr className='record-row'>
                            <th scope="row">Email Address</th>
                            <td>{getUserData.email}</td>
                        </tr>
                        <tr className='record-row'>
                            <th scope="row">Department</th>
                            <td >{getUserData.department}</td>
                        </tr>
                        <tr className='record-row'>
                            <th scope="row">Department Id</th>
                            <td >{getUserData.departmentId}</td>
                        </tr>
                        <tr className='record-row'>
                            <th scope="row">Date Of Birth</th>
                            <td >{getUserData.dob}</td>
                        </tr>
                        <tr className='record-row'>
                            <th scope="row">Account Created</th>
                            <td >{getUserData.createdAt ? getUserData.createdAt.slice(0, 10) : ""}</td>
                        </tr>
                        {/* <tr className='record-row'>
                            <th scope="row">Name Of Requisition Court</th>
                            <td >{getUserData.requisitionCourtName}</td>
                        </tr> */}
                    </tbody>
                </table>
                {/* <div className='card-footer'>
          <NavLink to={`/ItemList/edit/${id}`} > <button className="btn btn-outline-primary mx-4">Edit</button></NavLink>
          <button className="btn btn-outline-danger" onClick={() => checkDelete(id)}>Delete</button>
        </div> */}
            </div>
        </>
    )
}

export default UserDetails