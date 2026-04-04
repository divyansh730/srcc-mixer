import { useEffect, useRef, useState } from "react";

import BirdseyeSection from "./BirdseyeSection";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
const MEMORY_WALL_PAGE = `${import.meta.env.BASE_URL}memory-wall.html`;
const GALLERY_PAGE = `${import.meta.env.BASE_URL}pc-gallery.html`;

const landingOptions = [
  {
    id: "memory-wall",
    title: "Memory Wall",
    image: assetUrl("memory-wall-button.JPG"),
    status: "Open",
    description:
      "A wall of shared memories from alumni across decades - etch your own!",
    href: MEMORY_WALL_PAGE,
  },
  {
    id: "pc-gallery",
    title: "PC Gallery",
    image: assetUrl("gallery-button.JPG"),
    status: "Open",
    description:
      "A collection of The Placement Cell's memories - captured through the lens!",
    href: GALLERY_PAGE,
  },
  {
    id: "campus-birdseye",
    title: "T-10",
    image: assetUrl("srcc-aerial.jpg"),
    status: "Explore",
    description:
      "An aerial view of SRCC campus - revisit key locations and relive your memories!",
    href: "#birdseye",
  },
];

export default function LandingPage() {
  const headingBlockRef = useRef(null);
  const birdseyeHeadingRef = useRef(null);
  const birdseyeRef = useRef(null);
  const cardRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, landingOptions.length);

    const headingEl = headingBlockRef.current;
    const birdseyeHeadingEl = birdseyeHeadingRef.current;
    const birdseyeEl = birdseyeRef.current;
    const cardObserverOpts = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.08,
    };

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
    if (birdseyeHeadingEl) headingObserver.observe(birdseyeHeadingEl);
    if (birdseyeEl) headingObserver.observe(birdseyeEl);

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("landing-option-visible");
          cardObserver.unobserve(entry.target);
        }
      });
    }, cardObserverOpts);

    cardRefs.current.forEach((el) => {
      if (el) cardObserver.observe(el);
    });

    return () => {
      headingObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  const pulsePoints = [
    { top: "31.9%", left: "70%", title: "Nescafe Annex", subtitle: "The Hangout" },
    { top: "27%", left: "79%", title: "Library", subtitle: "Knowledge Centre" },
    { top: "40%", left: "9%", title: "Tute Block", subtitle: "Academic Block" },
    { top: "37%", left: "64%", title: "Library Lawns", subtitle: "Green Retreat" },
    { top: "45%", left: "95%", title: "Co-op", subtitle: "Cooperative Store" },
    { top: "50%", left: "52%", title: "Clock Tower", subtitle: "The Iconic" },
    { top: "55%", left: "35%", title: "PB Lawns", subtitle: "The Heart" },
    { top: "85%", left: "45%", title: "Statue Lawns", subtitle: "Heart of SRCC" },
  ];

  return (
    <section
      id="mixer"
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #0D0602 100%)",
        position: "relative",
        padding: isMobile ? "0px 16px 44px" : "0px 40px 60px",
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

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1180px", margin: "0 auto" }}>
        <div ref={headingBlockRef} className="landing-heading-block landing-heading-block--simple">
          <h2 className="landing-welcome-title">Welcome to Memory Lane</h2>
        </div>

        <div className="landing-grid">
          {landingOptions.map((option, index) => (
            <a
              key={option.id}
              id={option.id}
              href={option.href}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`landing-option-card${isMobile ? " landing-option-card-mobile" : ""}`}
              style={{
                "--landing-stagger": `${index * 220}ms`,
                backgroundImage: `url('${option.image}')`,
              }}
            >
              <div className="landing-option-surface">
                <div className="landing-option-base" />
                <div className="landing-option-content">
                  <h3>{option.title}</h3>
                  {isMobile && (
                    <>
                      <p
                        style={{
                          marginTop: "10px",
                          fontFamily: "'Cinzel', serif",
                          fontSize: "9px",
                          letterSpacing: "0.24em",
                          color: "rgba(201, 168, 76, 0.75)",
                          textTransform: "uppercase",
                        }}
                      >
                        {option.status}
                      </p>
                      <p
                        style={{
                          marginTop: "10px",
                          color: "rgba(244, 234, 210, 0.88)",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "15px",
                          lineHeight: 1.38,
                          maxWidth: "20em",
                        }}
                      >
                        {option.description}
                      </p>
                    </>
                  )}
                </div>
                <div className="landing-option-hover">
                  <span className="landing-option-hover-line" aria-hidden />
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(9px, 2.5vw, 10px)",
                      letterSpacing: "0.26em",
                      color: "rgba(201, 168, 76, 0.75)",
                      textTransform: "uppercase",
                    }}
                  >
                    {option.status}
                  </p>
                  <p>{option.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <BirdseyeSection />
    </section>
  );
}
