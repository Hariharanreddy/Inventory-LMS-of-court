import { useState, useEffect, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// import all the css and bootstrap used
import './App.css'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"


//import all booklist the components individually
import BookList from './components/BookList'
import RegisterBook from './components/RegisterBook'
import AddOnBook from "./components/AddOnBook"
import Edit from './components/Edit'
import Details from './components/Details'
import PurchaseList from "./components/PurchaseList"
import BookIssueRequest from "./components/User/BookIssueRequestForm"

//import sidebar
// import SideBar from "./components/Sidebar/SideBar"
import SideBarLayout from './components/Sidebar/SideBarLayout'

//import all itemlist the components individually
import ItemList from "./components/Stationary/ItemList"
import RegisterItem from "./components/Stationary/RegisterItem"
// import ItemDetails from './components/Stationary/ItemDetails'
import ItemEdit from "./components/Stationary/ItemEdit"
import HomePage from "./components/HomePage"

//import authentication components
import Login from "./components/Authentication/Login"
import RegisterUser from './components/Authentication/RegisterUser'
import Error from "./components/Authentication/Error"
import LogOut from "./components/Authentication/LogOut"
import ForgotPassword from './components/Authentication/ForgotPassword'
import PasswordReset from './components/Authentication/PasswordReset'

//import admin and user specific components
import UserList from "./components/Admin/UserList"
import UserDetails from "./components/Admin/UserDetails"
import MyIssuedBooks from "./components/User/MyIssuedBooks"
import EditIssue from './components/User/EditIssue'

//import login context
import { LoginContext } from "./components/ContextProvider/Context"

const App = () => {
  const [data, setData] = useState(false);
  const { logindata, setLoginData } = useContext(LoginContext);
  const navigateTo = useNavigate();

  const Valid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("http://localhost:8000/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      console.log("User not valid");

      if(window.location.href.slice(0, 36) == "http://localhost:5173/forgotPassword")
      { }
      else{
        navigateTo("/");
      }
    } else {
      console.log("User verified");
      setLoginData(data);
      navigateTo("/booklist");
    }
  }

  useEffect(() => {
    setTimeout(() => {
      Valid().then(() => {
        setData(true)
      })
    }, 2000)
  }, [])

  return (
    <>
      {
        data ? (
          <Routes>
            <Route path="/" element={<HomePage/>}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/registerUser" element={<RegisterUser />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/passwordReset" element={<PasswordReset />} />
            <Route path="/forgotPassword/:id/:token/:non" element={<ForgotPassword />} />

            <Route element={<SideBarLayout />}>
              {/* Book Section Routes */}
              <Route path="/BookList" element={<BookList />} />
              <Route path="/BookList/registerBook" element={<RegisterBook />} />
              <Route path="/BookList/edit/:id" element={<Edit />} />
              <Route path="/BookList/addOn/:id" element={<AddOnBook />} />
              <Route path="/BookList/view/:id" element={<Details />} />
              <Route path="/BookList/bookIssueRequestForm/:id" element={<BookIssueRequest />} />
              <Route path="/BookList/view/:id/purchaseList/:newId" element={<PurchaseList/>}></Route>

              {/* Only Admin Routes */}
              <Route path="/UserList" element={<UserList />} />
              <Route path="/UserList/view/:id" element={<UserDetails />} />
              <Route path="/IssueRequests" element={<MyIssuedBooks />} />
              <Route path="/IssueRequests/editIssue/:id" element={<EditIssue />} />   

              {/* User Personal Routes */}
              <Route path="/MyIssuedBooks" element={<MyIssuedBooks userId={logindata.ValidUserOne ? logindata.ValidUserOne._id : ""} name={logindata.ValidUserOne ? logindata.ValidUserOne.name : ""}/>} />   
              <Route path="/MyIssuedBooks/editIssue/:id" element={<EditIssue />} />   
              
              {/* Item Section Routes */}
              {/* GENERAL ITEM */}
              <Route path="/ItemListGi" element={<ItemList type="gi" />} />
              <Route path="/ItemListGi/registerItem" element={<RegisterItem type="gi"/>} />
              <Route path="/ItemListGi/view/:newId" element={<PurchaseList />} />
              <Route path="/ItemListGi/edit/:id" element={<ItemEdit />} />

              {/* PRINTED FORMAT */}
              <Route path="/ItemListPf" element={<ItemList type="pf" />} />
              <Route path="/ItemListPf/registerItem" element={<RegisterItem type="pf"/>} />
              <Route path="/ItemListPf/view/:newId" element={<PurchaseList />} />
              <Route path="/ItemListPf/edit/:id" element={<ItemEdit />} />

              {/* PRINTER CATRIDGES */}
              <Route path="/ItemListPc" element={<ItemList type="pc" />} />
              <Route path="/ItemListPc/registerItem" element={<RegisterItem type="pc"/>} />
              <Route path="/ItemListPc/view/:newId" element={<PurchaseList />} />
              <Route path="/ItemListPc/edit/:id" element={<ItemEdit />} />

              {/* SEALS / STAMPS */}
              <Route path="/ItemListSs" element={<ItemList type="ss" />} />
              <Route path="/ItemListSs/registerItem" element={<RegisterItem type="ss"/>} />
              <Route path="/ItemListSs/view/:newId" element={<PurchaseList />} />
              <Route path="/ItemListSs/edit/:id" element={<ItemEdit />} />
              
              
              <Route path="*" element={<Error />} />
            </Route>

            <Route path="*" element={<Error />} />
          </Routes>)
          : 
          <div className="m-auto" >
            <div className="spinner-border" style={{ height: "4rem", width: "4rem", color: "rgb(6, 0, 97)" }} role="status">
            </div>
          </div>
      }
    </>
  )
} 

export default App