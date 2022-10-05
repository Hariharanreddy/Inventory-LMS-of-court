import React from 'react'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { NavLink } from 'react-router-dom';
import { useParams } from "react-router-dom";

const Details = () => {

  const [getBookData, setBookData] = React.useState({});

  const { id } = useParams("");
  console.log(id);

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


  return (
    <>
      <div className="view-div">
        <div className="add_btn mb-4">
          <h1>Book Details</h1>
          <div>
            <NavLink /*</div>to={`/edit/${getuserdata._id}`}*/ > <button className="btn btn-primary mx-4"><CreateIcon /></button></NavLink>
            <button className="btn btn-danger" onClick={() => deleteuser(getBookdata._id)}><DeleteIcon /></button>
          </div>
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
              <td >{"Rs " + getBookData.price}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Date Of Purchase</th>
              <td >{getBookData.dateOfPurchase}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Details