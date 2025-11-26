import type { ReactNode } from "react";
import Header from "./Header";
import { Container } from "react-bootstrap";
import "../styles/Layout.css";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-wrapper">
      <Header />
      <Container  className="layout-content">
        {children}
      </Container>
    </div>
  );
}

export default Layout;
