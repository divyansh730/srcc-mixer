import { useEffect, useRef, useState } from "react";

export default function ClosingNote() {
  const containerRef = useRef(null);
  const [activeLine, setActiveLine] = useState(-1);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger lines sequentially and slowly.
            // When a new line becomes active, the previous one goes away.
            setTimeout(() => setActiveLine(0), 400);   // Line 1 appears
            setTimeout(() => setActiveLine(1), 3200);  // Line 2 appears, Line 1 disappears
            setTimeout(() => setActiveLine(2), 6000);  // Line 3 appears, Line 2 disappears
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const lines = [
    "The 'P' in PC was always about the people.",
    "You were always at the heart of it.",
    "At the Alumni Mixer 2026, let's celebrate what PC was, and what it still feels like because of you!"
  ];

  return (
    <div
      ref={containerRef}
      style={{
        padding: isMobile ? "32px 20px 24px" : "clamp(40px, 10vh, 120px) 20px clamp(40px, 8vh, 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        zIndex: 5,
        minHeight: isMobile ? "40vh" : "50vh"
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vw",
        height: "60vw",
        background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 60%)",
        pointerEvents: "none",
        zIndex: -1
      }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "900px", height: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {lines.map((line, index) => {
          // A line is visible if it is the precisely active line. The 3rd line stays visible forever once reached.
          const isVisible = index === 2 ? activeLine >= 2 : activeLine === index;
          // Determine if it has already passed (faded out up)
          const isPast = activeLine > index;

          return (
            <p
              key={index}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: index === 2 ? "clamp(24px, 5vw, 36px)" : "clamp(46px, 8vw, 68px)",
                color: index === 2 ? "#E2E6ED" : "#C9A84C",
                margin: 0,
                lineHeight: 1.4,
                opacity: isVisible ? 1 : 0,
                // If it's visible, translateY is 0. If it hasn't appeared yet, it's lower (40px). If it's past, it floats up higher (-40px).
                transform: `translate(-50%, calc(-50% + ${isVisible ? "0px" : isPast ? "-40px" : "40px"}))`,
                transition: "opacity 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                textShadow: index !== 2 ? "0 0 24px rgba(201,168,76,0.5)" : "none",
                letterSpacing: index === 2 ? "0.06em" : "0",
              }}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
