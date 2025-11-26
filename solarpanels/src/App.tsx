
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/MainPage";
import PanelsCatalog from "./pages/SolarPanelsCatalog";
import PanelDetails from "./pages/SolarPanelDetail";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {  dest_root } from "./target_config";

function App() {
  useEffect(()=>{
    invoke('tauri', {cmd:'create'})
      .then(() =>{console.log("Tauri launched")})
      .catch(() =>{console.log("Tauri not launched")})
    return () =>{
      invoke('tauri', {cmd:'close'})
        .then(() =>{console.log("Tauri launched")})
        .catch(() =>{console.log("Tauri not launched")})
    }
  }, [])
  return (
    <Router basename = {dest_root} 
    //"RIP_Frontend/"
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/panels" element={<PanelsCatalog />} />
        <Route path="/panels/:id" element={<PanelDetails />} />
        
      </Routes>
    </Router>
  );
}

export default App;
