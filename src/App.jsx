import React from 'react'
import Navbar from "./Component/Navbar"
import Footer from "./Component/Footer";
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'

import Business from './pages/Business/Business'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/business" element={<Business />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
};


export default App;
