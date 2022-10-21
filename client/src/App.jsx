import React from 'react'
import { Routes, Route } from 'react-router-dom'

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

//import authentication components
import Login from "./components/Authentication/Login"
import RegisterUser from './components/Authentication/RegisterUser'
import Dash from "./components/Authentication/Dash"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/dash" element={<Dash />} />

        <Route element={<SideBarLayout />}>
          {/* Book Section Routes */}
          <Route path="/BookList" element={<BookList />} />
          <Route path="/BookList/registerBook" element={<RegisterBook />} />
          <Route path="/BookList/edit/:id" element={<Edit />} />
          <Route path="/BookList/view/:id" element={<Details />} />

          {/* Item Section Routes */}
          <Route path="/ItemList" element={<ItemList />} />
          <Route path="/ItemList/registerItem" element={<RegisterItem />} />
          <Route path="/ItemList/edit/:id" element={<EditItem />} />
          <Route path="/ItemList/view/:id" element={<ItemDetails />} />
          <Route path="*" element={<div style={{textAlign: "center"}}>PAGE NOT FOUND</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App