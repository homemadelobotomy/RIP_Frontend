
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import { Container } from "react-bootstrap";
import "../styles/Layout.css";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <Container className="layout-content">
        {children}
      </Container>
    </div>
  );
}

export default Layout;
