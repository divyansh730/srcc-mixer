import { useState, useMemo } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const photoFiles = [
  "past-photos/Amba_0020.JPG", "past-photos/Amba_0056.JPG", "past-photos/Amba_0060.JPG",
  "past-photos/Amba_0070.JPG", "past-photos/Amba_0081.JPG", "past-photos/Amba_0118.JPG",
  "past-photos/Amba_0138.JPG", "past-photos/Amba_0163.JPG", "past-photos/Amba_0238.JPG",
  "past-photos/Amba_0277.JPG", "past-photos/Amba_0302.JPG", "past-photos/Amba_0312.JPG",
  "past-photos/Amba_0367.JPG", "past-photos/Amba_0398.JPG", "past-photos/Amba_0453.JPG",
  "past-photos/Amba_0462.JPG", "past-photos/Amba_0471.JPG", "past-photos/Amba_0473.JPG",
  "past-photos/Amba_0492.JPG", "past-photos/Amba_0494.JPG", "past-photos/Amba_0497.JPG",
  "past-photos/Amba_0514.JPG", "past-photos/Amba_0527.JPG", "past-photos/Amba_0531.JPG",
  "past-photos/Amba_0573.JPG", "past-photos/Amba_0624.JPG", "past-photos/Amba_0704.JPG",
  "past-photos/Amba_0785.JPG", "past-photos/IMG_0010.JPG", "past-photos/IMG_0015.JPG",
  "past-photos/IMG_0018.JPG", "past-photos/IMG_0037.JPG", "past-photos/IMG_0041.JPG",
  "past-photos/IMG_0051.JPG", "past-photos/IMG_0158.JPG", "past-photos/IMG_0168.JPG",
  "past-photos/IMG_0172.JPG", "past-photos/IMG_0187.JPG", "past-photos/IMG_0221.JPG",
  "past-photos/IMG_0240.JPG", "past-photos/IMG_0258.JPG", "past-photos/IMG_0291.JPG",
  "past-photos/IMG_0306.JPG", "past-photos/IMG_0339.JPG"
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function TickerRow({ images, reverse, speedSeconds, isCenter }) {
  const loopImages = [...images, ...images, ...images, ...images].filter(Boolean);

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
            style={{
              width: isCenter ? "clamp(260px, 35vh, 420px)" : "clamp(200px, 28vh, 320px)",
              height: isCenter ? "min(28vh, 280px)" : "min(20vh, 200px)",
              flexShrink: 0,
              marginRight: "20px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(201,168,76,0.3)",
              cursor: "pointer",
              position: "relative",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              transform: "translateZ(0)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
            <img
              src={assetUrl(src)}
              alt="Memory"
              draggable="false"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "sepia(0.3) saturate(0.85) brightness(0.8) contrast(1.1)",
                transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "sepia(0) saturate(1.2) brightness(1.1) contrast(1.1)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "sepia(0.3) saturate(0.85) brightness(0.8) contrast(1.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FilmStrip() {
  const [isMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  const row1 = useMemo(() => shuffleArray(photoFiles).slice(0, 15), []);
  const row2 = useMemo(() => shuffleArray(photoFiles).slice(15, 30), []);
  const row3 = useMemo(() => shuffleArray(photoFiles).slice(30, 44), []);

  return (
    <section
      id="past-editions"
      style={{
        width: "100%",
        height: "100vh",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        .ticker-track:hover { animation-play-state: paused !important; }
      `}</style>

      {/* Decorative background grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(201,168,76,0.02) 60px)",
        zIndex: 1
      }} />

      {/* Title Block */}
      <div style={{ textAlign: "center", marginTop: "8vh", marginBottom: "3vh", position: "relative", zIndex: 10 }}>
        <h2 style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: isMobile ? "clamp(40px, 10vw, 54px)" : "clamp(50px, 8vh, 86px)",
          color: "#D9B14A",
          margin: 0,
          lineHeight: 1,
          textShadow: "0 0 40px rgba(212,175,55,0.4), 0 4px 15px rgba(0,0,0,0.9)",
          fontWeight: 400
        }}>
          The Past Editions
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.3em",
            fontSize: isMobile ? "10px" : "14px",
            textTransform: "uppercase",
            margin: 0,
          }}>
          </p>
        </div>
      </div>

      {/* Tickers */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "10px" : "2.5vh",
        width: "100%",
        position: "relative",
        zIndex: 5,
        transform: "scale(1.05)",
      }}>
        <TickerRow images={row1} reverse={false} speedSeconds={isMobile ? 40 : 80} />
        <div className="center-row">
          <TickerRow images={row2} reverse={true} speedSeconds={isMobile ? 45 : 90} isCenter={true} />
        </div>
        <TickerRow images={row3} reverse={false} speedSeconds={isMobile ? 35 : 75} />
      </div>

      {/* Edge Fade Gradients */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "15%",
        background: "linear-gradient(90deg, #000000 0%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 20
      }} />
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "15%",
        background: "linear-gradient(270deg, #000000 0%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 20
      }} />
      <div style={{
        position: "absolute",
        inset: "0 0 0 0",
        background: "linear-gradient(180deg, #000000 0%, transparent 15%)",
        pointerEvents: "none",
        zIndex: 20
      }} />
    </section>
  );
}
