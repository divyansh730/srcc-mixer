import { useEffect, useMemo, useRef, useState } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const photoFiles = [
  "past-photos/Amba_0020.JPG",
  "past-photos/Amba_0056.JPG",
  "past-photos/Amba_0060.JPG",
  "past-photos/Amba_0070.JPG",
  "past-photos/Amba_0081.JPG",
  "past-photos/Amba_0118.JPG",
  "past-photos/Amba_0138.JPG",
  "past-photos/Amba_0163.JPG",
  "past-photos/Amba_0238.JPG",
  "past-photos/Amba_0277.JPG",
  "past-photos/Amba_0302.JPG",
  "past-photos/Amba_0312.JPG",
  "past-photos/Amba_0367.JPG",
  "past-photos/Amba_0398.JPG",
  "past-photos/Amba_0453.JPG",
  "past-photos/Amba_0462.JPG",
  "past-photos/Amba_0471.JPG",
  "past-photos/Amba_0473.JPG",
  "past-photos/Amba_0492.JPG",
  "past-photos/Amba_0494.JPG",
  "past-photos/Amba_0497.JPG",
  "past-photos/Amba_0514.JPG",
  "past-photos/Amba_0527.JPG",
  "past-photos/Amba_0531.JPG",
  "past-photos/Amba_0573.JPG",
  "past-photos/Amba_0624.JPG",
  "past-photos/Amba_0704.JPG",
  "past-photos/Amba_0785.JPG",
  "past-photos/IMG_0010.JPG",
  "past-photos/IMG_0015.JPG",
  "past-photos/IMG_0018.JPG",
  "past-photos/IMG_0037.JPG",
  "past-photos/IMG_0041.JPG",
  "past-photos/IMG_0051.JPG",
  "past-photos/IMG_0158.JPG",
  "past-photos/IMG_0168.JPG",
  "past-photos/IMG_0172.JPG",
  "past-photos/IMG_0187.JPG",
  "past-photos/IMG_0221.JPG",
  "past-photos/IMG_0240.JPG",
  "past-photos/IMG_0258.JPG",
  "past-photos/IMG_0291.JPG",
  "past-photos/IMG_0306.JPG",
  "past-photos/IMG_0339.JPG",
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getFrameMetrics(isMobile) {
  return {
    width: isMobile ? 116 : 160,
    height: isMobile ? 108 : 140,
    perforationHeight: isMobile ? 14 : 18,
    perforationWidth: isMobile ? 9 : 12,
    imageInsetX: isMobile ? 3 : 4,
    imageInsetY: isMobile ? 2 : 3,
    gateHeight: isMobile ? 76 : 104,
    frameGap: 0,
    stripInsetY: isMobile ? 2 : 3,
  };
}

function FilmFrame({ photoSrc, isMobile, rotation }) {
  const metrics = getFrameMetrics(isMobile);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        width: `${metrics.width}px`,
        height: `${metrics.height}px`,
        background:
          "linear-gradient(180deg, rgba(28,17,5,0.99) 0%, rgba(10,5,1,1) 48%, rgba(32,19,6,0.99) 100%)",
        borderLeft: "1px solid rgba(201,168,76,0.14)",
        borderRight: "1px solid rgba(201,168,76,0.08)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.02), inset 0 10px 18px rgba(255,255,255,0.02), 0 0 0 1px rgba(111,74,21,0.18)",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: `${metrics.perforationHeight}px`,
          background:
            "linear-gradient(180deg, rgba(21,12,3,0.99), rgba(9,4,0,1))",
          padding: "0 4px",
          flexShrink: 0,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`top-${i}`}
            style={{
              width: `${metrics.perforationWidth}px`,
              height: isMobile ? "6px" : "9px",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "2px",
              background:
                "linear-gradient(180deg, rgba(87,58,15,0.76), rgba(31,16,3,0.95))",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), 0 0 8px rgba(152,106,29,0.08)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          padding: `${metrics.imageInsetY}px ${metrics.imageInsetX}px`,
          background:
            "linear-gradient(180deg, rgba(25,14,4,0.97) 0%, rgba(10,5,1,1) 100%)",
          borderTop: "1px solid rgba(201,168,76,0.06)",
          borderBottom: "1px solid rgba(201,168,76,0.06)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: `${metrics.gateHeight}px`,
            overflow: "hidden",
            border: "1px solid rgba(232,214,166,0.2)",
            boxShadow:
              "inset 0 0 0 1px rgba(0,0,0,0.72), 0 0 0 1px rgba(201,168,76,0.1), 0 0 18px rgba(89,54,12,0.12)",
            background: "#120900",
          }}
        >
          <img
            src={photoSrc}
            alt=""
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "sepia(0.58) saturate(0.72) hue-rotate(-10deg) brightness(0.68) contrast(1.06)",
              transform: "scale(1.03)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(247,221,149,0.12), rgba(78,48,9,0.08) 32%, rgba(17,7,0,0.02) 58%, rgba(0,0,0,0.26))",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 28px rgba(0,0,0,0.42)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 35%, rgba(205,159,63,0.12), transparent 58%), radial-gradient(circle at 50% 120%, rgba(62,34,3,0.22), transparent 48%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: `${metrics.perforationHeight}px`,
          background:
            "linear-gradient(180deg, rgba(21,12,3,0.99), rgba(9,4,0,1))",
          padding: "0 4px",
          flexShrink: 0,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`bottom-${i}`}
            style={{
              width: `${metrics.perforationWidth}px`,
              height: isMobile ? "6px" : "9px",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "2px",
              background:
                "linear-gradient(180deg, rgba(87,58,15,0.76), rgba(31,16,3,0.95))",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), 0 0 8px rgba(152,106,29,0.08)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Strip({ direction, isMobile, shuffledPhotos }) {
  const trackRef = useRef(null);
  const metrics = getFrameMetrics(isMobile);
  const frames = useMemo(
    () => [...shuffledPhotos, ...shuffledPhotos, ...shuffledPhotos, ...shuffledPhotos],
    [shuffledPhotos]
  );
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const speed = direction === "left" ? -0.48 : 0.48;
  const frameWidth = metrics.width + metrics.frameGap;

  useEffect(() => {
    const animate = () => {
      if (trackRef.current) {
        posRef.current += speed;
        const totalWidth = shuffledPhotos.length * frameWidth;
        if (posRef.current <= -totalWidth) posRef.current += totalWidth;
        if (posRef.current >= 0) posRef.current -= totalWidth;
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [frameWidth, shuffledPhotos, speed]);

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
        background:
          "linear-gradient(180deg, rgba(23,13,3,0.99) 0%, rgba(8,3,0,1) 50%, rgba(23,13,3,0.99) 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: isMobile ? "60px" : "100px",
          background: "linear-gradient(90deg, #0A0500, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: isMobile ? "60px" : "100px",
          background: "linear-gradient(90deg, transparent, #0A0500)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: "max-content",
          gap: `${metrics.frameGap}px`,
          padding: `${metrics.stripInsetY}px 0`,
          willChange: "transform",
        }}
      >
        {frames.map((photoFile, i) => (
          <FilmFrame
            key={`${direction}-${photoFile}-${i}`}
            photoSrc={assetUrl(photoFile)}
            isMobile={isMobile}
            rotation={((i % 5) - 2) * (isMobile ? 0.22 : 0.16)}
          />
        ))}
      </div>
    </div>
  );
}

export default function FilmStrip() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );
  const topStripPhotos = useMemo(() => shuffleArray(photoFiles), []);
  const bottomStripPhotos = useMemo(() => shuffleArray(photoFiles), []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      id="memory-lane"
      style={{
        background: "linear-gradient(180deg, #060200 0%, #0A0500 20%, #0A0500 80%, #080300 100%)",
        padding: "100px 0 80px 0",
        position: "relative",
        borderTop: "1px solid rgba(201,168,76,0.08)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "150px", background: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent)", pointerEvents: "none" }} />
      
      <div
        style={{
          textAlign: "center",
          marginBottom: "64px",
          padding: "0 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ width: "1px", height: "40px", background: "linear-gradient(180deg, transparent, #C9A84C)", margin: "0 auto 24px" }} />
        
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "10px",
          letterSpacing: "0.4em",
          color: "rgba(201,168,76,0.6)",
          textTransform: "uppercase",
          marginBottom: "16px"
        }}>
          Memory Lane
        </div>

        <h2
          style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: "clamp(44px, 8vw, 72px)",
            color: "#F6E8BC",
            margin: 0,
            textShadow: "0 4px 32px rgba(201,168,76,0.2), 0 2px 12px rgba(0,0,0,0.8)",
            lineHeight: 1.1,
          }}
        >
          The Past Editions
        </h2>
        
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(17px, 2vw, 21px)",
          color: "rgba(218, 224, 234, 0.7)",
          fontStyle: "italic",
          maxWidth: "600px",
          margin: "24px auto 0",
          lineHeight: 1.5,
          letterSpacing: "0.02em"
        }}>
          A glimpse into the cherished moments and enduring bonds from our previous alumni gatherings.
        </p>

        <div style={{ width: "1px", height: "40px", background: "linear-gradient(180deg, #C9A84C, transparent)", margin: "32px auto 0" }} />
      </div>

      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: isMobile ? "12px" : "16px" }}>
        <Strip direction="left" isMobile={isMobile} shuffledPhotos={topStripPhotos} />
        <Strip direction="right" isMobile={isMobile} shuffledPhotos={bottomStripPhotos} />
      </div>
    </section>
  );
}
