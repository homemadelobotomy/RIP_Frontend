
import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <Navbar className="header-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/panels" className="header-brand">
          СОЛНЕЧНЫЕ ПАНЕЛИ
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
