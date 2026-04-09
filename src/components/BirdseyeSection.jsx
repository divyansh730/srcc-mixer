import { useEffect, useRef, useState } from "react";
import "./Birdseye.css";

export default function BirdseyeSection() {
  const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
  const headerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("landing-heading-visible");
            headingObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -5% 0px", threshold: 0.15 }
    );

    if (headerRef.current) {
      headingObserver.observe(headerRef.current);
    }

    return () => {
      headingObserver.disconnect();
    };
  }, []);

  return (
    <section
      id="birdseye"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, transparent 0%, #0A0500 15%, #080402 100%)",
        padding: "0",
        marginTop: isMobile ? "16px" : "72px",
        borderTop: "none",
      }}
    >
      <div
        className="landing-heading-block"
        ref={headerRef}
        style={{ marginBottom: '0px' }}
      >
        <h2 className="landing-welcome-title">Campus Birdseye</h2>

        <p
          className="intro-description"
          style={{
            opacity: 0,
            transform: 'translate3d(0, 24px, 0)',
            transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.35s'
          }}
        >
          Click on any spot to bring it back to colour!
        </p>

        <style>{`
          .landing-heading-visible .intro-description {
            opacity: 1 !important;
            transform: translate3d(0, 0, 0) !important;
          }
        `}</style>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "min(65vh, 480px)" : "100vh",
          margin: "0 auto",
          padding: "0",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.9)",
        }}
      >
        <iframe
          src={assetUrl("birdseye.html")}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title="Campus Bird's-Eye"
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        />
        {/* Bottom gradient blend */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "15px",
            background: "linear-gradient(to bottom, transparent, #0A0500 80%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </div>

      {/* Section bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "0px",
          background: "linear-gradient(to bottom, transparent, #0A0500)",
          pointerEvents: "none",
        }}
      />

    </section>
  );
}
