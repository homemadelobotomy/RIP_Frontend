import Navbar from "./Navbar";
import "../styles/VideoLayout.css";
import type { ReactNode } from "react";
import video from "../resources/mixkit-view-of-a-solar-panel-farm-generating-sustainable-energy-47097-hd-ready.mp4"

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-wrapper">

      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        poster=""
      >
        <source src={video} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      <div className="content-overlay">
        <Navbar />
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
