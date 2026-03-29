import { useCallback, useEffect, useRef, useState } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export default function BirdseyeSection() {
  const iframeRef = useRef(null);
  const headingBlockRef = useRef(null);

  useEffect(() => {
    const headingEl = headingBlockRef.current;
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

    if (headingEl) headingObserver.observe(headingEl);

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
        padding: "24px 12px 0",
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

      {/* EXPLORE THE CAMPUS Pointer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          marginBottom: "32px",
          animation: "bounce 3s ease-in-out infinite",
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "10px",
            letterSpacing: "0.35em",
            color: "#C9A84C",
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          Explore the Campus
        </span>
        <div
          style={{
            width: "1px",
            height: "32px",
            background: "linear-gradient(to bottom, #C9A84C, transparent)",
            opacity: 0.6,
          }}
        />
      </div>

      <div
        ref={headingBlockRef}
        className="landing-heading-block"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1180px",
          margin: "0 auto 20px",
          textAlign: "center",
        }}
      >
        <h2
          className="landing-welcome-title"
          style={{
            fontSize: "clamp(34px, 6.5vw, 64px)",
            marginBottom: 0,
          }}
        >
          Campus Bird&rsquo;s-Eye
        </h2>
      </div>

      <div
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
            minHeight: "520px",
            border: "none",
            borderRadius: "4px",
            background: "#0A0805",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          }}
        />
      </div>

      <div style={{ height: "28px" }} aria-hidden />
    </section>
  );
}
