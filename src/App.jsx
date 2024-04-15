import React from 'react'
import Shoppinessmart from './Component/Shoppinessmart'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'

const App = () => {
  return <>
    <BrowserRouter>
      <Shoppinessmart />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>



  </>
}

export default App