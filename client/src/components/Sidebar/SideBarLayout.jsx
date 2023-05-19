import { Outlet } from 'react-router-dom';
import SideBar from "./SideBar"
// import { Route } from "react-router-dom"

//import all booklist the components individually
// import BookList from "../BookList"
// import RegisterBook from "../RegisterBook"
// import Edit from '../Edit'
// import Details from '../Details'

//import all itemlist the components individually
// import ItemList from "../Stationary/ItemList"
// import RegisterItem from "../Stationary/RegisterItem"
// import ItemDetails from '../Stationary/ItemDetails'
// import EditItem from "../Stationary/EditItem"

const SideBarLayout = () => (
    <>
        <SideBar />
        <Outlet />  
    </>
);

export default SideBarLayout;