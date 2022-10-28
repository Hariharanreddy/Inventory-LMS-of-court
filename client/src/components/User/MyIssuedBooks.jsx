import {useState, useEffect, useContext } from 'react'
import { LoginContext } from "../ContextProvider/Context"

const myIssuedBooks = () => {

    const [getRequestData, setRequestData] = useState([]);
    const { logindata, setLoginData } = useContext(LoginContext);
    const [data, setData] = useState(false);

    //For printing all the users from the database
    const getdata = async () => {

        const res = await fetch("http://localhost:8000/showIssuedBooksRequest", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.status === 422 || !data) {
            console.log("Requests could not be fetched.");
        }
        else {
            setRequestData(data);
            console.log("All Requests have been fetched properly.");
        }
    }

    useEffect(() => {
        if (logindata.ValidUserOne != undefined) {
            if (logindata.ValidUserOne.name) {
                setData(true);
                getdata();
            }
        }
    }, []);

    return (
        <>{data ? <div className="container list-section mt-4">
            <div className="add_btn mt-2 mb-4">
                <h2>Issued Books By User</h2>
            </div>
            <table className="table">
                <thead>
                    <tr className="attribute-row">
                        <th scope="col">S.No</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col">Date Of Issue</th>
                        <th className="action-attribute" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        getRequestData && getRequestData.filter((element) => {
                            if (element.userId == logindata.ValidUserOne._id) {
                                return element;
                            }
                        }).map((element, serialNum) => {
                            return (
                                <tr className="record-row" key={serialNum}>
                                    <th scope="row">{serialNum + 1}</th>
                                    <td>{element.bookName} </td>
                                    <td>{element.authorName}</td>
                                    <td>{element.createdAt ? element.createdAt.slice(0, 10) : ""}</td>
                                    {
                                        <td className="d-flex justify-content-center">
                                            {element.isIssued ? "Accepted" : "Not Accepted"}
                                        </td>
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
            :
            <div className="m-auto" >
                <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                </div>
            </div>}
        </>
    )
}

export default myIssuedBooks