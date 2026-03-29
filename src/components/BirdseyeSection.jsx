import { useCallback, useEffect, useRef, useState } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export default function BirdseyeSection() {
  const iframeRef = useRef(null);

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

    const elements = document.querySelectorAll("#birdseye-section .landing-heading-block");
    elements.forEach((el) => headingObserver.observe(el));

    return () => {
      headingObserver.disconnect();
    };
  }, []);

  return (
    <section
      id="birdseye-section"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #0D0602 0%, #0A0500 55%, #080402 100%)",
        padding: "16px 8px 0", // Reduced padding for mobile
        marginTop: "-8px",
        borderTop: "1px solid rgba(201, 168, 76, 0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(201,168,76,0.018) 60px)",
        }}
      />

      <div
        className="landing-heading-block"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1180px",
          margin: "0 auto 12px", // Tighter margin
          textAlign: "center",
        }}
      >
        <h2
          className="landing-welcome-title"
          style={{
            fontSize: "clamp(32px, 6vw, 60px)", // Slightly smaller
            marginBottom: 0,
          }}
        >
          Campus Bird&rsquo;s-Eye
        </h2>
      </div>

      <div
        className="landing-heading-block" // Reusing this class for animation
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <iframe
          ref={iframeRef}
          title="SRCC campus bird's-eye interactive view"
          src={assetUrl("birdseye.html")}
          style={{
            display: "block",
            width: "100%",
            height: "min(100vh, 920px)",
            minHeight: "480px", // Reduced minHeight for mobile
            border: "none",
            borderRadius: "4px",
            background: "#0A0805",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      <div style={{ height: "28px" }} aria-hidden />
    </section>
  );
}
