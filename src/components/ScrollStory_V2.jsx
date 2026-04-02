import { useEffect, useRef, useState } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
const MEMORY_WALL_PAGE = `${import.meta.env.BASE_URL}memory-wall.html`;
const GALLERY_PAGE = `${import.meta.env.BASE_URL}pc-gallery.html`;
const BIRDSEYE_PAGE = `${import.meta.env.BASE_URL}Birdseye%20v2%20(2).html`;
const SRCC_LOGO = assetUrl("srcc-logo.png");
const MIXER_LOGO = assetUrl("Mixer logo.png");
const BG_CLOCK = assetUrl("srcc-clock.jpg");
const BG_CORRIDOR = assetUrl("srcc-corridor.jpg");

const TOTAL = 5;

export default function ScrollStoryV2() {
  const clockBgRef = useRef(null);
  const corridorBgRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndRef = useRef(null);
  const headerRef = useRef(null);
  const mlTextRef = useRef(null);
  const countdownRef = useRef(null);
  const mlSubRef = useRef(null);

  const [showCountdownInHeader, setShowCountdownInHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1440 : window.innerWidth
  );
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const isMobile = viewportWidth <= 768;
  const isCompactMobile = viewportWidth <= 480;
  const isVeryCompactMobile = viewportWidth <= 390;
  const mainHeaderBarHeight = isMobile ? 72 : 68;
  const headerTotalHeight = mainHeaderBarHeight;
  const logoEndSize = isMobile ? 34 : 42;
  const logoEndX = isMobile ? 16 : 48;
  const logoEndY = (mainHeaderBarHeight - logoEndSize) / 2;

  useEffect(() => {
    const interval = setInterval(() => {
      const targetDate = new Date("2026-04-25T16:00:00");
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile, menuOpen]);

  useEffect(() => {
    let winH = window.innerHeight;
    let winW = window.innerWidth;
    let ticking = false;
    let lastSy = 0;

    const onResize = () => {
      winH = window.innerHeight;
      winW = window.innerWidth;
    };
    window.addEventListener("resize", onResize, { passive: true });

    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const range = (p, a, b) => clamp((p - a) / (b - a), 0, 1);

    const update = () => {
      const sy = lastSy;
      const total = winH * TOTAL;
      const p = clamp(sy / total, 0, 1);

      if (clockBgRef.current) {
        const ty = -p * 22;
        const op = 1 - ease(range(p, 0.3, 0.56));
        clockBgRef.current.style.opacity = op;
        clockBgRef.current.style.transform = `translate3d(0, ${ty}%, 0)`;
      }

      if (corridorBgRef.current) {
        const op = ease(range(p, 0.3, 0.58));
        const ty = (1 - op) * 8;
        corridorBgRef.current.style.opacity = op;
        corridorBgRef.current.style.transform = `translate3d(0, ${ty}%, 0)`;
      }

      if (headerRef.current) {
        const hop = ease(range(p, 0.34, 0.46));
        headerRef.current.style.opacity = hop;
        headerRef.current.style.pointerEvents = hop > 0.5 ? "all" : "none";
      }

      if (countdownRef.current) {
        const rect = countdownRef.current.getBoundingClientRect();
        setShowCountdownInHeader(rect.top < winH * 0.5);
      }

      if (logoRef.current) {
        const lp = ease(range(p, 0.12, 0.44));
        const startSize = isMobile ? 80 : 96; // Slightly adjusted start size
        const size = startSize - lp * (startSize - logoEndSize);
        const startX = winW / 2 - startSize / 2;
        const startY = isMobile ? winH * 0.16 : winH * 0.22; // Moved up slightly to be "at the top"
        const x = startX + lp * (logoEndX - startX);
        const y = startY + lp * (logoEndY - startY);
        logoRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        logoRef.current.style.width = `${size}px`;
        logoRef.current.style.height = `${size}px`;
        logoRef.current.style.opacity = p > 0.46 ? 0 : 1;
      }

      if (contentRef.current) {
        const cp = ease(range(p, 0.1, 0.42));
        const op = Math.max(1 - cp * (isMobile ? 1.35 : 1.65), 0);
        const tx = cp * -winW * (isMobile ? 0.08 : 0.27);
        const ty = cp * -winH * (isMobile ? 0.22 : 0.36);
        const sc = 1 - cp * (isMobile ? 0.2 : 0.48);
        contentRef.current.style.opacity = op;
        contentRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`;
      }

      if (scrollIndRef.current) {
        scrollIndRef.current.style.opacity = Math.max(1 - ease(range(p, 0, 0.08)), 0);
      }

      if (mlTextRef.current) {
        if (p >= 0.68 && !mlTextRef.current.dataset.triggered) {
          mlTextRef.current.dataset.triggered = "true";
          mlTextRef.current.style.transition =
            "opacity 2.2s cubic-bezier(0.16,1,0.3,1), transform 2.4s cubic-bezier(0.16,1,0.3,1)";
          mlTextRef.current.style.opacity = 1;
          mlTextRef.current.style.transform = "translate3d(0, 0px, 0)";
        } else if (p < 0.68 && mlTextRef.current.dataset.triggered) {
          mlTextRef.current.dataset.triggered = "";
          mlTextRef.current.style.transition = "opacity 0.6s ease, transform 0.6s ease";
          mlTextRef.current.style.opacity = 0;
          mlTextRef.current.style.transform = "translate3d(0, 80px, 0)";
        }
      }

      if (countdownRef.current) {
        if (p >= 0.72 && !countdownRef.current.dataset.triggered) {
          countdownRef.current.dataset.triggered = "true";
          countdownRef.current.style.transition =
            "opacity 2s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 2s cubic-bezier(0.16,1,0.3,1) 0.3s";
          countdownRef.current.style.opacity = 1;
          countdownRef.current.style.transform = "translate3d(0, 0px, 0)";
        } else if (p < 0.72 && countdownRef.current.dataset.triggered) {
          countdownRef.current.dataset.triggered = "";
          countdownRef.current.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          countdownRef.current.style.opacity = 0;
          countdownRef.current.style.transform = "translate3d(0, 32px, 0)";
        }
      }

      if (mlSubRef.current) {
        if (p >= 0.76 && !mlSubRef.current.dataset.triggered) {
          mlSubRef.current.dataset.triggered = "true";
          mlSubRef.current.style.transition =
            "opacity 2s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 2s cubic-bezier(0.16,1,0.3,1) 0.5s";
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
  }, [isMobile, logoEndSize, logoEndX, logoEndY]);

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: `${headerTotalHeight}px`,
          background: "rgba(6,2,0,0.985)", // More opaque for better visibility
          borderBottom: "1px solid rgba(201,168,76,0.22)", // Slightly stronger border
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          padding: 0,
          zIndex: 200,
          opacity: 0,
          pointerEvents: "none",
          backdropFilter: "blur(18px)", // Enhanced blur
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.4)", // Added shadow for visibility
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "0 14px" : "0 48px",
            gap: isMobile ? "10px" : "32px",
            minHeight: `${mainHeaderBarHeight}px`,
            flexShrink: 0,
          }}
        >
        <a
          href="#top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "10px" : "16px",
            minWidth: 0,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src={SRCC_LOGO}
            alt="SRCC"
            style={{
              width: isMobile ? "34px" : "40px",
              height: isMobile ? "34px" : "40px",
              flexShrink: 0,
              objectFit: "contain",
              filter: "drop-shadow(0 0 8px rgba(201,168,76,0.3))",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: isMobile ? (isVeryCompactMobile ? "11px" : "12px") : "17px",
                letterSpacing: isMobile ? (isVeryCompactMobile ? "0.06em" : "0.08em") : "0.15em",
                color: "#E2E6ED",
                textTransform: "uppercase",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              The Placement Cell
            </span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: isMobile ? (isVeryCompactMobile ? "7.5px" : "8px") : "11.5px",
                letterSpacing: isMobile ? (isVeryCompactMobile ? "0.04em" : "0.06em") : "0.10em",
                color: "#C9A84C",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "2px",
                whiteSpace: "nowrap",
              }}
            >
              Shri Ram College of Commerce
            </span>
          </div>
          <img
            src={MIXER_LOGO}
            alt="Mixer Logo"
            style={{
              width: isMobile ? (isVeryCompactMobile ? "28px" : "32px") : "57px",
              height: isMobile ? (isVeryCompactMobile ? "28px" : "32px") : "57px",
              objectFit: "contain",
              flexShrink: 0,
              marginLeft: isMobile ? "0" : "-3px",
              filter: "drop-shadow(0 0 10px rgba(201,168,76,0.35))",
            }}
          />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "3rem", minWidth: 0 }}>
          {isMobile ? (
            <>
              <div
                style={{
                  opacity: showCountdownInHeader && !isVeryCompactMobile ? 1 : 0,
                  transform: `translateY(${showCountdownInHeader ? "0px" : "4px"})`,
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  fontFamily: "'Cinzel', serif",
                  fontSize: isCompactMobile ? "10px" : "12px",
                  color: "#C9A84C",
                  letterSpacing: isCompactMobile ? "0.04em" : "0.08em",
                  whiteSpace: "nowrap",
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                {`${String(countdown.days).padStart(2, "0")}:${String(countdown.hours).padStart(
                  2,
                  "0"
                )}:${String(countdown.minutes).padStart(2, "0")}:${String(countdown.seconds).padStart(2, "0")}`}
              </div>
              <button
                type="button"
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                className={`mobile-menu-button${menuOpen ? " mobile-menu-button-open" : ""}`}
                onClick={() => setMenuOpen((open) => !open)}
                style={{
                  width: isVeryCompactMobile ? "42px" : "44px",
                  height: isVeryCompactMobile ? "42px" : "44px",
                  flexShrink: 0,
                }}
              >
                <span />
                <span />
                <span />
              </button>
            </>
          ) : (
            <>
              {!isCompactMobile && (
                <div
                  style={{
                    opacity: showCountdownInHeader ? 1 : 0,
                    transition: "opacity 0.5s",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "19px", // Slightly bigger
                    color: "#C9A84C",
                    letterSpacing: "0.12em",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                  }}
                >
                  {`${String(countdown.days).padStart(2, "0")}:${String(countdown.hours).padStart(
                    2,
                    "0"
                  )}:${String(countdown.minutes).padStart(2, "0")}:${String(countdown.seconds).padStart(2, "0")}`}
                </div>
              )}
              <nav style={{ display: "flex", gap: "36px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <a href="#mixer" className="nav-link" style={{ fontSize: "11px" }}>
                  Memory Lane
                </a>
                <a href={MEMORY_WALL_PAGE} className="nav-link" style={{ fontSize: "11px" }}>
                  Memory Wall
                </a>
                <a href={BIRDSEYE_PAGE} className="nav-link" style={{ fontSize: "11px" }}>
                  Birdseye
                </a>
                <a href={GALLERY_PAGE} className="nav-link" style={{ fontSize: "11px" }}>
                  PC Gallery
                </a>
              </nav>
            </>
          )}
        </div>
        </div>
      </header>

      {isMobile && (
        <div
          className={`mobile-menu-panel${menuOpen ? " mobile-menu-panel-open" : ""}`}
          style={{ top: `${headerTotalHeight}px` }}
        >
          <a href="#mixer" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            Memory Lane
          </a>
          <a href={MEMORY_WALL_PAGE} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            Memory Wall
          </a>
          <a href={BIRDSEYE_PAGE} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            Birdseye
          </a>
          <a href={GALLERY_PAGE} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            PC Gallery
          </a>
        </div>
      )}

      <div
        id="top"
        ref={logoRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "88px",
          height: "88px",
          zIndex: 150,
          pointerEvents: "none",
          willChange: "transform, width, height, opacity",
          transform: "translate3d(0,0,0)",
        }}
      >
        <img
          src={SRCC_LOGO}
          alt="SRCC"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 0 14px rgba(201,168,76,0.22)) brightness(1.05)",
          }}
        />
      </div>

      <div style={{ height: `${TOTAL * 100}vh`, position: "relative" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          <div
            ref={clockBgRef}
            style={{
              position: "absolute",
              inset: "-20% 0 -20% 0",
              zIndex: 0,
              overflow: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${BG_CLOCK}')`,
                backgroundSize: "cover",
                backgroundPosition: isMobile ? "center center" : "center 50%",
                filter: "sepia(0.5) brightness(0.65) contrast(.98)",
                transform: "translate3d(0,0,0)",
              }}
            />
          </div>

          <div
            ref={corridorBgRef}
            style={{
              position: "absolute",
              inset: "-20% 0 -20% 0",
              zIndex: 0,
              overflow: "hidden",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${BG_CORRIDOR}')`,
                backgroundSize: "cover",
                backgroundPosition: isMobile ? "center 42%" : "center 50%",
                filter: "sepia(0.5) brightness(0.45) contrast(1.05)",
                transform: "translate3d(0,0,0)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "radial-gradient(ellipse at 50% 36%, transparent 10%, rgba(2,1,0,0.44) 52%, rgba(1,0,0,0.9) 100%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(201,168,76,0.018) 60px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "0 18px" : "0 24px",
              marginTop: isMobile ? "-7vh" : "-2vh",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ height: isMobile ? "16px" : "32px" }} />
            <div
              ref={contentRef}
              style={{
                willChange: "transform, opacity",
                transformOrigin: "center center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? "6px" : "12px",
                maxWidth: isMobile ? "320px" : "none",
                transform: "translate3d(0,0,0)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                <div
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: isMobile ? "clamp(16px, 6.5vw, 22px)" : "clamp(20px, 3.4vw, 42px)",
                    color: "#DDE3ED",
                    letterSpacing: isMobile ? "0.07em" : "0.12em",
                    lineHeight: 1.2,
                    fontWeight: 400,
                    textTransform: "uppercase",
                    textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                  }}
                >
                  The Placement Cell
                </div>
                <div
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: isMobile ? "clamp(9px, 3.2vw, 12px)" : "clamp(12px, 2vw, 24px)",
                    color: "rgba(221,227,237,0.78)",
                    letterSpacing: isMobile ? "0.1em" : "0.18em",
                    lineHeight: 1.2,
                    fontWeight: 400,
                    textTransform: "uppercase",
                    textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                  }}
                >
                  Shri Ram College of Commerce
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px" }}>
                <div
                  style={{
                    width: isMobile ? "34px" : "80px",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, #C9A84C)",
                  }}
                />
                <span style={{ color: "#C9A84C", fontSize: isMobile ? "10px" : "13px" }}>✦</span>
                <div
                  style={{
                    width: isMobile ? "34px" : "80px",
                    height: "1px",
                    background: "linear-gradient(90deg, #C9A84C, transparent)",
                  }}
                />
              </div>

              <div
                style={{
                  fontFamily: "'Pinyon Script', cursive",
                  fontSize: isMobile ? "clamp(24px, 10vw, 38px)" : "clamp(30px, 5vw, 56px)",
                  color: "#C9A84C",
                  textShadow: "0 0 30px rgba(201,168,76,0.55), 0 2px 10px rgba(0,0,0,0.9)",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                30 Years of Excellence
              </div>
            </div>
          </div>

          <div
            ref={scrollIndRef}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            style={{
              position: "absolute",
              bottom: isMobile ? "28px" : "50px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              zIndex: 10,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: isMobile ? "8px" : "9px",
                letterSpacing: isMobile ? "0.24em" : "0.4em",
                color: "#C9A84C",
                textTransform: "uppercase",
                textShadow: "0 0 10px rgba(201,168,76,0.5)",
              }}
            >
              Scroll to Enter
            </span>
            <div
              style={{
                width: "1px",
                height: isMobile ? "28px" : "36px",
                background: "linear-gradient(180deg, rgba(201,168,76,0.8), transparent)",
                animation: "bounce 1.9s ease-in-out infinite",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 5,
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              id="alumni-mixer-text"
              style={{
                textAlign: "center",
                padding: isMobile ? "0 18px" : "0 24px",
                maxWidth: isMobile ? "360px" : "none",
              }}
            >
              <div
                ref={mlTextRef}
                style={{
                  fontFamily: "'Pinyon Script', cursive",
                  fontSize: isMobile ? "clamp(30px, 11vw, 44px)" : "clamp(45px, 8.5vw, 80px)",
                  color: "#F6E8BC",
                  textShadow: "0 0 55px rgba(201,168,76,0.38), 0 4px 32px rgba(0,0,0,0.98)",
                  lineHeight: 1,
                  opacity: 0,
                  transform: "translate3d(0, 80px, 0)",
                  willChange: "transform, opacity",
                }}
              >
                Alumni Mixer 3.0
              </div>

              <div
                ref={countdownRef}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
                  gap: isCompactMobile ? "0.65rem" : isMobile ? "0.9rem" : "2rem",
                  marginTop: isMobile ? "1rem" : "2rem",
                  fontFamily: "'Cinzel', serif",
                  opacity: 0,
                  transform: "translate3d(0, 32px, 0)",
                  willChange: "transform, opacity",
                }}
              >
                {[
                  { value: countdown.days, label: "Days" },
                  { value: countdown.hours, label: "Hours" },
                  { value: countdown.minutes, label: "Minutes" },
                  { value: countdown.seconds, label: "Seconds" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      minWidth: isMobile ? "0" : "104px",
                      padding: isMobile ? "12px 8px 10px" : "0",
                      border: isMobile ? "1px solid rgba(201,168,76,0.16)" : "none",
                      background: isMobile ? "rgba(8, 4, 1, 0.36)" : "transparent",
                      backdropFilter: isMobile ? "blur(6px)" : "none",
                      borderRadius: isMobile ? "6px" : "0",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: isCompactMobile ? "1.8rem" : isMobile ? "2.1rem" : "3rem",
                        color: "#F6E8BC",
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </span>
                    <span
                      style={{
                        display: "block",
                        color: "rgba(218, 224, 234, 0.6)",
                        fontSize: isMobile ? "0.58rem" : "0.8rem",
                        letterSpacing: isMobile ? "0.1em" : "0.2em",
                        textTransform: "uppercase",
                        marginTop: "4px",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                ref={mlSubRef}
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: isMobile ? "clamp(10px, 3.4vw, 13px)" : "clamp(13px, 1.6vw, 17px)",
                  color: "#C8CDD6",
                  marginTop: isMobile ? "16px" : "28px",
                  letterSpacing: isMobile ? "0.03em" : "0.07em",
                  lineHeight: 1.6,
                  opacity: 0,
                  transform: "translate3d(0, 32px, 0)",
                  willChange: "transform, opacity",
                }}
              >
                25 April 2026 • 4:00 P.M. • PB Lawns, SRCC
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
