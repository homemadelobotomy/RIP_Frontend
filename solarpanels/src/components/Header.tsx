import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <Navbar expand="lg" className="header-navbar">
      <Container >
        <Navbar.Brand as={Link} to="/" className="header-brand">
          СОЛНЕЧНЫЕ ПАНЕЛИ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/panels" className="header-link">
              Каталог
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
