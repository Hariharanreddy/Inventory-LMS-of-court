import React from 'react'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';

const Details = () => {
  return (
    <div className="container mt-3">
      <h1 style={{ fontWeight: 400 }}>Welcome Harsh Pathak</h1>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <div className="add_btn">
            <NavLink to={`/edit/${getuserdata._id}`}>  <button className="btn btn-primary mx-2"><CreateIcon /></button></NavLink>
            <button className="btn btn-danger" onClick={() => deleteuser(getuserdata._id)}><DeleteOutlineIcon /></button>
          </div>
          <div className="row">
            <div className="left_view col-lg-6 col-md-6 col-12">
              <img src="/profile.png" style={{ width: 50 }} alt="profile" />
              <h3 className="mt-3">Name: <span >{getuserdata.name}</span></h3>
              <h3 className="mt-3">Age: <span >{getuserdata.age}</span></h3>
              <p className="mt-3"><MailOutlineIcon />Email: <span>{getuserdata.email}</span></p>
              <p className="mt-3"><WorkIcon />Occuption: <span>{getuserdata.work}</span></p>
            </div>
            <div className="right_view  col-lg-6 col-md-6 col-12">

              <p className="mt-5"><PhoneAndroidIcon />mobile: <span>+91 {getuserdata.mobile}</span></p>
              <p className="mt-3"><LocationOnIcon />location: <span>{getuserdata.add}</span></p>
              <p className="mt-3">Description: <span>{getuserdata.desc}</span></p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default Details