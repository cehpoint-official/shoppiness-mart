import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Business from "./pages/Business/Business";
import Footer from "./Components/Footer";
import Test from "./Components/Test";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
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
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import UserDashboard from "./pages/UserDashboard/UserDashBoard";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import OnlineShop from "./pages/OnlineShop";
import OfflineShop from "./pages/OfflineShop";
import NewLayout from "./NewLayout";
import UserProfile from "./pages/UserProfile/UserProfile";
import FaqHome from "./Admin/pages/FAQ/home";
import AddFaq from "./Admin/pages/FAQ/AddFaq";
// import PrivacyPolicyHome from "./Admin/pages/PrivacyPolicy/PrivacyPolicy";
import AddPrivacyPolicy from "./Admin/pages/PrivacyPolicy/AddPrivacyPolicy";
import Newsletter from "./Admin/pages/Newsletter/Newsletter";
import ContactMessage from "./Admin/pages/Contact/ContactMessage";
import ContactInfo from "./Admin/pages/Contact/ContactInfo";
import DashboardOutlet from "./Services-Dashboard/pages/DashboardOutlet/DashboardOutlet";
import Products from "./Services-Dashboard/pages/Products/Products";
import Customers from "./Services-Dashboard/pages/Customers/Customers";
import Dashboard from "./Services-Dashboard/pages/Dashboard/Dashboard";
import ProtectedRoute from "./pages/RouteProtect/ProtectedRoute";
import { Navigate } from "react-router-dom";
import PublicRoute from "./pages/RouteProtect/PublicRoute";

const App = () => {
  const Layout = () => {
    return (
      <div className="app">
        <ScrollToTop />
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PublicRoute>
          <Layout />
        </PublicRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <Login />
            </PublicRoute>
          )
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicyPage />
        },
        {
          path: "/signup",
          element: (
            <PublicRoute>
              <Signup />
            </PublicRoute>
          )
        },
        {
          path: "/contact",
          element: <ContactUs />
        },

        {
          path: "/about",
          element: <AboutUs />
        },
        {
          path: "/blogs",
          element: <Blogs />
        },
        {
          path: "/register-business",
          element: <Business />
        },
        {
          path: "/register-cause",
          element: <Cause />
        },
        {
          path: "/support",
          element: <SupportACause />
        },
        {
          path: "/supportmaast",
          element: <SupportMaast />
        },
        {
          path: "/howitworks",
          element: <HowItWorks />
        },
        {
          path: "/cashback-charity",
          element: <Cashback />
        },
        {
          path: "/cashback-deals",
          element: <CashbackDeals />
        },
        {
          path: "/offline-shop",
          element: <OfflineShop />
        },
        {
          path: "/online-shop",
          element: <OnlineShop />
        },
        {
          path: "/shop",
          element: <Shop />
        },
        {
          path: "/test",
          element: <Test />
        }
      ]
    },
    { path: "/business-form", element: <BusinessForm /> },
    { path: "/cause-form", element: <CauseForm /> },
    {
      path: "/user-dashboard/:userId",
      element: (
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: "/user-dashboard/:userId",
      element: <NewLayout />,
      children: [
        {
          path: "/user-dashboard/:userId/online-shop",
          element: <OnlineShop />
        },
        {
          path: "/user-dashboard/:userId/offline-shop",
          element: <OfflineShop />
        },
        {
          path: "/user-dashboard/:userId/howitworks",
          element: <HowItWorks />
        },
        {
          path: "/user-dashboard/:userId/cashback-charity",
          element: <Cashback />
        },
        {
          path: "/user-dashboard/:userId/supportmaast",
          element: <SupportMaast />
        },
        {
          path: "/user-dashboard/:userId/profile",
          element: <UserProfile />
        }
      ]
    },
    // ADMIN
    { path: "/admin/shoppiness/faq", element: <FaqHome /> },
    { path: "/admin/shoppiness/addfaq", element: <AddFaq /> },
    // {
    //   path: "/admin/shoppiness/privacy-policy",
    //   element: <PrivacyPolicyHome />,
    // },
    {
      path: "/admin/shoppiness/add/privacy-policy",
      element: <AddPrivacyPolicy />
    },
    {
      path: "/admin/shoppiness/newsletter",
      element: <Newsletter />
    },
    {
      path: "/admin/shoppiness/contact",
      element: <ContactInfo />
    },
    {
      path: "/admin/shoppiness/contact/message",
      element: <ContactMessage />
    },

    //Services Dashboard

    {
      path: "/services-dashboard/:id",
      element: <DashboardOutlet />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />
        },
        {
          path: "products",
          element: <Products />
        },
        {
          path: "customers",
          element: <Customers />
        }
        // {
        //   path: "pos",
        //   element: <POS />,
        // },
      ]
    },
    {
      path: "*",
      element: (
        <ProtectedRoute>
          <Navigate to="/" />
        </ProtectedRoute>
      )
    }
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
