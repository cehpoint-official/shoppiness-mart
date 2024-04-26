import React from 'react'
import Shoppinessmart from './Component/Shoppinessmart'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Business from './pages/Business/Business'
import Cause from "./pages/Cause/Cause";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Shoppinessmart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/business" element={<Business />} />
          <Route path="/cause" element={<Cause />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App