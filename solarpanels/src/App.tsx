
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/MainPage";
import PanelsCatalog from "./pages/SolarPanelsCatalog";
import PanelDetails from "./pages/SolarPanelDetail";
import LoginPage from "./pages/LoginPage";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {  dest_root } from "./target_config";
import RegisterPage from "./pages/RegisterPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import RequestsListPage from "./pages/RequestListPage";
import ProfilePage from "./pages/ProfilePage";

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
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/requests/:id" element={<RequestDetailPage/>}/>
        <Route path="/solarpanel-requests" element={<RequestsListPage/>}/>
        <Route path="/profile" element = {<ProfilePage/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;
