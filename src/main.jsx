import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux"
import './index.css'
import "./styles/global.scss";
import reduxStore from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <App />

    </Provider>
  </React.StrictMode>,
)
