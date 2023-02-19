import { useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../ContextProvider/Context"

const LogOut = () => {

    const { logindata, setLoginData } = useContext(LoginContext);
    const navigateTo = useNavigate();

    const Valid = async () => {

        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch("/api/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                Accept:"application/json"
            }
        });

        const data = await res.json();

        if (data.status == 201) {
            console.log("user logged out")
            localStorage.removeItem("usersdatatoken");
            setLoginData(false);
            navigateTo("/login"); 
        }
        else {
            navigateTo("*");
        }
    }

    useEffect(() => {
        // let x = 100;
        // const interval = setInterval(() => {

        //     // console.log(++x);
        // }, 1000);
        // return () => clearInterval(interval);
        Valid();
    }, []);


  return (
    <></>
  )
}

export default LogOut