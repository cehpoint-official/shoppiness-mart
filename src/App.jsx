import React from 'react'
import Shoppinessmart from './Component/Shoppinessmart'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Cashback from './pages/Cashback'
import Shop from './pages/Shop'
import Work from './pages/Work'

const App = () => {
  return <>
    <BrowserRouter>
      <Shoppinessmart />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/work' element={<Work/>} />
        <Route path='/cashback' element={<Cashback />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
    



  </>
}

export default App