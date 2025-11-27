import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutUser } from "../slices/authSlice";
import { api } from "../api";

function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {isAuth, login, isModerator} = useAppSelector((state) => state.auth)

  const handleLogout = async() =>{
    await dispatch(logoutUser());
    api.setSecurityData(null)
    navigate("/")
  }

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
            {isAuth ? (
              <>
              <Nav.Link as={Link} to="/solarpanel-requests" className="header-link">
               {isModerator ? "Расчеты на модерацию" : "Мои расчеты"} 
              </Nav.Link>
               <Nav.Link as={Link} to="/profile" className="header-link">
                  {login}
                </Nav.Link>
                <Button
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleLogout}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Выйти
                </Button>
                </>
              ):(
                <Nav.Link as={Link} to="/login" className="header-link">
                  Войти
                </Nav.Link>
              )   
            }
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
