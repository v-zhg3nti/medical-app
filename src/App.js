import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import { Auth } from "./components/Auth/Auth";
import WithAuth from "./hocs/WithAuth";
import "./App.css"
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Auth />} />
         <Route path="/" element={WithAuth(Dashboard)} />
      </Routes>
    </div>
  );
}

export default App;
