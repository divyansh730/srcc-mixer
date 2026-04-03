import { useState, useMemo, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
  "past-photos/IMG_0306.JPG", "past-photos/IMG_0339.JPG",
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function PanPhoto({ src, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flexShrink: 0,
        height: isMobile ? "220px" : "380px",
        aspectRatio: "3/2",
        position: "relative",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid rgba(201,168,76,0.18)",
        boxShadow: isHovered 
          ? "0 18px 42px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.4)" 
          : "0 8px 24px rgba(0,0,0,0.6)",
        transformOrigin: "center center",
      }}
      animate={{
        scale: isHovered && !isMobile ? 1.05 : 1,
        y: isHovered && !isMobile ? -8 : 0,
        zIndex: isHovered ? 10 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <img
        src={assetUrl(src)}
        alt="Memory"
        draggable="false"
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: isHovered || isMobile
            ? "sepia(0) saturate(1.1) brightness(1.05) contrast(1.1)" 
            : "sepia(0.55) saturate(0.65) hue-rotate(-5deg) brightness(0.45) contrast(1.1)",
          transition: "filter 0.6s ease",
        }}
      />
      {/* Light Overlay Gradient */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)"
            : "radial-gradient(circle at center, transparent 20%, rgba(10,5,2,0.85) 100%)",
          transition: "background 0.6s ease",
          pointerEvents: "none"
        }}
      />
    </motion.div>
  );
}

export default function MemoryLaneGallery() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollMax, setScrollMax] = useState(0);

  // Get a large block of mixed photos for a long panning experience
  const displayPhotos = useMemo(() => shuffleArray(photoFiles).slice(0, 30), []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (trackRef.current && containerRef.current) {
        const trackW = trackRef.current.scrollWidth;
        const continerW = containerRef.current.offsetWidth;
        // The track extends left and right, so we calculate total movable distance
        setScrollMax(Math.max(0, trackW - continerW + 120)); // +120 for padding buffers
      }
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    // Slight delay to ensure images load layout
    setTimeout(onResize, 500); 
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mouse driven logic
  const rawX = useMotionValue(0.5); 
  const smoothXProgress = useSpring(rawX, { stiffness: 50, damping: 20, mass: 1 });
  const transX = useTransform(smoothXProgress, [0, 1], [40, -scrollMax]); // Starts slightly offset

  useEffect(() => {
    if (isMobile) return; 
    
    const handleMouseMove = (e) => {
      // Calculate where the mouse is horizontally on screen (0 to 1)
      const mousePct = e.clientX / window.innerWidth;
      // Map it to progress (reverse direction so panning feels natural)
      rawX.set(mousePct);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawX, isMobile]);

  return (
    <section
      id="memory-lane"
      ref={containerRef}
      style={{
        background: "linear-gradient(180deg, #060200 0%, #0A0500 20%, #0A0500 80%, #080300 100%)",
        padding: "80px 0 100px 0",
        position: "relative",
        borderTop: "1px solid rgba(201,168,76,0.08)",
        overflow: "hidden" 
      }}
    >
      {/* Decorative top background fade */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "150px", background: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent)", pointerEvents: "none", zIndex: 1 }} />

      {/* Floating Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: "clamp(44px, 8vw, 76px)",
          color: "#F6E8BC",
          margin: 0,
          marginBottom: "60px",
          textAlign: "center",
          textShadow: "0 4px 32px rgba(201,168,76,0.2), 0 2px 12px rgba(0,0,0,0.8)",
          lineHeight: 1.1,
          position: "relative",
          zIndex: 10,
        }}
      >
        The Past Editions
      </motion.h2>

      {/* Gallery Container */}
      <div style={{ position: "relative", zIndex: 5, padding: "20px 0" }}>
        {/* Edge Shadows for fade effect */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "120px", background: "linear-gradient(90deg, #0A0500, transparent)", zIndex: 20, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "120px", background: "linear-gradient(270deg, #0A0500, transparent)", zIndex: 20, pointerEvents: "none" }} />

        {isMobile ? (
          // On mobile, rely on native elegant horizontal scrolling 
          <div 
            ref={trackRef}
            style={{ 
              display: "flex", 
              gap: "16px", 
              overflowX: "auto", 
              overflowY: "hidden", 
              padding: "0 40px",
              scrollSnapType: "x mandatory"
            }}
          >
            {displayPhotos.map((src, i) => (
              <div key={i} style={{ scrollSnapAlign: "center" }}>
                <PanPhoto src={src} isMobile={true} />
              </div>
            ))}
          </div>
        ) : (
          // On Desktop, rely on the premium mouse-driven tracker
          <motion.div 
            ref={trackRef}
            style={{ 
              display: "flex", 
              gap: "24px", 
              width: "max-content", 
              padding: "0 40px",
              x: transX 
            }}
          >
            {displayPhotos.map((src, i) => (
              <PanPhoto key={i} src={src} isMobile={false} />
            ))}
          </motion.div>
        )}
      </div>

    </section>
  );
}
