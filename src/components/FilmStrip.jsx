import { useEffect, useRef, useState } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const photoFiles = [
  "past-photos/Amba_0020.JPG",
  "past-photos/Amba_0056.JPG",
  "past-photos/Amba_0060.JPG",
  "past-photos/Amba_0118.JPG",
  "past-photos/Amba_0138.JPG",
  "past-photos/Amba_0238.JPG",
  "past-photos/Amba_0302.JPG",
  "past-photos/Amba_0471.JPG",
];

const edition2 = [photoFiles[0], photoFiles[1], photoFiles[2]];
const edition1 = [photoFiles[3], photoFiles[4], photoFiles[5]];

function CollageColumn({ title, photos, isMobile, reverseStagger = false }) {
  // Hardcoded asymmetrical layouts
  const layouts = [
    { top: "5%", left: "5%", width: "65%", height: "55%", zIndex: 1, baseDelay: 0.1 },
    { top: "45%", left: "40%", width: "55%", height: "50%", zIndex: 3, baseDelay: 0.3 },
    { top: "15%", left: "60%", width: "35%", height: "35%", zIndex: 2, baseDelay: 0.5 },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h3 style={{
        fontFamily: "'Cinzel', serif",
        color: "#C9A84C",
        fontSize: isMobile ? "14px" : "18px",
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: isMobile ? "24px" : "40px",
        opacity: 0, // for animation
        transform: "translateY(20px)",
        className: "collage-title"
      }}>
        {title}
      </h3>
      
      <div style={{ position: "relative", width: "100%", aspectRatio: isMobile ? "1 / 1.1" : "3 / 4" }}>
        {photos.map((src, i) => {
          const l = layouts[i];
          const stagger = reverseStagger ? l.baseDelay + 0.4 : l.baseDelay;
          
          return (
            <div
              key={i}
              className="collage-item"
              style={{
                position: "absolute",
                top: l.top,
                left: l.left,
                width: l.width,
                height: l.height,
                zIndex: l.zIndex,
                // floating animation setup
                animationDelay: `${i * 1.5}s`,
                transitionDelay: `${stagger}s`,
              }}
            >
              <div 
                className="collage-photo-inner"
                style={{
                  width: "100%", 
                  height: "100%", 
                  boxShadow: "0 24px 50px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(201,168,76,0.3)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "#050200"
                }}
              >
                <img 
                  src={assetUrl(src)} 
                  alt={title}
                  style={{
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    filter: "sepia(0.6) saturate(0.6) hue-rotate(-10deg) brightness(0.65) contrast(1.1)",
                    transition: "filter 0.5s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "sepia(0.2) saturate(1.1) brightness(0.9) contrast(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "sepia(0.6) saturate(0.6) hue-rotate(-10deg) brightness(0.65) contrast(1.1)";
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FilmStrip() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );
  const sectionRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("collage-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0.1 });
    
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #0A0500 0%, #050200 50%, #0A0500 100%)",
        width: "100%",
        padding: isMobile ? "64px 20px 80px" : "120px 40px 140px",
        overflow: "hidden",
        borderTop: "1px solid rgba(201,168,76,0.06)",
        borderBottom: "1px solid rgba(201,168,76,0.06)",
      }}
    >
      <style>{`
        /* Start States */
        .collage-title {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .collage-item {
          opacity: 0;
          transform: translateY(80px) scale(0.95);
          will-change: transform, opacity;
          transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Visible States (Triggered by intersection observer) */
        .collage-visible .collage-title {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .collage-visible .collage-item {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
          /* Start floating right after snapping into place */
          animation: floatBreathing 6s infinite ease-in-out alternate;
        }
        
        .collage-visible .collage-photo-inner {
           transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .collage-visible .collage-item:hover .collage-photo-inner {
           transform: scale(1.05); /* Slight zoom on hover without breaking layout */
           z-index: 10;
        }

        @keyframes floatBreathing {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-12px) scale(1); }
        }
      `}</style>
      
      {/* Heavy Title Block */}
      <div style={{ textAlign: "center", marginBottom: isMobile ? "50px" : "80px", position: "relative", zIndex: 10 }}>
        <h2 className="collage-title" style={{
           fontFamily: "'Pinyon Script', cursive",
           fontSize: isMobile ? "56px" : "86px",
           color: "#D9B14A",
           margin: 0,
           lineHeight: 1,
           textShadow: "0 0 30px rgba(212, 175, 55, 0.4), 0 4px 18px rgba(0,0,0,0.8)"
        }}>
          The Past Editions
        </h2>
        <p className="collage-title" style={{
           fontFamily: "'Cinzel', serif",
           color: "rgba(220, 215, 200, 0.8)",
           letterSpacing: "0.22em",
           fontSize: isMobile ? "9px" : "12px",
           textTransform: "uppercase",
           marginTop: "12px",
           transitionDelay: "0.15s",
           textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)"
        }}>
          A Glance Into History
        </p>
      </div>

      {/* Editorial Split Layout */}
      <div style={{
         display: "flex", 
         flexDirection: isMobile ? "column" : "row",
         maxWidth: "1180px",
         margin: "0 auto",
         gap: isMobile ? "64px" : "80px",
         position: "relative"
      }}>
        <CollageColumn title="Chapter I" photos={edition1} isMobile={isMobile} reverseStagger={false} />
        <CollageColumn title="Chapter II" photos={edition2} isMobile={isMobile} reverseStagger={true} />
      </div>
    </div>
  );
}
