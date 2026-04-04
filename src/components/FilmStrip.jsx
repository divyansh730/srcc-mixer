import { useState, useMemo } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const photoFiles = [
  "past-photos/Amba_0020.JPG", "past-photos/Amba_0056.JPG", "past-photos/Amba_0060.JPG",
  "past-photos/Amba_0118.JPG", "past-photos/Amba_0138.JPG", "past-photos/Amba_0238.JPG",
  "past-photos/Amba_0302.JPG", "past-photos/Amba_0471.JPG", "past-photos/Amba_0462.JPG",
  "past-photos/Amba_0494.JPG", "past-photos/Amba_0514.JPG", "past-photos/Amba_0527.JPG",
  "past-photos/Amba_0531.JPG", "past-photos/Amba_0573.JPG", "past-photos/Amba_0624.JPG"
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function TickerRow({ images, reverse, speedSeconds }) {
  // Duplicate array multiple times to ensure the loop is massive wide for any screen
  const loopImages = [...images, ...images, ...images].filter(Boolean);

  return (
    <div style={{
      display: "flex",
      width: "100%",
      overflow: "hidden",
      position: "relative",
    }}>
      <div
        className={`ticker-track ${reverse ? "reverse" : ""}`}
        style={{
          display: "flex",
          width: "max-content",
          animation: `ticker ${speedSeconds}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal"
        }}
      >
        {loopImages.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="ticker-img-wrap"
            style={{
              width: "220px",
              height: "140px",
              flexShrink: 0,
              marginRight: "8px",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid rgba(201,168,76,0.18)",
              cursor: "pointer",
            }}
          >
            <img
              src={assetUrl(src)}
              alt="Memory"
              draggable="false"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "sepia(0.65) saturate(0.6) hue-rotate(-10deg) brightness(0.6) contrast(1.1)",
                transition: "all 0.4s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "sepia(0.1) saturate(1.2) brightness(1.0) contrast(1.05)";
                e.currentTarget.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "sepia(0.65) saturate(0.6) hue-rotate(-10deg) brightness(0.6) contrast(1.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FilmStrip({ embedded = false }) {
  const [isMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  const row1 = useMemo(() => shuffleArray(photoFiles).slice(0, 8), []);
  const row2 = useMemo(() => shuffleArray(photoFiles).slice(8, 16), []);

  // When not embedded, render nothing — it lives inside ScrollStory now
  if (!embedded) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        .ticker-track:hover { animation-play-state: paused !important; }
      `}</style>

      {/* Title Block */}
      <div style={{ textAlign: "center", marginBottom: "32px", position: "relative", zIndex: 10 }}>
        <h2 style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: isMobile ? "40px" : "56px",
          color: "#D9B14A",
          margin: 0,
          lineHeight: 1,
          textShadow: "0 0 20px rgba(212,175,55,0.4), 0 2px 10px rgba(0,0,0,0.8)"
        }}>
          The Past Editions
        </h2>
        <p style={{
          fontFamily: "'Cinzel', serif",
          color: "rgba(220,215,200,0.8)",
          letterSpacing: "0.22em",
          fontSize: isMobile ? "8px" : "10px",
          textTransform: "uppercase",
          marginTop: "8px",
        }}>
          A Glance Into History
        </p>
      </div>

      {/* Dual Infinite Tickers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <TickerRow images={row1} reverse={false} speedSeconds={isMobile ? 30 : 60} />
        <TickerRow images={row2} reverse={true} speedSeconds={isMobile ? 35 : 70} />
      </div>

      {/* Edge Fade Gradients */}
      <div style={{
        position: "absolute",
        inset: "0 0 0 0",
        background: "linear-gradient(90deg, #000000 0%, transparent 15%, transparent 85%, #000000 100%)",
        pointerEvents: "none",
        zIndex: 20
      }} />
    </div>
  );
}
