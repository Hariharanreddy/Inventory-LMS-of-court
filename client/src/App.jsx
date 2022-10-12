import React from 'react'
import { Routes, Route } from 'react-router-dom';

// import all the css and bootstrap used
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"


//import all the components individually
import BookList from './components/BookList';
import RegisterBook from './components/RegisterBook';
import Edit from './components/Edit';
import Details from './components/Details';
import SideBar from "./components/Sidebar/SideBar";

const App = () => {
  return (
    <>
      <SideBar>
        <Routes>
          <Route path="/BookList" element={<BookList />} />
          <Route path="/BookList/registerBook" element={<RegisterBook />} />
          <Route path="/BookList/edit/:id" element={<Edit />} />
          <Route path="/BookList/view/:id" element={<Details />} />
          <Route path="*" element={<> not found</>} />
        </Routes>
      </SideBar>
    </>
  )
}

export default App