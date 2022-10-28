import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import Swal from 'sweetalert2'

const Details = () => {

  const [getBookData, setBookData] = React.useState({});

  const { id } = useParams("");

  //For fetching the book details
  const getdata = async () => {

    const res = await fetch(`http://localhost:8000/getBook/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 422 || !data) {
      console.log("client side, data couldn't be fetched.");
    }
    else {
      setBookData(data)
      console.log("client side, data fetched successfully.");
    }
  }

  React.useEffect(() => {
    getdata();
  }, [])


  return (
    <>
      <div className="card-div">
        <div className="add_btn mb-4">
          <h2>Book Details</h2>
          <NavLink to="/BookList">
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
              <th scope="row">Book</th>
              <td>{getBookData.bookName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Author</th>
              <td>{getBookData.authorName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Category</th>
              <td >{getBookData.category}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Stock Available</th>
              <td >{getBookData.stock}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Publisher</th>
              <td >{getBookData.publisherName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Vendor</th>
              <td >{getBookData.vendorName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Year Of Publication</th>
              <td >{getBookData.yearOfPublication}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Price</th>
              <td >{"Rs. " + getBookData.price}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Date Of Purchase</th>
              <td >{getBookData.dateOfPurchase}</td>
            </tr>
          </tbody>
        </table>
        {/* <div className='card-footer'>
          <NavLink to={`/BookList/edit/${id}`} > <button className="btn btn-outline-primary mx-4">Edit</button></NavLink>
          <button className="btn btn-outline-danger" onClick={() => checkDelete(id)}>Delete</button>
        </div> */}
      </div>
    </>
  )
}

export default Details