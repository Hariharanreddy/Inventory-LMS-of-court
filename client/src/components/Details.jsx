import React from 'react'
import { NavLink ,useNavigate ,useParams } from 'react-router-dom';

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
      console.log("Error");
    }
    else {
      setBookData(data)
      console.log("getData() successfully executed");
    }
  }

  React.useEffect(() => {
    getdata();
  }, [])


  //For Deleting the Book
  const navigateTo = useNavigate();
  const deleteBook = async (id) => {

    const res2 = await fetch(`http://localhost:8000/deleteBook/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const deleteData = await res2.json();
    console.log(deleteData);

    if (res2.status === 422) {
        console.log("Record could not be deleted.");
    }
    else {
        alert("Record has been deleted.");
        getdata();
        navigateTo("/");
    }
}


  return (
    <>
      <div className="card-div">
        <div className="add_btn mb-4">
          <h2>Book Details</h2>
        </div>
        <table className="table table-hover table-condensed" >
          <thead>
            <tr className='attribute-row'>
              <th scope="col">Property</th>
              <th scope="col">Content</th>
            </tr>
          </thead>
          <tbody>
            <tr className='record-row'>
              <th scope="row">Book Name</th>
              <td>{getBookData.bookName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Author Name</th>
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
              <th scope="row">Publisher Name</th>
              <td >{getBookData.publisherName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Vendor Name</th>
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
        <div className='card-footer'>
            <NavLink to={`/edit/${id}`} > <button className="btn btn-outline-primary mx-4">Edit</button></NavLink>
            <button className="btn btn-outline-danger" onClick={() => deleteBook(id)}>Delete</button>
        </div>
      </div>
    </>
  )
}

export default Details