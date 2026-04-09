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
            setTimeout(() => setActiveLine(3), 9600);  // Line 4 appears, Line 3 disappears
            setTimeout(() => setActiveLine(4), 10800); // Line 5 appears, Line 4 stays
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
    "At the Alumni Mixer 2026, let's celebrate what PC was, and what it still feels like because of you!",
    "Excited to welcome you back to SRCC!",
    "4:00 P.M., 25 April 2026"
  ];

  return (
    <div
      ref={containerRef}
      style={{
        padding: isMobile ? "16px 20px 16px" : "clamp(40px, 10vh, 120px) 20px clamp(40px, 8vh, 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        zIndex: 5,
        minHeight: isMobile ? "20vh" : "50vh"
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

      <div style={{ position: "relative", width: "100%", maxWidth: "900px", minHeight: "160px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {lines.slice(0, 3).map((line, index) => {
          // Lines 0, 1, 2 disappear when the next one appears.
          const isVisible = activeLine === index;
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

        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? "8px" : "16px",
            width: "100%",
            pointerEvents: activeLine >= 3 ? "auto" : "none"
        }}>
          {lines.slice(3, 5).map((line, idx) => {
            const index = idx + 3;
            const isVisible = activeLine >= index;
            // same formatting as first popup
            return (
              <p
                key={index}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(36px, 7vw, 56px)",
                  color: "#C9A84C",
                  margin: 0,
                  lineHeight: 1.2,
                  opacity: isVisible ? 1 : 0,
                  transform: `translateY(${isVisible ? "0px" : "40px"})`,
                  transition: "opacity 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  textShadow: "0 0 24px rgba(201,168,76,0.5)",
                }}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
