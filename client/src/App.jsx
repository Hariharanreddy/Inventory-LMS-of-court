import { useState, useEffect, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// import all the css and bootstrap used
import './App.css'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"


//import all booklist the components individually
import BookList from './components/BookList'
import RegisterBook from './components/RegisterBook'
import Edit from './components/Edit'
import Details from './components/Details'

//import sidebar
// import SideBar from "./components/Sidebar/SideBar"
import SideBarLayout from './components/Sidebar/SideBarLayout'

//import all itemlist the components individually
import ItemList from "./components/Stationary/ItemList"
import RegisterItem from "./components/Stationary/RegisterItem"
import ItemDetails from './components/Stationary/ItemDetails'
import EditItem from "./components/Stationary/EditItem"
import HomePage from "./components/HomePage"

//import authentication components
import Login from "./components/Authentication/Login"
import RegisterUser from './components/Authentication/RegisterUser'
import Error from "./components/Authentication/Error"
import LogOut from "./components/Authentication/LogOut"
import ForgotPassword from './components/Authentication/ForgotPassword'
import PasswordReset from './components/Authentication/PasswordReset'

//import admin specific components
import UserList from "./components/Admin/UserList"
import UserDetails from "./components/Admin/UserDetails"
import UserIssuedBooks from "./components/Admin/UserIssuedBooks"
import IssueRequests from "./components/Admin/IssueRequests"
import MyIssuedBooks from "./components/User/MyIssuedBooks"

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
        navigateTo("/login");
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
              <Route path="/BookList/view/:id" element={<Details />} />

              {/* Only Admin Routes */}
              <Route path="/UserList" element={<UserList />} />
              <Route path="/UserList/view/:id" element={<UserDetails />} />
              <Route path="/UserList/viewIssue/:id" element={<UserIssuedBooks />} />
              <Route path="/IssueRequests" element={<IssueRequests />} />   

              {/* User Personal Routes */}
              <Route path="/MyIssuedBooks" element={<MyIssuedBooks />} />   
              

              {/* Item Section Routes */}
              <Route path="/ItemList" element={<ItemList />} />
              <Route path="/ItemList/registerItem" element={<RegisterItem />} />
              <Route path="/ItemList/edit/:id" element={<EditItem />} />
              <Route path="/ItemList/view/:id" element={<ItemDetails />} />
              
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