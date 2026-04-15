import { useEffect, useRef, useState } from "react";
import FilmStrip from "./FilmStrip";
import HeroPhotoCollage from "./HeroPhotoCollage";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
const MEMORY_WALL_PAGE = `${import.meta.env.BASE_URL}memory-wall.html`;
const GALLERY_PAGE = `${import.meta.env.BASE_URL}pc-gallery.html`;
const ALUM_ENGAGEMENT_PAGE = `${import.meta.env.BASE_URL}alum-engagement.html`;
const SRCC_LOGO = assetUrl("srcc-logo.png");
const MIXER_LOGO = assetUrl("Mixer logo.png");
const BG_CLOCK = assetUrl("srcc-clock.jpg");
const BG_CORRIDOR = assetUrl("srcc-corridor.jpg");

const TOTAL = 7;

export default function ScrollStoryV2() {
  const clockBgRef = useRef(null);
  const corridorBgRef = useRef(null);
  const corridorOverlayRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndRef = useRef(null);
  const headerRef = useRef(null);
  const mlTextRef = useRef(null);
  const countdownRef = useRef(null);
  const mlSubRef = useRef(null);
  const dialBgRef = useRef(null);
  const revealRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const ring4Ref = useRef(null);
  const ring5Ref = useRef(null);
  const outTickRef = useRef(null);
  const inTickRef = useRef(null);
  const placeholderRef = useRef(null);
  const baseLogoMetricsRef = useRef({ x: 0, y: 0, size: 0 });

  const [showCountdownInHeader, setShowCountdownInHeader] = useState(false);
  const showCountdownInHeaderRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1440 : window.innerWidth
  );
  const [showDialSVG, setShowDialSVG] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const countdownRef_state = useRef({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const scrollActivityRef = useRef(null);
  const lastScrollTimeRef = useRef(0);

  const isMobile = viewportWidth <= 768;
  const isCompactMobile = viewportWidth <= 480;
  const isVeryCompactMobile = viewportWidth <= 390;
  const mainHeaderBarHeight = isMobile ? 72 : 68;
  const headerTotalHeight = mainHeaderBarHeight;
  const logoEndSize = isMobile ? 34 : 42;
  const logoEndX = isMobile ? 16 : 48;
  const logoEndY = (mainHeaderBarHeight - logoEndSize) / 2;

  useEffect(() => {
    showCountdownInHeaderRef.current = showCountdownInHeader;
  }, [showCountdownInHeader]);

  useEffect(() => {
    const interval = setInterval(() => {
      const targetDate = new Date("2026-04-25T16:00:00");
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      const newCountdown = { days: d, hours: h, minutes: m, seconds: s };
      countdownRef_state.current = newCountdown;
      setCountdown(newCountdown);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowDialSVG(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (dialBgRef.current) {
      observer.observe(dialBgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const measureLogoPlaceholder = () => {
      if (!placeholderRef.current || !contentRef.current) return;

      const parent = contentRef.current;
      const oldTransform = parent.style.transform;
      parent.style.transform = 'translate3d(0,0,0) scale(1)';

      const rect = placeholderRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        baseLogoMetricsRef.current = { x: rect.left, y: rect.top, size: rect.width };
      }

      parent.style.transform = oldTransform;
    };

    measureLogoPlaceholder();
    const t1 = setTimeout(measureLogoPlaceholder, 100);
    const t2 = setTimeout(measureLogoPlaceholder, 500);
    const t3 = setTimeout(measureLogoPlaceholder, 1000);

    window.addEventListener('resize', measureLogoPlaceholder);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener('resize', measureLogoPlaceholder);
    };
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile, menuOpen]);

  useEffect(() => {
    let winH = window.innerHeight;
    let winW = window.innerWidth;
    let lastSy = 0;
    let animId;
    let lastTime = performance.now();
    let rafPending = false;
    let needsUpdate = true;
    const SCROLL_THROTTLE = 80; // Increased from 50 to reduce updates
    const speeds = { r1: 2.5, r2: -3.8, r3: 1.8, r4: -1.2, r5: 4.2, out: -2.0, inn: 3.0 };
    const perp = { r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, out: 0, inn: 0 };
    let lastRenderedSy = -1;
    let isScrolling = false;
    let scrollTimeout;
    const onResize = () => { winH = window.innerHeight; winW = window.innerWidth; };
    window.addEventListener("resize", onResize, { passive: true });
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const range = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      
      // Only update perpetual rotation when NOT actively scrolling
      if (needsUpdate && !isScrolling) {
        perp.r1 += speeds.r1 * dt; perp.r2 += speeds.r2 * dt; perp.r3 += speeds.r3 * dt;
        perp.r4 += speeds.r4 * dt; perp.r5 += speeds.r5 * dt; perp.out += speeds.out * dt; perp.inn += speeds.inn * dt;
      }
      
      const sy = lastSy;
      const scrollDiff = Math.abs(sy - lastRenderedSy);
      
      // Only re-render scroll-dependent elements if scroll moved enough
      if (scrollDiff > SCROLL_THROTTLE || needsUpdate) {
        lastRenderedSy = sy;
        const total = winH * TOTAL;
        const p = clamp(sy / total, 0, 1);
        if (clockBgRef.current) {
          const ty = -p * 22;
          const op = 1 - Math.min(ease(range(p, 0.25, 0.45)), 1);
          clockBgRef.current.style.opacity = op;
          clockBgRef.current.style.transform = `translate3d(0, ${ty}%, 0)`;
        }
        if (dialBgRef.current) {
          const inOp = ease(range(p, 0.35, 0.50));
          const outOpOp = ease(range(p, 0.70, 0.80));
          const currentOp = Math.min(inOp, 1) * (1 - outOpOp);
          const expandP = range(p, 0.52, 0.82);
          const sc = 1 + (expandP * expandP) * 14;
          dialBgRef.current.style.opacity = currentOp;
          dialBgRef.current.style.visibility = currentOp <= 0 ? "hidden" : "visible";
          dialBgRef.current.style.transform = `translate3d(0,0,0) scale3d(${sc}, ${sc}, 1)`;
          
          // Only update dial rotations if visible
          if (currentOp > 0.01) {
            const sr1 = p * 90, sr2 = -p * 130, sr3 = p * 170;
            const sr4 = -p * 60, sr5 = p * 200, srOut = -p * 140, srIn = p * 180;
            if (ring1Ref.current) ring1Ref.current.style.transform = `translate3d(0,0,0) rotate(${perp.r1 + sr1}deg)`;
            if (ring2Ref.current) ring2Ref.current.style.transform = `translate3d(0,0,0) rotate(${perp.r2 + sr2}deg)`;
            if (ring3Ref.current) ring3Ref.current.style.transform = `translate3d(0,0,0) rotate(${perp.r3 + sr3}deg)`;
            if (ring4Ref.current) ring4Ref.current.style.transform = `translate3d(0,0,0) rotate(${perp.r4 + sr4}deg)`;
            if (ring5Ref.current) ring5Ref.current.style.transform = `translate3d(0,0,0) rotate(${perp.r5 + sr5}deg)`;
            if (outTickRef.current) outTickRef.current.style.transform = `translate3d(0,0,0) rotate(${perp.out + srOut}deg)`;
            if (inTickRef.current) inTickRef.current.style.transform = `translate3d(0,0,0) rotate(${perp.inn + srIn}deg)`;
          }
          
          if (revealRef.current) {
            const rawRevealOp = ease(range(p, 0.70, 0.82));
            const revealOp = rawRevealOp > 0.001 ? rawRevealOp : 0.001;
            const revealTy = 40 * (1 - ease(range(p, 0.70, 0.92)));
            revealRef.current.style.opacity = revealOp;
            revealRef.current.style.transform = `translate3d(0, ${revealTy}px, 0)`;
          }
        }
        if (headerRef.current) {
          const hop = ease(range(p, 0.30, 0.40));
          headerRef.current.style.opacity = hop;
          headerRef.current.style.pointerEvents = hop > 0.5 ? "all" : "none";
        }
        if (countdownRef.current && countdownRef.current.parentElement) {
          const rect = countdownRef.current.getBoundingClientRect();
          const shouldShow = rect.top < winH * 0.5;
          if (shouldShow !== showCountdownInHeaderRef.current) {
            showCountdownInHeaderRef.current = shouldShow;
            setShowCountdownInHeader(shouldShow);
          }
        }
        if (logoRef.current) {
          const lp = ease(range(p, 0.10, 0.40));
          const { x: startX, y: startY, size: startSize } = baseLogoMetricsRef.current;
          if (startSize > 0) {
            const size = startSize - lp * (startSize - logoEndSize);
            const x = startX + lp * (logoEndX - startX);
            const y = startY + lp * (logoEndY - startY);
            logoRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            logoRef.current.style.width = `${size}px`;
            logoRef.current.style.height = `${size}px`;
            logoRef.current.style.opacity = p > 0.42 ? 0 : 1;
          } else {
            logoRef.current.style.opacity = 0;
          }
        }
        if (contentRef.current) {
          const cp = ease(range(p, 0.08, 0.35));
          const op = Math.max(1 - cp * (isMobile ? 1.35 : 1.65), 0);
          const ty = cp * -winH * 0.20;
          contentRef.current.style.opacity = op;
          contentRef.current.style.transform = `translate3d(0, ${ty}px, 0) scale(1)`;
        }
        if (scrollIndRef.current) {
          const sop = 1 - ease(range(p, 0.05, 0.18));
          scrollIndRef.current.style.opacity = sop;
        }
         if (mlTextRef.current) {
           const inOp = ease(range(p, 0.46, 0.54));
           const outOpOp = ease(range(p, 0.66, 0.72));
           const finalOp = inOp * (1 - outOpOp);
           const ty = inOp < 1 ? 60 * (1 - inOp) : -60 * outOpOp;
           mlTextRef.current.style.transition = 'none';
           mlTextRef.current.style.opacity = finalOp;
           mlTextRef.current.style.transform = `translate3d(0, ${ty}px, 0)`;
         }
         if (corridorBgRef.current) {
           // Corridor background parallax: moves up smoothly with hero fade
           const corridorMoveStart = range(p, 0.10, 0.25);
           const corridorMoveFull = range(p, 0.25, 0.75);
           
           // Parallax: moves slower than hero fade (creates depth)
           const moveAmount = -corridorMoveStart * 50 - corridorMoveFull * 80;
           
           // Crossfade: fades in as hero fades out
           const heroFadeOut = ease(range(p, 0.25, 0.50));
           const corridorInOp = heroFadeOut;
           
           // Fades out much later and more gradually
           const fadeOutStart = range(p, 0.75, 0.95);
           const corridorOutOp = 1 - ease(fadeOutStart);
           const finalCorridorOp = corridorInOp * corridorOutOp;
           
           corridorBgRef.current.style.opacity = Math.min(finalCorridorOp, 1);
           corridorBgRef.current.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
           
           if (corridorOverlayRef.current) {
             corridorOverlayRef.current.style.opacity = Math.min(finalCorridorOp, 1);
             corridorOverlayRef.current.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
           }
         }
        if (countdownRef.current) {
          const inOp = ease(range(p, 0.48, 0.56));
          const outOpOp = ease(range(p, 0.67, 0.73));
          const finalOp = inOp * (1 - outOpOp);
          const ty = inOp < 1 ? 40 * (1 - inOp) : -40 * outOpOp;
          countdownRef.current.style.transition = 'none';
          countdownRef.current.style.opacity = finalOp;
          countdownRef.current.style.transform = `translate3d(0, ${ty}px, 0)`;
        }
        if (mlSubRef.current) {
          const inOp = ease(range(p, 0.50, 0.58));
          const outOpOp = ease(range(p, 0.68, 0.74));
          const finalOp = inOp * (1 - outOpOp);
          const ty = inOp < 1 ? 40 * (1 - inOp) : -40 * outOpOp;
          mlSubRef.current.style.transition = 'none';
          mlSubRef.current.style.opacity = finalOp;
          mlSubRef.current.style.transform = `translate3d(0, ${ty}px, 0)`;
        }
      }
      
      needsUpdate = false;
      rafPending = false;
      animId = requestAnimationFrame(render);
    };
    const onScroll = () => { 
      lastSy = window.scrollY;
      needsUpdate = true;
      isScrolling = true;
      lastScrollTimeRef.current = performance.now();
      
      // Clear timeout and reset scrolling flag after scroll ends
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(scrollTimeout);
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
          background: "rgba(6,2,0,0.985)",
          borderBottom: "1px solid rgba(201,168,76,0.22)",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          padding: 0,
          zIndex: 200,
          opacity: 0,
          pointerEvents: "none",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
          willChange: "opacity, pointer-events",
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
                width: isMobile ? "46px" : "57px",
                height: isMobile ? "46px" : "57px",
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
                      transform: `translate3d(0, ${showCountdownInHeader ? "0px" : "4px"}, 0)`,
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
                  <a href={MEMORY_WALL_PAGE} className="nav-link" style={{ fontSize: "11px" }}>
                    Memory Wall
                  </a>
                  <a href={GALLERY_PAGE} className="nav-link" style={{ fontSize: "11px" }}>
                    PC Gallery
                  </a>
                  <a href={ALUM_ENGAGEMENT_PAGE} className="nav-link" style={{ fontSize: "11px" }}>
                    Alum Engagement
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
          <a href={MEMORY_WALL_PAGE} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            Memory Wall
          </a>
          <a href={GALLERY_PAGE} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            PC Gallery
          </a>
          <a href={ALUM_ENGAGEMENT_PAGE} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            Alum Engagement
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
            backgroundColor: "#000000",
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
            <HeroPhotoCollage />
          </div>

          <div
            ref={dialBgRef}
            style={{
              position: "absolute",
              inset: "-100vw -100vh", /* Huge inset so elements aren't clipped */
              zIndex: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              willChange: "transform, opacity",
              pointerEvents: "none",
              backfaceVisibility: "hidden",
            }}
          >
            <svg viewBox="0 0 1000 1000" style={{ width: "min(115vw, 115vh)", height: "min(115vw, 115vh)", overflow: "visible", maxWidth: "1200px", opacity: 0.75, display: showDialSVG ? "block" : "none" }}>
              {showDialSVG && (
                <>
                  <defs>
                <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="#C9A84C" stopOpacity="0" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.12" />
                </radialGradient>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2A1F00" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                </radialGradient>
                {/* Radial mask: center is transparent, outer rim is visible */}
                <radialGradient id="centerFade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="0" />
                  <stop offset="40%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="55%" stopColor="white" stopOpacity="0.7" />
                  <stop offset="70%" stopColor="white" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </radialGradient>
                <mask id="dialMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
                  <rect x="0" y="0" width="1000" height="1000" fill="url(#centerFade)" />
                </mask>
                <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="heavyGlow">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g mask="url(#dialMask)">
                {/* === OUTERMOST THICK BAND === */}
                <circle cx="500" cy="500" r="488" fill="none" stroke="#C9A84C" strokeWidth="4" strokeOpacity="0.25" />
                <circle ref={ring1Ref} cx="500" cy="500" r="480" fill="url(#ringGlow)" stroke="#C9A84C" strokeWidth="2" strokeOpacity="0.7" transform-origin="500px 500px" />
                <circle cx="500" cy="500" r="472" fill="none" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.3" />

                {/* === BEZEL TEETH — 120 fine + 12 bold hour marks === */}
                <g ref={outTickRef} transform-origin="500px 500px">
                  {Array.from({ length: 120 }).map((_, i) => {
                    const isHour = i % 10 === 0;
                    const isMajor = i % 5 === 0;
                    return (
                      <line
                        key={`bz-${i}`}
                        x1="500" y1={isHour ? "6" : isMajor ? "14" : "18"}
                        x2="500" y2={isHour ? "40" : isMajor ? "32" : "26"}
                        stroke="#C9A84C"
                        strokeWidth={isHour ? "3" : isMajor ? "1.8" : "0.7"}
                        strokeOpacity={isHour ? "1" : isMajor ? "0.7" : "0.3"}
                        transform={`rotate(${i * 3} 500 500)`}
                      />
                    );
                  })}
                  {/* Ornate fleur-de-lis at 12 positions */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <g key={`fl-${i}`} transform={`rotate(${i * 30} 500 500)`}>
                      <line x1="500" y1="42" x2="500" y2="62" stroke="#C9A84C" strokeWidth="2" />
                      <polygon points="495,62 500,72 505,62" fill="#C9A84C" fillOpacity="0.9" />
                      <path d="M495,58 Q490,52 493,47 Q496,53 500,56" fill="#C9A84C" fillOpacity="0.55" />
                      <path d="M505,58 Q510,52 507,47 Q504,53 500,56" fill="#C9A84C" fillOpacity="0.55" />
                      <circle cx="500" cy="44" r="1.5" fill="#C9A84C" fillOpacity="0.8" />
                    </g>
                  ))}
                </g>

                {/* === FILLED CHAPTER BAND (outer engraved ring) === */}
                <circle cx="500" cy="500" r="445" fill="none" stroke="#C9A84C" strokeWidth="3" strokeOpacity="0.6" />
                <circle ref={ring2Ref} cx="500" cy="500" r="430" fill="none" stroke="#C9A84C" strokeWidth="24" strokeOpacity="0.06" transform-origin="500px 500px" />
                <circle cx="500" cy="500" r="430" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.4" />
                <circle cx="500" cy="500" r="415" fill="none" stroke="#C9A84C" strokeWidth="3" strokeOpacity="0.6" />
                {/* Minute hash marks in the chapter band */}
                {Array.from({ length: 60 }).map((_, i) => (
                  <line
                    key={`ch-${i}`}
                    x1="500" y1="416" x2="500" y2={i % 5 === 0 ? "444" : "424"}
                    stroke="#C9A84C"
                    strokeWidth={i % 5 === 0 ? "1.5" : "0.5"}
                    strokeOpacity={i % 5 === 0 ? "0.8" : "0.35"}
                    transform={`rotate(${i * 6} 500 500)`}
                  />
                ))}

                {/* === ORNATE FILIGREE DOUBLE-RING === */}
                <circle ref={ring3Ref} cx="500" cy="500" r="380" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.5" transform-origin="500px 500px" />
                <circle cx="500" cy="500" r="360" fill="none" stroke="#C9A84C" strokeWidth="2.5" filter={isMobile ? "none" : "url(#goldGlow)"} strokeOpacity="0.85" />
                <circle cx="500" cy="500" r="340" fill="none" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.4" />
                {/* Filigree scrollwork around the 360 ring — 24 ornamental arcs */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const a1 = i * 15;
                  const a2 = a1 + 7.5;
                  const r = 360;
                  const rad1 = (a1 * Math.PI) / 180;
                  const rad2 = (a2 * Math.PI) / 180;
                  const x1 = 500 + r * Math.sin(rad1);
                  const y1 = 500 - r * Math.cos(rad1);
                  const x2 = 500 + (r + 14) * Math.sin(rad2);
                  const y2 = 500 - (r + 14) * Math.cos(rad2);
                  const x3 = 500 + r * Math.sin((a1 + 15) * Math.PI / 180);
                  const y3 = 500 - r * Math.cos((a1 + 15) * Math.PI / 180);
                  return (
                    <path
                      key={`sc-${i}`}
                      d={`M${x1},${y1} Q${x2},${y2} ${x3},${y3}`}
                      fill="none" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5"
                    />
                  );
                })}

                {/* === MIDDLE TRACK & DECORATIVE RING === */}
                <circle ref={ring4Ref} cx="500" cy="500" r="290" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.5" transform-origin="500px 500px" />
                <circle cx="500" cy="500" r="280" fill="none" stroke="#C9A84C" strokeWidth="16" strokeOpacity="0.04" />
                <circle cx="500" cy="500" r="270" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="2 6" strokeOpacity="0.35" />
                {/* Decorative dots around middle track */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const ang = (i * 10 * Math.PI) / 180;
                  return <circle key={`dot-${i}`} cx={500 + 280 * Math.sin(ang)} cy={500 - 280 * Math.cos(ang)} r={i % 3 === 0 ? "2.5" : "1.2"} fill="#C9A84C" fillOpacity={i % 3 === 0 ? "0.7" : "0.3"} />;
                })}

                {/* === INNER ORNATE COMPASS ROSE === */}
                <circle ref={ring5Ref} cx="500" cy="500" r="210" fill="none" stroke="#C9A84C" strokeWidth="2" strokeOpacity="0.6" filter={isMobile ? "none" : "url(#softGlow)"} transform-origin="500px 500px" />
                <circle cx="500" cy="500" r="195" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.3" />

                <g ref={inTickRef} transform-origin="500px 500px">
                  {/* 8-point sunburst with flanking spikes */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <g key={`sun-${i}`} transform={`rotate(${i * 45} 500 500)`}>
                      <line x1="500" y1="290" x2="500" y2="400" stroke="#C9A84C" strokeWidth="2.5" strokeOpacity="0.85" />
                      <line x1="500" y1="310" x2="500" y2="380" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.5" transform={`rotate(6 500 500)`} />
                      <line x1="500" y1="310" x2="500" y2="380" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.5" transform={`rotate(-6 500 500)`} />
                      <line x1="500" y1="330" x2="500" y2="360" stroke="#C9A84C" strokeWidth="0.6" strokeOpacity="0.3" transform={`rotate(12 500 500)`} />
                      <line x1="500" y1="330" x2="500" y2="360" stroke="#C9A84C" strokeWidth="0.6" strokeOpacity="0.3" transform={`rotate(-12 500 500)`} />
                    </g>
                  ))}
                  {/* Cardinal diamond arrowheads */}
                  {[0, 90, 180, 270].map((ang) => (
                    <polygon
                      key={`cd-${ang}`}
                      points="496,290 500,268 504,290 500,310"
                      fill="#C9A84C" fillOpacity="0.85"
                      transform={`rotate(${ang} 500 500)`}
                    />
                  ))}
                  {/* Intercardinal triangles */}
                  {[45, 135, 225, 315].map((ang) => (
                    <polygon
                      key={`ic-${ang}`}
                      points="498,300 500,285 502,300"
                      fill="#C9A84C" fillOpacity="0.5"
                      transform={`rotate(${ang} 500 500)`}
                    />
                  ))}
                </g>

                {/* === CENTER ORNAMENT (no filled disc) === */}
                <circle cx="500" cy="500" r="160" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.4" />
                <circle cx="500" cy="500" r="145" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="3 5" strokeOpacity="0.25" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`cm-${i}`} x1="500" y1="140" x2="500" y2="155" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.4" transform={`rotate(${i * 30} 500 500)`} />
                ))}
                <circle cx="500" cy="500" r="24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.6" />
                <circle cx="500" cy="500" r="6" fill="#C9A84C" fillOpacity="0.6" />
              </g>
            </>
              )}
            </svg>
          </div>

          <div
            ref={revealRef}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <FilmStrip />
            </div>
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
              margin: 0,
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ height: isMobile ? "8px" : "20px" }} />
            <div
              ref={contentRef}
              style={{
                willChange: "transform, opacity",
                transformOrigin: "center center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? "3px" : "8px",
                maxWidth: isMobile ? "min(94vw, 360px)" : "none",
                transform: "translate3d(0,0,0)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: isMobile ? "12px" : "28px",
                  justifyContent: "center",
                  marginBottom: isMobile ? "14px" : "32px",
                }}
              >
                <div ref={placeholderRef} style={{ marginTop: isMobile ? "0px" : "-10px", width: isMobile ? (isVeryCompactMobile ? "58px" : "62px") : "125px", height: isMobile ? (isVeryCompactMobile ? "58px" : "62px") : "125px", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? "1px" : "2px", textAlign: "center", position: "relative", left: isMobile ? "0" : "0.09em" }}>
                  <div
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: isMobile ? "clamp(21px, 6.4vw, 30px)" : "clamp(36px, 5.5vw, 68px)",
                      color: "#FDFDFD",
                      letterSpacing: isMobile ? "0.01em" : "0.03em",
                      lineHeight: 1,
                      fontWeight: 400,
                      textTransform: "uppercase",
                      textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    The Placement Cell
                  </div>
                  <div
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: isMobile ? "clamp(11px, 3.2vw, 14px)" : "clamp(16px, 2.5vw, 31px)",
                      color: "#FDFDFD",
                      letterSpacing: isMobile ? "0.07em" : "0.19em",
                      lineHeight: 1,
                      fontWeight: 400,
                      textTransform: "uppercase",
                      textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Shri Ram College of Commerce
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", width: "100%", alignItems: "center", gap: isMobile ? "6px" : "10px", marginTop: isMobile ? "0px" : "0px" }}>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, #C9A84C)",
                  }}
                />
                <span style={{ color: "#C9A84C", fontSize: isMobile ? "7px" : "12px", lineHeight: 1, paddingTop: "2px" }}>✦</span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "linear-gradient(90deg, #C9A84C, transparent)",
                  }}
                />
              </div>

              <div
                style={{
                  fontFamily: "'Pinyon Script', cursive",
                  fontSize: isMobile ? "clamp(28px, 8.8vw, 38px)" : "clamp(36px, 6vw, 66px)",
                  color: "#C9A84C",
                  textShadow: "0 0 30px rgba(201,168,76,0.55), 0 2px 10px rgba(0,0,0,0.9)",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                  marginTop: isMobile ? "10px" : "20px",
                  whiteSpace: "nowrap",
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
              transform: "translate3d(-50%, 0, 0)",
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
              ref={corridorBgRef}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${BG_CORRIDOR}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: 0,
                opacity: 0,
                willChange: "opacity, transform",
                filter: "brightness(0.58) contrast(1.12) saturate(1.1) sepia(0.28) hue-rotate(6deg)",
                minHeight: "120vh",
              }}
            />
            <div
              ref={corridorOverlayRef}
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)",
                zIndex: 1,
                pointerEvents: "none",
                opacity: 0,
                willChange: "opacity, transform",
              }}
            />
            <div
              id="alumni-mixer-text"
              style={{
                textAlign: "center",
                padding: isMobile ? "0 18px" : "0 24px",
                maxWidth: isMobile ? "360px" : "none",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                ref={mlTextRef}
                style={{
                  fontFamily: "'Pinyon Script', cursive",
                  fontSize: isMobile ? "clamp(30px, 11vw, 44px)" : "clamp(45px, 8.5vw, 80px)",
                  color: "#F6E8BC",
                  textShadow: "0 0 35px rgba(201,168,76,0.3), 0 3px 20px rgba(0,0,0,0.8)",
                  lineHeight: 1,
                  opacity: 0,
                  transform: "translate3d(0, 80px, 0)",
                  willChange: "transform, opacity",
                }}
              >
                Alumni Mixer 2026
              </div>

                <div
                   ref={countdownRef}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: isMobile ? "2rem" : "3rem",
                    marginTop: isMobile ? "2.8rem" : "4rem",
                    opacity: 0,
                    transform: "translate3d(0, 32px, 0)",
                    willChange: "transform, opacity",
                    padding: isMobile ? "0 16px" : "0",
                  }}
                >
                  {/* Elegant Countdown Timer Display */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: isMobile ? "1.2rem" : "2.2rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      { value: countdown.days, label: "Days" },
                      { value: countdown.hours, label: "Hrs" },
                      { value: countdown.minutes, label: "Min" },
                      { value: countdown.seconds, label: "Sec" },
                    ].map((item, idx) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {/* Golden divider between items */}
                        {idx > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              left: isMobile ? "-0.6rem" : "-1.1rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "1px",
                              height: isMobile ? "40px" : "60px",
                              background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)",
                              pointerEvents: "none",
                            }}
                          />
                        )}
                        
                        {/* Number Display */}
                        <div
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: isCompactMobile ? "2.2rem" : isMobile ? "2.6rem" : "4rem",
                            fontWeight: 700,
                            color: "#F6E8BC",
                            lineHeight: 1,
                            textShadow: "0 0 24px rgba(201, 168, 76, 0.35)",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {String(item.value).padStart(2, "0")}
                        </div>

                        {/* Label */}
                        <div
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: isCompactMobile ? "0.62rem" : isMobile ? "0.7rem" : "0.85rem",
                            color: "rgba(201, 168, 76, 0.6)",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative Element */}
                  <div
                    style={{
                      width: isMobile ? "80px" : "120px",
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
                      opacity: 0.7,
                    }}
                  />
                </div>

                <div
                  ref={mlSubRef}
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: isMobile ? "clamp(10px, 3.4vw, 12px)" : "clamp(12px, 1.4vw, 15px)",
                    color: "#C8CDD6",
                    marginTop: isMobile ? "16px" : "24px",
                    letterSpacing: isMobile ? "0.03em" : "0.08em",
                    lineHeight: 1.5,
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
