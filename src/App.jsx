import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Loader from "./Components/Loader/Loader";
import NewLayout from "./NewLayout";
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
const UserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));
const FaqHome = lazy(() => import("./Admin/pages/FAQ/home"));
const AddFaq = lazy(() => import("./Admin/pages/FAQ/AddFaq"));
const AddPrivacyPolicy = lazy(() =>
  import("./Admin/pages/PrivacyPolicy/AddPrivacyPolicy")
);
const Newsletter = lazy(() => import("./Admin/pages/Newsletter/Newsletter"));
const ContactInfo = lazy(() => import("./Admin/pages/Contact/ContactInfo"));
const ContactMessage = lazy(() =>
  import("./Admin/pages/Contact/ContactMessage")
);
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

const toastOptions = {
  success: { style: { background: "#4CAF50", color: "white" } },
  error: { style: { background: "#F44336", color: "white" } },
  duration: 4000,
};

const Layout = () => (
  <div className="app">
    <Toaster
      position="top-right"
      toastOptions={toastOptions}
      containerStyle={{
        zIndex: 10000,
      }}
    />
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);

const router = createBrowserRouter([
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
      { path: "/online-shop", element: <OnlineShop /> },
      { path: "/shop", element: <Shop /> },
      { path: "/business-form", element: <BusinessForm /> },
      { path: "/cause-form", element: <CauseForm /> },
    ],
  },

  {
    path: "/user-dashboard/:userId/dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/user-dashboard/:userId",
    element: <NewLayout />,
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
  // Admin routes
  { path: "/admin/shoppiness/faq", element: <FaqHome /> },
  { path: "/admin/shoppiness/addfaq", element: <AddFaq /> },
  {
    path: "/admin/shoppiness/add/privacy-policy",
    element: <AddPrivacyPolicy />,
  },
  { path: "/admin/shoppiness/newsletter", element: <Newsletter /> },
  { path: "/admin/shoppiness/contact", element: <ContactInfo /> },
  { path: "/admin/shoppiness/contact/message", element: <ContactMessage /> },
  // Services Dashboard
  {
    path: "/services-dashboard/:id",
    element: <DashboardOutlet />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "customers", element: <Customers /> },
      { path: "shopinfo", element: <ShopInfo /> },
      { path: "pos", element: <MainPos /> },
      { path: "invoices", element: <Invoice /> },
    ],
  },
  // NGO Dashboard
  {
    path: "/ngo-dashboard/:id",
    element: <NgoDashboardOutlet />,
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
  // Fallback route (404 page)
  { path: "*", element: <div>404 Not Found</div> },
]);

const App = () => (
  <Suspense fallback={<Loader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;
