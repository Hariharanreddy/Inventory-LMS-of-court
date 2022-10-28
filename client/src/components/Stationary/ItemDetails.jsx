import React from 'react'
import { NavLink, useParams } from 'react-router-dom';

const ItemDetails = () => {

  const [getItemData, setItemData] = React.useState({});

  const { id } = useParams("");

  //For fetching the item details
  const getdata = async () => {

    const res = await fetch(`http://localhost:8000/getItem/${id}`, {
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
      setItemData(data)
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
          <h2>Item Details</h2>
          <NavLink to="/ItemList">
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
              <th scope="row">Item</th>
              <td>{getItemData.itemName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Quantity Received</th>
              <td>{getItemData.quantityReceived}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Stock</th>
              <td >{getItemData.stock}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Date Of Purchase</th>
              <td >{getItemData.dateOfPurchase}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Vendor</th>
              <td >{getItemData.vendorName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Name Of Requisition Court</th>
              <td >{getItemData.requisitionCourtName}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Date Of Requisition Receipt</th>
              <td >{getItemData.dateOfRequisitionReceipt}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Date Of Issuance Of Item</th>
              <td >{getItemData.dateOfItemIssuance}</td>
            </tr>
            <tr className='record-row'>
              <th scope="row">Last Remaining</th>
              <td >{getItemData.lastRemaining}</td>
            </tr>
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

export default ItemDetails