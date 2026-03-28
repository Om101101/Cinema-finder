import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import TrendingPage from "./components/templates/TrendingPage";

function App() {
  return (
    <div className="bg-[#080810] w-screen min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TrendingPage" element={<TrendingPage />} />
      </Routes>
    </div>
  );
}

export default App;
