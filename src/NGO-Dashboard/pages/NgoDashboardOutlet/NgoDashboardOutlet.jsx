import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "./../../components/DashboardHeader/DashboardHeader";
import "./NgoDashboardOutlet.scss";

function App() {
  return (
    <div className="dashboardOutlet">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        <Outlet /> {/* This renders the nested routes */}
      </div>
    </div>
  );
}

export default App;
