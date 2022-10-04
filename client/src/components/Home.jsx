import React from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { NavLink } from 'react-router-dom';

const Home = () => {

    const [getBookData, setBookData] = React.useState([]);
    console.log(getBookData);

    //for printing all the books from the database
    const getdata = async () => {

        const res = await fetch("http://localhost:8000/getBooks", {
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

    //to run the getdata function everytime the page refreshes
    React.useEffect(() => {
        getdata();
    }, [])

    return (
        <div className="mt-5">
            <div className="container">
                <div className="add_btn mt-2 mb-2">
                    <NavLink to="/registerBook" className="  btn btn-primary"><i className="fa-solid fa-plus"></i> Add New Book</NavLink>
                </div>
                <table className="table">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">S.No</th>
                            <th scope="col">Book Name</th>
                            <th className="author-attribute" scope="col">Author Name</th>
                            <th scope="col">Category</th>
                            <th className="stock-attribute" scope="col">Stock</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getBookData.map((element, id) => {
                                return (
                                    <tr className="record-row">
                                        <th scope="row">{id + 1}</th>
                                        <td>{element.bookName} </td>
                                        <td>{element.authorName}</td>
                                        <td>{element.category}</td>
                                        <td>{element.stock}</td>
                                        <td className="d-flex justify-content-between">
                                            <NavLink /*to={`view/${element._id}`}*/> <button className="btn btn-success"><RemoveRedEyeIcon /></button></NavLink>
                                            <NavLink /*to={`edit/${element._id}`}*/>  <button className="btn btn-primary"><CreateIcon /></button></NavLink>
                                            <button className="btn btn-danger" /*onClick={() => deleteuser(element._id)}*/><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default Home