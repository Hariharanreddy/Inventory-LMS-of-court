import { NavLink } from "react-router-dom"
import label from "../images/label.png"


const HomePage = () => {
    
    return (
        <>
            <div className="flexArea">
                <div style={{minHeight:"100vh", width:"50%", display:"flex", flexDirection:"column"}}>
                    <img src={label} style={{width:"60px", marginTop:"20px", marginLeft:"20px"}}/>
                    <div className="landingPageTitle">
                        <h1 style={{color:"#91b3fa", fontWeight:"800",fontSize:"60px", letterSpacing:"2px"}}>Library</h1>
                        <h1 style={{color:"rgb(6, 0, 97)", fontWeight:"800",fontSize:"60px", letterSpacing:"2px"}}>Management</h1>
                        <h1 style={{color:"#91b3fa", fontWeight:"800",fontSize:"60px", letterSpacing:"2px"}}>System</h1>
                        <marquee width="100%" direction="left" height="50px">
                        <h3 style={{color:"grey",opacity:"0.4", fontWeight:"700",fontSize:"40px", letterSpacing:"1px"}}>Durg District Court</h3>
                        </marquee>
                    </div>
                    <button className="btn-effect" style={{alignSelf:"right"}}><NavLink to="/login"><span style={{color:"#060061"}}>Click Here</span></NavLink></button>
                </div>
                <div className="landingPageImageArea"></div>
            </div>
        </>
    )
}

export default HomePage