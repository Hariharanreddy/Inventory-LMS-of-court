import React, { useRef } from 'react'
import SearchIcon from "../../images/search-icon.png"
import { NavLink } from 'react-router-dom';
// import { LoginContext } from "./ContextProvider/Context"
import { CSVLink } from "react-csv"

const headers = [
    { label: "Item", key: "itemName" },
    { label: "Initial Stock", key: "initialStock" },
    { label: "Current Stock", key: "stock" },
    { label: "Price", key: "price" },
    { label: "Type", key: "itemType" }
]

const ItemList = (props) => {

    const [getItemData, setItemData] = React.useState([]);
    const [data, setData] = React.useState(false);
    const [disable, setDisable] = React.useState(false);
    // const { logindata, setLoginData } = useContext(LoginContext);

    //for filtering and pagination
    const [page, setPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortStock, setSortStock] = React.useState("");

    //for exporting to csv
    const [dataToDownload, setDataToDownload] = React.useState([]);
    const csvDownloadRef = useRef(0);

    const getdataToDownload = async () => {

        setDisable(true);

        const res = await fetch(`/api/getItemsToDownload?sortStock=${sortStock}&search=${searchTerm}&type=${props.type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.status === 422 || !data) {
            setDisable(false);
            console.log("Items could not be fetched.");
        }
        else {
            console.log(data);
            setDisable(false);
            setDataToDownload(data);
            setTimeout(() => {
                csvDownloadRef.current.link.click();
            }, 2000);
            console.log("All Items have been fetched properly.");
        }
    }

    // const Valid = async () => {
    //     let token = localStorage.getItem("usersdatatoken");

    //     const res = await fetch("http://localhost:8000/validuser", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": token
    //         }
    //     });

    //     const data = await res.json();

    //     if (data.status == 401 || !data) {
    //         navigateTo("/login");
    //     }
    //     else {
    //         setLoginData(data);
    //         navigateTo("/BookList");
    //     }
    // }

    React.useEffect(() => {

        setPage(1);
        setSearchTerm("");
        setSortStock(""); 

    }, [props.type]);

    React.useEffect(() => {
        let active = true;

        //for printing all the Items from the database
        const getdata = async () => {

            const res = await fetch(`/api/getItems?page=${page}&sortStock=${sortStock}&search=${searchTerm}&type=${props.type}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (res.status === 422 || !data) {
                console.log("Items could not be fetched.");
            }
            else {

                if (active) {
                    setItemData(data);
                    setData(true);
                }

                console.log("All Items have been fetched properly.");
            }
        }

        getdata();

        return () => {
            active = false;
        };
    }, [searchTerm, page, sortStock, props.type]);

    return (
        <>
            {data ?
                <div className="container list-section mt-4">

                    <div className="add_btn mt-2">

                        {props.type == "gi" && <h4>General List</h4>}
                        {props.type == "pf" && <h4>Printed Format</h4>}
                        {props.type == "pc" && <h4>Printer Catridges</h4>}
                        {props.type == "ss" && <h4>Stamps And Seals</h4>}

                        <h4 style={{ color: "grey", fontWeight: "500" }}> Results : {getItemData.total}</h4>

                    </div>

                    <div className='add_btn mb-2'>

                        <div>

                            <img src={SearchIcon} alt="" width="30px" height="30px" />
                            <input className="search-button" type="search" value={searchTerm} placeholder="Search Item" aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                            <input className="search-button mx-2" type="number" placeholder="Filter Stock" value={sortStock} aria-label="Search" onChange={(e) => { setSortStock(e.target.value); }} />

                        </div>

                        <div>

                            <CSVLink data={dataToDownload} headers={headers} filename="Stationery_data.csv" target="_blank" ref={csvDownloadRef} />
                            <button className='btn mx-2' onClick={getdataToDownload} disabled={disable}>Export To CSV</button>

                            <NavLink to="registerItem" className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }}><i className="fa-solid fa-plus"></i> Add Item</NavLink>

                        </div>

                    </div>
                    <table className="table table-bordered text-center" >
                        <thead>
                            <tr className="attribute-row">
                                <th scope="col">Item Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Initial Stock</th>
                                <th scope="col">Current Stock</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getItemData.total == 0 ?
                                <tr className="record-row">
                                    <td colSpan={8}> No Data Found </td>
                                </tr>
                                : getItemData.itemList.map((element, id) => {
                                    return (
                                        <tr className="record-row" key={id}>
                                            <td style={{wordBreak: "break-all"}}>{element.itemName}</td>
                                            <td>Rs. {element.price}</td>
                                            <td>{element.initialStock}</td>
                                            <td>{element.stock}</td>
                                            <td className="d-flex justify-content-around">
                                                <>
                                                    <NavLink to={`view/${element._id}`}><button className="btn" style={{ backgroundColor: "#D8D2E1", color: "black" }}>Vendor List</button></NavLink>
                                                    <NavLink to={`edit/${element._id}`}><button className="btn" style={{ backgroundColor: "#EAE8FF", color: "black" }}>Edit</button></NavLink>
                                                    <NavLink to={`addOn/${element._id}`}><button className="btn text-black">Add</button></NavLink>
                                                    <NavLink to={`ItemIssueRequestForm/${element._id}`}><button className="btn" style={{ backgroundColor: "lightblue", color: "black" }}>Issue</button></NavLink>
                                                </>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <button disabled={page <= 1 ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => { setPage(page - 1); }}>Prev Page</button>
                        <p className='mx-4 my-1' style={{ color: "grey", fontWeight: "bold" }}>  {page > Math.ceil(getItemData.total / 6) && Math.ceil(getItemData.total) != 0 ? setPage(1) : page} of {Math.ceil(getItemData.total / 6)}</p>
                        <button disabled={page >= Math.ceil(getItemData.total / 6) ? true : false} className="btn" style={{ backgroundColor: "rgb(6, 0, 97)", color: "white" }} onClick={() => setPage(page + 1)}>Next Page</button>
                    </div>
                </div>
                :
                <div className="m-auto" >
                    <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                    </div>
                </div>
            }
        </>
    )
}

export default ItemList