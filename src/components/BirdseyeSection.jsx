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

      {/* EXPLORE THE CAMPUS Pointer removed as it's now in the iframe header */}

      {/* Redundant heading block removed */}

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
