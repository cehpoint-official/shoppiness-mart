import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Business from "./pages/Business/Business";
import Footer from "./Components/Footer";
import SupportACause from "./pages/SupportACause";
import SupportMaast from "./pages/SupportMaast";
import Cause from "./pages/Cause/Cause";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import Cashback from "./pages/Cashback";
import Shop from "./pages/Shop";
import Navbar from "./Components/Navbar/Navbar";
import CashbackDeals from "./pages/CashbackDeals/CashbackDeals";
import Form from "./Components/Form/Form";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register-business" element={<Business />} />
          <Route path="/register-cause" element={<Cause />} />
          <Route path="/support" element={<SupportACause />} />
          <Route path="/supportmaast" element={<SupportMaast />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/cashback-charity" element={<Cashback />} />
          <Route path="/cashback-deals" element={<CashbackDeals />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/form" element={<Form />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
