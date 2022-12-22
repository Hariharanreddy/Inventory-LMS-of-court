import React from 'react'
import SearchIcon from "../images/search-icon.png"
import { useParams } from 'react-router-dom';

const PurchaseList = () => {

    const [getBookData, setBookData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [data, setData] = React.useState(false);
    const { id } = useParams("");

    //For Printing all the purchases of the book from the database
    const getdata = async () => {

        const res = await fetch(`http://localhost:8000/getBook/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 422 || !data) {
            console.log("client side, data couldn't be fetched.");
        }
        else {
            setBookData(data)
            setData(true);
            console.log("client side, data fetched successfully.");
        }
    }

    React.useEffect(() => {
        getdata();
    }, []);

    return (
        <>
            {data ? <div className="container list-section mt-4">
                <div className="add_btn mt-2 mb-4">
                    <div>
                        <img src={SearchIcon} alt="" width="30px" height="30px" />
                        <input className="search-button" type="search" placeholder="Search..." aria-label="Search" onChange={(e) => { setSearchTerm(e.target.value); }} />
                    </div>
                </div><table className="table table-bordered text-center">
                    <thead>
                        <tr className="attribute-row">
                            <th scope="col">Vendor</th>
                            <th scope="col">Quantity Purchased</th>
                            <th scope="col">Date Of Purchase</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getBookData.purchase.length == 0 ?
                            <tr className="record-row">
                                <td colspan={8}> No Data Found </td>
                            </tr>
                            : getBookData.purchase.filter((element) => {
                                if (searchTerm === "") {
                                    return element;
                                }
                                else if (element.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || element.dateOfPurchase.includes(searchTerm)) {
                                    return element;
                                }
                            }).map((element, id) => {
                                return (
                                    <tr className="record-row" key={id}>
                                        <td>{element.vendorName}</td>
                                        <td>{element.quantityPurchased}</td>
                                        <td>{element.dateOfPurchase}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div> :
                <div className="m-auto" >
                    <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
                    </div>
                </div>}
        </>
    )
}

export default PurchaseList