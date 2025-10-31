
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/MainPage";
import PanelsCatalog from "./pages/SolarPanelsCatalog";
import PanelDetails from "./pages/SolarPanelDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/panels" element={<PanelsCatalog />} />
        <Route path="/panels/:id" element={<PanelDetails />} />
        
      </Routes>
    </Router>
  );
}

export default App;
