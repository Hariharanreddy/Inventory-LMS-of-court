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
import SideBar from "./components/Sidebar/SideBar"

//import all itemlist the components individually
import ItemList from "./components/Stationary/ItemList"
import RegisterItem from "./components/Stationary/RegisterItem"
import ItemDetails from './components/Stationary/ItemDetails'
import EditItem from "./components/Stationary/EditItem"



const App = () => {
  return (
    <>
      <SideBar>
        <Routes>
          <Route path="/BookList" element={<BookList />} />
          <Route path="/BookList/registerBook" element={<RegisterBook />} />
          <Route path="/BookList/edit/:id" element={<Edit />} />
          <Route path="/BookList/view/:id" element={<Details />} />

          <Route path="/ItemList" element={<ItemList />} />
          <Route path="/ItemList/registerItem" element={<RegisterItem />} />
          <Route path="/ItemList/edit/:id" element={<EditItem />} />
          <Route path="/ItemList/view/:id" element={<ItemDetails />} />
          <Route path="*" element={<> not found</>} />
        </Routes>
      </SideBar>
    </>
  )
}

export default App