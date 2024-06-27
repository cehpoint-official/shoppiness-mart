import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Business from "./pages/Business/Business";
import Footer from "./Components/Footer";
import Test from "./Components/Test";
import SupportACause from "./pages/SupportACause";
import SupportMaast from "./pages/SupportMaast";
import Cause from "./pages/Cause/Cause";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import Cashback from "./pages/Cashback";
import Shop from "./pages/Shop";
import Navbar from "./Components/Navbar/Navbar";
import CashbackDeals from "./pages/CashbackDeals/CashbackDeals";
import BusinessForm from "./pages/BusinessForm/BusinessForm";
import CauseForm from "./pages/CauseForm/CauseForm";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Blogs from "./pages/Blogs";
import UserDashboard from "./pages/UserDashboard/UserDashBoard"
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import OnlineShop from "./pages/OnlineShop";
import OfflineShop from "./pages/OfflineShop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
const App = () => {
  const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/contact",
          element: <ContactUs />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/about",
          element: <AboutUs />,
        },
        {
          path: "/blogs",
          element: <Blogs />,
        },
        {
          path: "/register-business",
          element: <Business />,
        },
        {
          path: "/register-cause",
          element: <Cause />,
        },
        {
          path: "/support",
          element: <SupportACause />,
        },
        {
          path: "/supportmaast",
          element: <SupportMaast />,
        },
        {
          path: "/howitworks",
          element: <HowItWorks />,
        },
        {
          path: "/cashback-charity",
          element: <Cashback />,
        },
        {
          path: "/cashback-deals",
          element: <CashbackDeals />,
        },
        {
          path: "/offline-shop",
          element: <OfflineShop />,
        },
        {
          path: "/online-shop",
          element: <OnlineShop />,
        },
        {
          path: "/shop",
          element: <Shop />,
        },
        {
          path: "/test",
          element: <Test />,
        },
        {
          path: "/user-dashboard/:userId",
          element: <UserDashboard />,
        },
      ],
    },
    { path: "/business-form", element: <BusinessForm /> },
    { path: "/cause-form", element: <CauseForm /> },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
