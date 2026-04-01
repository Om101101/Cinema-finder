import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import TrendingPage from "./components/templates/TrendingPage";
import Popular from './components/templates/Popular';
import People from './components/templates/People';

function App() {
  return (
    <div className="bg-[#080810] w-screen min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TrendingPage" element={<TrendingPage />} />
        <Route path="/Popular" element={<Popular />} />
        <Route path="/People" element={<People />} />

      </Routes>
    </div>
  );
}

export default App;
