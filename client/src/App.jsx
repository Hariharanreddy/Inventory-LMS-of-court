import React from 'react'
import {Routes, Route} from 'react-router-dom';

// import all the css and bootstrap used
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
// import Navbar from './components/Navbar';

//import all the components individually
import Home from './components/Home';
import RegisterBook from './components/RegisterBook';
import Edit from './components/Edit';
import Details from './components/Details';
import Navbar from './components/Navbar';


const App = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registerBook" element={<RegisterBook />}/>  
        <Route path="/edit/:id" element={<Edit />}/>
        <Route path="/view/:id" element={<Details />}/>
      </Routes>
    </>
  )
}

export default App