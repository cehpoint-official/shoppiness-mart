import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/global.scss";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import Loader from "./Components/Loader/Loader.jsx";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
