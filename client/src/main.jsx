import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import Context from "./components/ContextProvider/Context"

ReactDOM.createRoot(document.getElementById('root')).render(
  <Context>
    <Router>
      <App />
    </Router>
  </Context>
)
