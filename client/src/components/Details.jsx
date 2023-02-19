import React from 'react'
import { NavLink, useParams } from 'react-router-dom';

const Details = () => {

  const [getBookData, setBookData] = React.useState({});
  
  const { id } = useParams("");

  //For fetching the book details
  const getdata = async () => {

    const res = await fetch(`/api/getBook/${id}`, {
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
          <button className="btn mx-2" style={{backgroundColor: "rgb(6, 0, 97)", color:"white" }}> &lt; Back</button>
          </NavLink>
        </div>
        <table className="table table-bordered" >
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
              <th scope="row">Price</th>
              <td >{"Rs. " + getBookData.price}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Publisher</th>
              <td >{getBookData.publisherName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Year Of Publication</th>
              <td >{getBookData.yearOfPublication}</td>
            </tr>
          </tbody>
        </table>
        <div className='card-footer'>
        <NavLink to={`purchaseList/${id}`}><button className="btn" style={{backgroundColor: "rgb(6, 0, 97)", color:"white" }}>Vendor List</button></NavLink>
        </div>
      </div>
    </>
  )
}

export default Details