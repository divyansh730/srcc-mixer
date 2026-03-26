import { useEffect, useRef } from "react";

const batches = [
  { year: "'95", label: "Founding Batch" },
  { year: "'97", label: "Batch of 1997" },
  { year: "'00", label: "Class of 2000" },
  { year: "'03", label: "Batch of 2003" },
  { year: "'06", label: "Batch of 2006" },
  { year: "'09", label: "Batch of 2009" },
  { year: "'12", label: "Batch of 2012" },
  { year: "'15", label: "Batch of 2015" },
  { year: "'18", label: "Batch of 2018" },
  { year: "'21", label: "Batch of 2021" },
  { year: "'24", label: "Batch of 2024" },
];

function FilmFrame({ year, label }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", flexShrink: 0,
      width: "160px", height: "140px",
      background: "#0C0600",
      borderLeft: "1.5px solid rgba(201,168,76,0.14)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        height: "18px", background: "rgba(3,1,0,0.95)", padding: "0 4px", flexShrink: 0
      }}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} style={{
            width: "12px", height: "9px",
            border: "1.5px solid rgba(201,168,76,0.3)",
            borderRadius: "2px", background: "#1E1003"
          }} />
        ))}
      </div>
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #221205, #160C03)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "5px", position: "relative",
        borderTop: "1px solid rgba(201,168,76,0.06)",
        borderBottom: "1px solid rgba(201,168,76,0.06)"
      }}>
        <div style={{ fontSize: "22px", opacity: 0.22 }}>📷</div>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: "7px",
          letterSpacing: "0.1em", color: "rgba(201,168,76,0.38)",
          textTransform: "uppercase", textAlign: "center", padding: "0 4px"
        }}>{label}</div>
        <div style={{
          position: "absolute", bottom: "3px", left: 0, right: 0,
          textAlign: "center", fontFamily: "'Cinzel', serif",
          fontSize: "8px", letterSpacing: "0.14em",
          color: "rgba(201,168,76,0.85)",
          textShadow: "0 0 8px rgba(201,168,76,0.35)",
          background: "linear-gradient(0deg, rgba(0,0,0,0.65), transparent)",
          padding: "5px 3px 3px"
        }}>{year}</div>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        height: "18px", background: "rgba(3,1,0,0.95)", padding: "0 4px", flexShrink: 0
      }}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} style={{
            width: "12px", height: "9px",
            border: "1.5px solid rgba(201,168,76,0.3)",
            borderRadius: "2px", background: "#1E1003"
          }} />
        ))}
      </div>
    </div>
  );
}

function Strip({ direction }) {
  const trackRef = useRef(null);
  const frames = [...batches, ...batches, ...batches, ...batches];
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const speed = direction === "left" ? -0.4 : 0.4;

  useEffect(() => {
    const animate = () => {
      if (trackRef.current) {
        posRef.current += speed;
        const totalWidth = batches.length * 161.5;
        if (posRef.current <= -totalWidth) posRef.current += totalWidth;
        if (posRef.current >= 0) posRef.current -= totalWidth;
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);

  return (
    <div style={{
      width: "100%", overflow: "hidden", position: "relative",
      borderTop: "1px solid rgba(201,168,76,0.1)",
      borderBottom: "1px solid rgba(201,168,76,0.1)"
    }}>
      {/* Fade edges */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "100px",
        background: "linear-gradient(90deg, #0A0500, transparent)",
        zIndex: 2, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: "100px",
        background: "linear-gradient(90deg, transparent, #0A0500)",
        zIndex: 2, pointerEvents: "none"
      }} />
      <div ref={trackRef} style={{ display: "flex", width: "max-content" }}>
        {frames.map((b, i) => <FilmFrame key={i} {...b} />)}
      </div>
    </div>
  );
}

export default function FilmStrip() {
  return (
    <div style={{
      background: "#0A0500",
      paddingTop: "0px",
      borderTop: "1px solid rgba(201,168,76,0.08)"
    }}>
      <Strip direction="left" />
      <div style={{ height: "6px", background: "#0A0500" }} />
      <Strip direction="right" />
    </div>
  );
}