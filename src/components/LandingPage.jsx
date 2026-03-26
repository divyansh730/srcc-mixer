import { useEffect, useRef, useState } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const landingOptions = [
  {
    id: "memory-wall",
    title: "Memory Wall",
    image: assetUrl("srcc-clock.jpg"),
    status: "Coming Soon",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in odio et arcu posuere viverra.",
  },
  {
    id: "pc-gallery",
    title: "PC Gallery",
    image: assetUrl("srcc-corridor.jpg"),
    status: "Coming Soon",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor sem id nunc interdum facilisis.",
  },
  {
    id: "quiz",
    title: "Quiz",
    image: assetUrl("srcc-clock.jpg"),
    status: "Coming Soon",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean varius ante ac eros tincidunt, non feugiat justo tempus.",
  },
];

export default function LandingPage() {
  const headingBlockRef = useRef(null);
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

  return (
    <section
      id="mixer"
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #0D0602 100%)",
        minHeight: "100vh",
        position: "relative",
        padding: isMobile ? "88px 18px 64px" : "110px 40px 90px",
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
        <div ref={headingBlockRef} className="landing-heading-block">
          <div className="landing-heading-rule" />
          <p className="landing-heading-kicker">Explore</p>
          <h2 className="landing-welcome-title">Welcome to Memory Lane</h2>
        </div>

        <div className="landing-grid">
          {landingOptions.map((option, index) => (
            <button
              key={option.id}
              id={option.id}
              type="button"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="landing-option-card"
              style={{
                "--landing-stagger": `${index * 220}ms`,
                backgroundImage: `url('${option.image}')`,
              }}
            >
              <div className="landing-option-surface">
                <div className="landing-option-base" />
                <div className="landing-option-content">
                  <h3>{option.title}</h3>
                </div>
                <div className={`landing-option-hover${isMobile ? " landing-option-hover-mobile" : ""}`}>
                  <span className="landing-option-hover-line" aria-hidden />
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: isMobile ? "9px" : "10px",
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
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
