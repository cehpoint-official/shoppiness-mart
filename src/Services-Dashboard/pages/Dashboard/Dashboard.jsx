import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "./../../components/DashboardHeader/DashboardHeader";
import "./Dashboard.scss";

function App() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">

        <DashboardHeader/>
      </div>
    </div>
  );
}

export default App;
