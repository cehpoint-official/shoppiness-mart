import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Loader from "./Components/Loader/Loader";
import NewLayout from "./NewLayout";
import BusinessDetails from "./pages/BusinessDetails";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./Components/ProtectedRoute"; // Adjust the path as needed
import AdminDashboard from "./Admin/pages/AdminDashboard/AdminDashboard";
import AdminDashboardOutlet from "./Admin/pages/AdminDashboardOutlet/AdminDashboardOutlet";
import Coupons from "./Admin/pages/Users/Coupons/Coupons";
import Givebacks from "./Admin/pages/Users/Give Backs/Givebacks";

import CashbackStatus from "./Admin/pages/Users/Cashback Status/CashbackStatus";
import CashbackRequests from "./Admin/pages/Users/Cashback Requests/CashbackRequests";
import GiveBackRecord from "./Admin/pages/Ngo/GiveBackRecord/GiveBackRecord";
import AllNgos from "./Admin/pages/Ngo/AllNgos/AllNgos";
import NgoRequest from "./Admin/pages/Ngo/NgoRequest/NgoRequest";
import EditPage from "./Admin/pages/Maast/EditPage/EditPage";
import AllDonations from "./Admin/pages/Maast/ViewDonations/AllDonations";
import Events from "./Admin/pages/Maast/NewEvents/Events";
import OfflineShopRequests from "./Admin/pages/Product&Services/OfflineShopRequests/OfflineShopRequests";
import OnlineShopRequests from "./Admin/pages/Product&Services/OnlineShopRequests/OnlineShopRequests";
import AllOfflineShops from "./Admin/pages/Product&Services/AllOfflineShops/AllOfflineShops";
import AllOnlineShops from "./Admin/pages/Product&Services/AllOnlineShops/AllOnlineShops";
import AddCategories from "./Admin/pages/Product&Services/AddCategories/AddCategories";
import WithdrawalRequests from "./Admin/pages/Users/Withdrawal Requests/WithdrawalRequests";
import WebsiteEditPages from "./Admin/pages/Shoppinessmart/WebsiteEditPages/WebsiteEditPages";
import ContactInfo from "./Admin/pages/Shoppinessmart/Contact/ContactInfo";
import AllFaqs from "./Admin/pages/Shoppinessmart/FAQ/AllFaqs";
import PrivacyPolicy from "./Admin/pages/Shoppinessmart/PrivacyPolicy/PrivacyPolicy";
import Newsletter from "./Admin/pages/Shoppinessmart/Newsletter/Newsletter";
import MainBlog from "./Admin/pages/Shoppinessmart/MainBlogs/MainBlog";
import MainSocialmedia from "./Admin/pages/Shoppinessmart/MainSocialmedia/MainSocialmedia";
// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Business = lazy(() => import("./pages/Business/Business"));
const SupportACause = lazy(() => import("./pages/SupportACause"));
const SupportMaast = lazy(() => import("./pages/SupportMaast"));
const Cause = lazy(() => import("./pages/Cause/Cause"));
const HowItWorks = lazy(() => import("./pages/HowItWorks/HowItWorks"));
const Cashback = lazy(() => import("./pages/Cashback"));
const Shop = lazy(() => import("./pages/Shop"));
const CashbackDeals = lazy(() => import("./pages/CashbackDeals/CashbackDeals"));
const BusinessForm = lazy(() => import("./pages/BusinessForm/BusinessForm"));
const CauseForm = lazy(() => import("./pages/CauseForm/CauseForm"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Blogs = lazy(() => import("./pages/Blogs"));
const UserDashboard = lazy(() => import("./pages/UserDashboard/UserDashBoard"));
const OnlineShop = lazy(() => import("./pages/OnlineShop"));
const OfflineShop = lazy(() => import("./pages/OfflineShop"));
const CatagoryBasedShops = lazy(() => import("./pages/CatagoryBasedShops"));
const UserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));

const DashboardOutlet = lazy(() =>
  import("./Services-Dashboard/pages/DashboardOutlet/DashboardOutlet")
);
const NgoDashboardOutlet = lazy(() =>
  import("./NGO-Dashboard/pages/NgoDashboardOutlet/NgoDashboardOutlet")
);
const Products = lazy(() =>
  import("./Services-Dashboard/pages/Products/Products")
);
const Customers = lazy(() =>
  import("./Services-Dashboard/pages/Customers/Customers")
);
const Dashboard = lazy(() =>
  import("./Services-Dashboard/pages/Dashboard/Dashboard")
);
const ShopInfo = lazy(() =>
  import("./Services-Dashboard/pages/ShopInfo/ShopInfo")
);
const NgoDetails = lazy(() =>
  import("./NGO-Dashboard/pages/NgoDetails/NgoDetails")
);
const NgoDashboard = lazy(() =>
  import("./NGO-Dashboard/pages/Dashboard/Dashboard")
);
const MainPos = lazy(() => import("./Services-Dashboard/pages/POS/MainPos"));
const Invoice = lazy(() =>
  import("./Services-Dashboard/pages/Invoices/Invoice")
);
const HelpSupport = lazy(() =>
  import("./NGO-Dashboard/pages/Help&Support/HelpSupport")
);
const NgoPerformance = lazy(() =>
  import("./NGO-Dashboard/pages/NgoPerformance/NgoPerformance")
);
const About = lazy(() => import("./NGO-Dashboard/pages/AboutUs/About"));
const FAQ = lazy(() => import("./NGO-Dashboard/pages/FAQ/FAQ"));
const PrivacyPolicies = lazy(() =>
  import("./NGO-Dashboard/pages/Privacy-Policy/PrivacyPolicies")
);

// Toast options
const toastOptions = {
  success: { style: { background: "#4CAF50", color: "white" } },
  error: { style: { background: "#F44336", color: "white" } },
  duration: 4000,
};

// Root wrapper that includes Toaster for all routes
const RootWrapper = () => (
  <>
    <Toaster
      position="top-right"
      toastOptions={toastOptions}
      containerStyle={{
        zIndex: 10000,
      }}
    />
    <Outlet />
  </>
);

// Main layout for home and related pages
const Layout = () => (
  <div className="app">
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);

// Protected Route Wrappers
// const UserProtectedRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.userReducer);

//   return (
//     <ProtectedRoute isAuthenticated={!!user} redirect="/login/user">
//       {children}
//     </ProtectedRoute>
//   );
// };

const NgoProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.ngoUserReducer);
  return (
    <ProtectedRoute isAuthenticated={!!user} redirect="/login/cause">
      {children}
    </ProtectedRoute>
  );
};

// const BusinessProtectedRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.businessUserReducer);
//   return (
//     <ProtectedRoute isAuthenticated={!!user} redirect="/login/business">
//       {children}
//     </ProtectedRoute>
//   );
// };

// Router configuration
const router = createBrowserRouter([
  {
    element: <RootWrapper />, // Wrap everything with RootWrapper
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/login/:userType", element: <Login /> },
          { path: "/signup", element: <Signup /> },
          { path: "/contact", element: <ContactUs /> },
          { path: "/about", element: <AboutUs /> },
          { path: "/blogs", element: <Blogs /> },
          { path: "/register-business", element: <Business /> },
          { path: "/register-cause", element: <Cause /> },
          { path: "/support", element: <SupportACause /> },
          { path: "/supportmaast", element: <SupportMaast /> },
          { path: "/howitworks", element: <HowItWorks /> },
          { path: "/cashback-charity", element: <Cashback /> },
          { path: "/cashback-deals", element: <CashbackDeals /> },
          { path: "/offline-shop", element: <OfflineShop /> },
          { path: "/offline-shop/:category", element: <CatagoryBasedShops /> },
          {
            path: "/offline-shop/:category/:businessId",
            element: <BusinessDetails />,
          },
          {
            path: "/offline-shop/:category/:businessId/:productId",
            element: <ProductDetails />,
          },
          { path: "/online-shop", element: <OnlineShop /> },
          { path: "/shop", element: <Shop /> },
          { path: "/business-form", element: <BusinessForm /> },
          { path: "/cause-form", element: <CauseForm /> },
        ],
      },
      // Protected User Dashboard Routes
      {
        path: "/user-dashboard/:userId/dashboard",
        element: (
          // <UserProtectedRoute>
          <UserDashboard />
          //   </UserProtectedRoute>
        ),
      },
      {
        path: "/user-dashboard/:userId",
        element: (
          //    <UserProtectedRoute>
          <NewLayout />
          //     </UserProtectedRoute>
        ),
        children: [
          {
            path: "/user-dashboard/:userId/online-shop",
            element: <OnlineShop />,
          },
          {
            path: "/user-dashboard/:userId/offline-shop",
            element: <OfflineShop />,
          },
          {
            path: "/user-dashboard/:userId/offline-shop/:category",
            element: <CatagoryBasedShops />,
          },
          {
            path: "/user-dashboard/:userId/offline-shop/:category/:businessId",
            element: <BusinessDetails />,
          },
          {
            path: "/user-dashboard/:userId/offline-shop/:category/:businessId/:productId",
            element: <ProductDetails />,
          },
          {
            path: "/user-dashboard/:userId/howitworks",
            element: <HowItWorks />,
          },
          {
            path: "/user-dashboard/:userId/cashback-charity",
            element: <Cashback />,
          },
          {
            path: "/user-dashboard/:userId/supportmaast",
            element: <SupportMaast />,
          },
          {
            path: "/user-dashboard/:userId/profile",
            element: <UserProfile />,
          },
        ],
      },
      // Protected NGO Dashboard Routes
      {
        path: "/ngo-dashboard/:id",
        element: (
          <NgoProtectedRoute>
            <NgoDashboardOutlet />
          </NgoProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <NgoDashboard /> },
          { path: "details", element: <NgoDetails /> },
          { path: "performance", element: <NgoPerformance /> },
          { path: "support", element: <HelpSupport /> },
          { path: "about-us", element: <About /> },
          { path: "faqs", element: <FAQ /> },
          { path: "privacy-policy", element: <PrivacyPolicies /> },
        ],
      },
      // Admin routes
      {
        path: "/admin/shoppiness/",
        element: <AdminDashboardOutlet />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "edit-pages", element: <WebsiteEditPages /> },
          { path: "contact-info", element: <ContactInfo /> },
          { path: "faq", element: <AllFaqs /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
          { path: "newsletter", element: <Newsletter /> },
          { path: "blog", element: <MainBlog /> },
          { path: "social-media", element: <MainSocialmedia /> },
          { path: "maast/edit", element: <EditPage /> },
          { path: "maast/donations", element: <AllDonations /> },
          { path: "maast/events", element: <Events /> },
          { path: "ngo/ngo-requests", element: <NgoRequest /> },
          { path: "ngo/all-ngo", element: <AllNgos /> },
          { path: "ngo/giveback-request", element: <GiveBackRecord /> },
          {
            path: "services/offlineshop-requests",
            element: <OfflineShopRequests />,
          },
          {
            path: "services/onlineshop-requests",
            element: <OnlineShopRequests />,
          },
          { path: "services/all-offlineshops", element: <AllOfflineShops /> },
          { path: "services/all-onlineshops", element: <AllOnlineShops /> },
          { path: "services/add-categories", element: <AddCategories /> },
          { path: "users/coupons", element: <Coupons /> },
          {
            path: "users/withdrawal-requests",
            element: <WithdrawalRequests />,
          },
          { path: "users/cashback-requests", element: <CashbackRequests /> },
          { path: "users/cashback-status", element: <CashbackStatus /> },
          { path: "users/givebacks", element: <Givebacks /> },

          // { path: "/contact", element: <ContactInfo /> },
          // { path: "/contact/message", element: <ContactMessage />},
        ],
      },
      // Protected Services Dashboard Routes
      {
        path: "/services-dashboard/:id",
        element: (
          //  <BusinessProtectedRoute>
          <DashboardOutlet />
          //     </BusinessProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "products", element: <Products /> },
          { path: "customers", element: <Customers /> },
          { path: "shopinfo", element: <ShopInfo /> },
          { path: "pos", element: <MainPos /> },
          { path: "invoices", element: <Invoice /> },
        ],
      },
      // Fallback route (404 page)
      { path: "*", element: <div>404 Not Found</div> },
    ],
  },
]);

// App Component
const App = () => (
  <Suspense fallback={<Loader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;
