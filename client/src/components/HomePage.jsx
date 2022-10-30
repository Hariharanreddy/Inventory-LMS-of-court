import { NavLink } from "react-router-dom"
import label from "../images/label.png"


const HomePage = () => {
    return (
        <>
            <div className="bg-img" style={{ height: "100vh", width: "100%" }}></div>
            <div className="heading">
                <marquee width="100%" direction="right" height="100px">
                    <h1>Library Management System District <span style={{ color: "blue " }}>Court</span>, Durg</h1>
                </marquee>
            </div>
            <div className="fourlions">
                <img src={label} />
            </div>
            <div className="buttons">
                <h1>Login As :</h1>
                <NavLink className="btn btn-primary"> Admin</NavLink>
                <NavLink className="btn btn-primary"> User</NavLink>
            </div>
        </>
    )
}

export default HomePage