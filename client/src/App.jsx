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
import AddOnItem from './components/Stationary/AddOnItem'
import ItemEdit from "./components/Stationary/ItemEdit"
import ItemIssueRequestForm from "./components/Stationary/ItemIssueRequestForm"
import MyIssuedItems from "./components/Stationary/MyIssuedItems"
import EditItemIssue from "./components/Stationary/EditItemIssue"

//import authentication components
import Login from "./components/Authentication/Login"
import RegisterUser from './components/Authentication/RegisterUser'
import Error from "./components/Authentication/Error"
import LogOut from "./components/Authentication/LogOut"

//import admin and user specific components
import UserList from "./components/Admin/UserList"
import UserEdit from "./components/Admin/UserEdit"
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

    const res = await fetch("/api/validuser", { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await res.json();

    console.log(data);

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
            <Route path="/login" element={<Login />} />
            <Route path="/registerUser" element={<RegisterUser />} />
            <Route path="/logout" element={<LogOut />} />

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
              <Route path="/UserList/edit/:id" element={<UserEdit />} />

              {/* All Users Requests -->>*/}

              {/* books */}
              <Route path="/IssueRequests" element={<MyIssuedBooks />} />
              <Route path="/IssueRequests/editIssue/:id" element={<EditIssue />} />   

              {/* items */}
              <Route path="/allIssuedItemsgi" element={<MyIssuedItems  type="gi"/>} />   
              <Route path="/allIssuedItemspf" element={<MyIssuedItems  type="pf"/>} />   
              <Route path="/allIssuedItemspc" element={<MyIssuedItems  type="pc"/>} />   
              <Route path="/allIssuedItemsss" element={<MyIssuedItems  type="ss"/>} />   
              
              <Route path="/allIssuedItemsgi/editIssue/:id" element={<EditItemIssue />} />  
              <Route path="/allIssuedItemspf/editIssue/:id" element={<EditItemIssue />} />  
              <Route path="/allIssuedItemspc/editIssue/:id" element={<EditItemIssue />} />  
              <Route path="/allIssuedItemsss/editIssue/:id" element={<EditItemIssue />} /> 


              {/* User Issue Routes  -->>*/}
              
              {/* books */}
              <Route path="/MyIssuedBooks" element={<MyIssuedBooks userId={logindata.ValidUserOne ? logindata.ValidUserOne._id : ""} name={logindata.ValidUserOne ? logindata.ValidUserOne.name : ""}/>} />   
              <Route path="/MyIssuedBooks/editIssue/:id" element={<EditIssue />} />  

              {/* items  */}
              <Route path="/myIssuedItemsgi" element={<MyIssuedItems userId={logindata.ValidUserOne ? logindata.ValidUserOne._id : ""} name={logindata.ValidUserOne ? logindata.ValidUserOne.name : ""} type="gi"/>} />   
              <Route path="/myIssuedItemspf" element={<MyIssuedItems userId={logindata.ValidUserOne ? logindata.ValidUserOne._id : ""} name={logindata.ValidUserOne ? logindata.ValidUserOne.name : ""} type="pf"/>} />   
              <Route path="/myIssuedItemspc" element={<MyIssuedItems userId={logindata.ValidUserOne ? logindata.ValidUserOne._id : ""} name={logindata.ValidUserOne ? logindata.ValidUserOne.name : ""} type="pc"/>} />   
              <Route path="/myIssuedItemsss" element={<MyIssuedItems userId={logindata.ValidUserOne ? logindata.ValidUserOne._id : ""} name={logindata.ValidUserOne ? logindata.ValidUserOne.name : ""} type="ss"/>} />   
              
              <Route path="/myIssuedItemsgi/editIssue/:id" element={<EditItemIssue />} />  
              <Route path="/myIssuedItemspf/editIssue/:id" element={<EditItemIssue />} />  
              <Route path="/myIssuedItemspc/editIssue/:id" element={<EditItemIssue />} />  
              <Route path="/myIssuedItemsss/editIssue/:id" element={<EditItemIssue />} />  
              
              {/* Item Section Routes */}
              {/* GENERAL ITEM */}
              <Route path="/ItemListgi" element={<ItemList type="gi" />} />
              <Route path="/ItemListgi/registerItem" element={<RegisterItem type="gi"/>} />
              <Route path="/ItemListgi/view/:id" element={<PurchaseList />} />
              <Route path="/ItemListgi/edit/:id" element={<ItemEdit />} />
              <Route path="/ItemListgi/addOn/:id" element={<AddOnItem />} />
              <Route path="/ItemListgi/ItemIssueRequestForm/:id" element={<ItemIssueRequestForm type="gi"/>} />

              {/* PRINTED FORMAT */}
              <Route path="/ItemListpf" element={<ItemList type="pf" />} />
              <Route path="/ItemListpf/registerItem" element={<RegisterItem type="pf"/>} />
              <Route path="/ItemListpf/view/:id" element={<PurchaseList />} />
              <Route path="/ItemListpf/edit/:id" element={<ItemEdit />} />
              <Route path="/ItemListpf/addOn/:id" element={<AddOnItem />} />
              <Route path="/ItemListpf/ItemIssueRequestForm/:id" element={<ItemIssueRequestForm type="pf"/>} />

              {/* PRINTER CATRIDGES */}
              <Route path="/ItemListpc" element={<ItemList type="pc" />} />
              <Route path="/ItemListpc/registerItem" element={<RegisterItem type="pc"/>} />
              <Route path="/ItemListpc/view/:id" element={<PurchaseList />} />
              <Route path="/ItemListpc/edit/:id" element={<ItemEdit />} />
              <Route path="/ItemListpc/addOn/:id" element={<AddOnItem />} />
              <Route path="/ItemListpc/ItemIssueRequestForm/:id" element={<ItemIssueRequestForm type="pc"/>} />

              {/* SEALS / STAMPS */}
              <Route path="/ItemListss" element={<ItemList type="ss" />} />
              <Route path="/ItemListss/registerItem" element={<RegisterItem type="ss"/>} />
              <Route path="/ItemListss/view/:id" element={<PurchaseList />} />
              <Route path="/ItemListss/edit/:id" element={<ItemEdit />} />
              <Route path="/ItemListss/addOn/:id" element={<AddOnItem />} />
              <Route path="/ItemListss/ItemIssueRequestForm/:id" element={<ItemIssueRequestForm type="ss"/>} />
              
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