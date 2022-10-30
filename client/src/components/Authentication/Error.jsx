import React from 'react'
import error from "../../images/error.png"

const Error = () => {
  return (
    <>
    <div style={{ height:"100vh", display: "flex", justifyContent:"center", alignItems:"center" , width:"100%"}}>
    <img src={error} style={{maxWidth: "100%", maxHeight: "100%", objectPosition: "center"}}/>
    </div>
    </>
  )
}

export default Error