import React from 'react'
import {useParams} from "react-router-dom"
import UserForm from "./UserForm"

const Edit = () => {
    const { id } = useParams("");
    const [data, setData] = React.useState(null)

    React.useEffect(() => {

        const getdata = async () => {

            const res = await fetch(`http://localhost:8000/getBook/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            const data2 = await res.json();
    
            if (res.status === 422 || !data2) {
                console.log("Client side :Form Data could not be fetched.");
            }
            else {
                setData(data2);
                console.log("Client side :Form Data has been fetched successfully.");
            }
        }
        getdata();
    }, [])

    return (data ? <UserForm preLoadedValues={data} id={id} /> : <div>Loading...</div>)
}

export default Edit;