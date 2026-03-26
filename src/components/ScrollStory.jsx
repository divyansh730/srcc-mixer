import { useEffect, useRef } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
const SRCC_LOGO = assetUrl("srcc-logo.png");
const BG_CLOCK = assetUrl("srcc-clock.jpg");
const BG_CORRIDOR = assetUrl("srcc-corridor.jpg");

const TOTAL = 5;

export default function ScrollStory() {
  const clockBgRef = useRef(null);
  const corridorBgRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndRef = useRef(null);
  const headerRef = useRef(null);
  const mlTextRef = useRef(null);
  const mlSubRef = useRef(null);

  useEffect(() => {
    let winH = window.innerHeight;
    let winW = window.innerWidth;
    let ticking = false;
    let lastSy = 0;

    const onResize = () => { winH = window.innerHeight; winW = window.innerWidth; };
    window.addEventListener("resize", onResize, { passive: true });

    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const range = (p, a, b) => clamp((p - a) / (b - a), 0, 1);

    const update = () => {
      const sy = lastSy;
      const total = winH * TOTAL;
      const p = clamp(sy / total, 0, 1);

      // Only animate opacity and transform — never filter
      // Clock wrapper: translate up slowly
      if (clockBgRef.current) {
        const ty = -p * 22;
        const op = 1 - ease(range(p, 0.3, 0.56));
        clockBgRef.current.style.opacity = op;
        clockBgRef.current.style.transform = `translate3d(0, ${ty}%, 0)`;
      }

      // Corridor wrapper: fade in, slight upward drift
      if (corridorBgRef.current) {
        const op = ease(range(p, 0.3, 0.58));
        const ty = (1 - op) * 8;
        corridorBgRef.current.style.opacity = op;
        corridorBgRef.current.style.transform = `translate3d(0, ${ty}%, 0)`;
      }

      // Header
      if (headerRef.current) {
        const hop = ease(range(p, 0.34, 0.46));
        headerRef.current.style.opacity = hop;
        headerRef.current.style.pointerEvents = hop > 0.5 ? "all" : "none";
      }

      // Logo
      if (logoRef.current) {
        const lp = ease(range(p, 0.12, 0.44));
        const startSize = 88, endSize = 34;
        const size = startSize - lp * (startSize - endSize);
        const startX = winW / 2 - startSize / 2;
        const startY = winH * 0.22;
        const endX = 40, endY = (68 - endSize) / 2;
        const x = startX + lp * (endX - startX);
        const y = startY + lp * (endY - startY);
        logoRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        logoRef.current.style.width = `${size}px`;
        logoRef.current.style.height = `${size}px`;
        logoRef.current.style.opacity = p > 0.46 ? 0 : 1;
      }

      // Hero text
      if (contentRef.current) {
        const cp = ease(range(p, 0.1, 0.42));
        const op = Math.max(1 - cp * 1.65, 0);
        const tx = cp * -winW * 0.27;
        const ty = cp * -winH * 0.36;
        const sc = 1 - cp * 0.48;
        contentRef.current.style.opacity = op;
        contentRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`;
      }

      // Scroll indicator
      if (scrollIndRef.current) {
        scrollIndRef.current.style.opacity = Math.max(1 - ease(range(p, 0, 0.08)), 0);
      }

      // Memory lane text
      if (mlTextRef.current) {
        if (p >= 0.68 && !mlTextRef.current.dataset.triggered) {
          mlTextRef.current.dataset.triggered = "true";
          mlTextRef.current.style.transition = "opacity 2.2s cubic-bezier(0.16,1,0.3,1), transform 2.4s cubic-bezier(0.16,1,0.3,1)";
          mlTextRef.current.style.opacity = 1;
          mlTextRef.current.style.transform = "translate3d(0, 0px, 0)";
        } else if (p < 0.68 && mlTextRef.current.dataset.triggered) {
          mlTextRef.current.dataset.triggered = "";
          mlTextRef.current.style.transition = "opacity 0.6s ease, transform 0.6s ease";
          mlTextRef.current.style.opacity = 0;
          mlTextRef.current.style.transform = "translate3d(0, 80px, 0)";
        }
      }

      // Subtitle
      if (mlSubRef.current) {
        if (p >= 0.76 && !mlSubRef.current.dataset.triggered) {
          mlSubRef.current.dataset.triggered = "true";
          mlSubRef.current.style.transition = "opacity 2s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 2s cubic-bezier(0.16,1,0.3,1) 0.5s";
          mlSubRef.current.style.opacity = 1;
          mlSubRef.current.style.transform = "translate3d(0, 0px, 0)";
        } else if (p < 0.76 && mlSubRef.current.dataset.triggered) {
          mlSubRef.current.dataset.triggered = "";
          mlSubRef.current.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          mlSubRef.current.style.opacity = 0;
          mlSubRef.current.style.transform = "translate3d(0, 32px, 0)";
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      lastSy = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      <header ref={headerRef} style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "68px",
        background: "rgba(6,2,0,0.96)",
        borderBottom: "1px solid rgba(201,168,76,0.18)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", zIndex: 200,
        opacity: 0, pointerEvents: "none",
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={SRCC_LOGO} alt="SRCC" style={{
            width: "34px", height: "34px", objectFit: "contain",
            filter: "drop-shadow(0 0 5px rgba(201,168,76,0.25))"
          }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: "11px",
              letterSpacing: "0.13em", color: "#E2E6ED", textTransform: "uppercase"
            }}>The Placement Cell · SRCC</span>
            <span style={{
              fontFamily: "'Pinyon Script', cursive", fontSize: "17px", color: "#C9A84C"
            }}>30 Years of Excellence</span>
          </div>
        </div>
        <nav style={{ display: "flex", gap: "28px" }}>
          <a href="#memory-lane" className="nav-link">Memory Lane</a>
          <a href="#mixer" className="nav-link">The Mixer</a>
          <a href="#alumni" className="nav-link">Alumni</a>
          <a href="#rsvp" className="nav-link">RSVP</a>
        </nav>
      </header>

      {/* LOGO — positioned via transform, not left/top */}
      <div ref={logoRef} style={{
        position: "fixed", left: 0, top: 0,
        width: "88px", height: "88px",
        zIndex: 150, pointerEvents: "none",
        willChange: "transform, width, height, opacity",
        transform: "translate3d(0,0,0)"
      }}>
        <img src={SRCC_LOGO} alt="SRCC" style={{
          width: "100%", height: "100%", objectFit: "contain",
          filter: "drop-shadow(0 0 14px rgba(201,168,76,0.22)) brightness(1.05)"
        }} />
      </div>

      {/* TALL SCROLL CONTAINER */}
      <div style={{ height: `${TOTAL * 100}vh`, position: "relative" }}>

        {/* STICKY PANEL */}
        <div style={{
          position: "sticky", top: 0,
          height: "100vh", overflow: "hidden",
          isolation: "isolate"
        }}>

          {/* Clock bg — filtered image, only opacity+transform animated */}
          <div style={{
            position: "absolute", inset: "-20% 0 -20% 0",
            zIndex: 0, overflow: "hidden",
            willChange: "transform, opacity"
          }} ref={clockBgRef}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url('${BG_CLOCK}')`,
              backgroundSize: "cover", backgroundPosition: "center 35%",
              filter: "sepia(0.5) brightness(0.45) contrast(1.05)",
              transform: "translate3d(0,0,0)"
            }} />
          </div>

          {/* Corridor bg — filtered image, only opacity+transform animated */}
          <div style={{
            position: "absolute", inset: "-20% 0 -20% 0",
            zIndex: 0, overflow: "hidden",
            opacity: 0,
            willChange: "transform, opacity"
          }} ref={corridorBgRef}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url('${BG_CORRIDOR}')`,
              backgroundSize: "cover", backgroundPosition: "center 50%",
              filter: "sepia(0.5) brightness(0.45) contrast(1.05)",
              transform: "translate3d(0,0,0)"
            }} />
          </div>

          {/* Vignette */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "radial-gradient(ellipse at 50% 36%, transparent 10%, rgba(2,1,0,0.44) 52%, rgba(1,0,0,0.9) 100%)",
            pointerEvents: "none"
          }} />

          {/* Lines */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(201,168,76,0.018) 60px)"
          }} />

          {/* HERO TEXT */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 24px", textAlign: "center",
            pointerEvents: "none"
          }}>
            <div style={{ height: "110px" }} />
            <div ref={contentRef} style={{
              willChange: "transform, opacity",
              transformOrigin: "center center",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "16px",
              transform: "translate3d(0,0,0)"
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: "clamp(20px, 3.4vw, 42px)",
                  color: "#DDE3ED", letterSpacing: "0.12em",
                  lineHeight: 1.2, fontWeight: 400, textTransform: "uppercase",
                  textShadow: "0 2px 20px rgba(0,0,0,0.9)"
                }}>The Placement Cell</div>
                <div style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: "clamp(12px, 2vw, 24px)",
                  color: "rgba(221,227,237,0.78)", letterSpacing: "0.18em",
                  lineHeight: 1.2, fontWeight: 400, textTransform: "uppercase",
                  textShadow: "0 2px 20px rgba(0,0,0,0.9)"
                }}>Shri Ram College of Commerce</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "80px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
                <span style={{ color: "#C9A84C", fontSize: "13px" }}>✦</span>
                <div style={{ width: "80px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
              </div>

              <div style={{
                fontFamily: "'Pinyon Script', cursive",
                fontSize: "clamp(30px, 5vw, 56px)", color: "#C9A84C",
                textShadow: "0 0 30px rgba(201,168,76,0.55), 0 2px 10px rgba(0,0,0,0.9)",
                lineHeight: 1, letterSpacing: "0.02em"
              }}>30 Years of Excellence</div>

              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: "clamp(8px, 1vw, 11px)",
                color: "rgba(201,168,76,0.6)", letterSpacing: "0.3em", textTransform: "uppercase"
              }}>Est. 1995 · A Century of SRCC · 1926 – 2026</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div ref={scrollIndRef}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            style={{
              position: "absolute", bottom: "50px", left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "10px", zIndex: 10, cursor: "pointer"
            }}>
            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: "9px",
              letterSpacing: "0.4em", color: "rgba(201,168,76,0.85)",
              textTransform: "uppercase", textShadow: "0 0 16px rgba(201,168,76,0.5)"
            }}>Scroll to Enter</span>
            <div style={{
              width: "1px", height: "36px",
              background: "linear-gradient(180deg, rgba(201,168,76,0.8), transparent)",
              animation: "bounce 1.9s ease-in-out infinite"
            }} />
          </div>

          {/* MEMORY LANE TEXT */}
          <div style={{
            position: "absolute", zIndex: 5, inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none"
          }}>
            <div ref={mlTextRef} id="memory-lane" style={{
              textAlign: "center", padding: "0 24px",
              opacity: 0,
              transform: "translate3d(0, 80px, 0)",
              willChange: "transform, opacity"
            }}>
              <div style={{
                fontFamily: "'Pinyon Script', cursive",
                fontSize: "clamp(52px, 9.8vw, 112px)",
                color: "#F6E8BC",
                textShadow: "0 0 55px rgba(201,168,76,0.38), 0 4px 32px rgba(0,0,0,0.98)",
                lineHeight: 0.88, letterSpacing: "0.01em"
              }}>
                Welcome to<br />Memory Lane
              </div>
              <div ref={mlSubRef} style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontStyle: "italic",
                fontSize: "clamp(13px, 1.6vw, 17px)",
                color: "rgba(218,224,234,0.6)",
                marginTop: "28px", letterSpacing: "0.07em",
                opacity: 0,
                transform: "translate3d(0, 32px, 0)",
                willChange: "transform, opacity"
              }}>
                Thirty years of stories, sealed in silver and gold
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
