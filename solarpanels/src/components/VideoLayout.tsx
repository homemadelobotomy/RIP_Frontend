import Header from "./Header";
import "../styles/VideoLayout.css";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function VideoLayout({ children }: LayoutProps) {
  return (
    <div className="video-layout-wrapper">
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        poster=""
      >
        <source src={`${import.meta.env.BASE_URL}video.mp4`} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      <div className="content-overlay">
        <Header /> 
        <div className="video-layout-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default VideoLayout;
