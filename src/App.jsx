import React from "react";
import Navbar from "./Component/Navbar";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Business from "./pages/Business/Business";
import Footer from "./Component/Footer";
import SupportACause from "./pages/SupportACause";

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
          <Route path="/support" element={<SupportACause />} />
        </Routes> 
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
