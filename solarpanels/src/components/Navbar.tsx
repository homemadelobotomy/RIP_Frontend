
import { Navbar as BSNavbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <BSNavbar 
      bg="light" 
      expand="lg" 
      className="navbar-custom"
      sticky="top"
    >
      <Container className="navbar-container-custom">
        <div className="navbar-center">
          <BSNavbar.Brand as={Link} to="/" className="navbar-brand-custom">
            СОЛНЕЧНЫЕ ПАНЕЛИ
          </BSNavbar.Brand>
        </div>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle-custom" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-nav-custom">
            <Nav.Link as={Link} to="/panels" className="nav-link-custom">
              Каталог
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
