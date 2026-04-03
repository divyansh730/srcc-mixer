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

export default function FilmStrip() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );
  
  // Pick exactly 18 photos for a dense cylinder
  const numItems = 18;
  const photos = useMemo(() => shuffleArray(photoFiles).slice(0, numItems), []);

  const sceneRef = useRef(null);
  const cylinderRef = useRef(null);
  
  const rotationRef = useRef(0);
  const dragStartRef = useRef(null);
  const isDraggingRef = useRef(false);
  const velocityRef = useRef(0.08); // Base continuous rotation speed
  const rAFRef = useRef(null);

  // Constants for 3D Geometry
  const itemWidth = isMobile ? 160 : 300; 
  const gap = isMobile ? 24 : 60;
  const chord = itemWidth + gap;
  const radius = Math.round( (chord / 2) / Math.tan(Math.PI / numItems) );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    
    const animate = () => {
      // Auto spin logic
      if (!isDraggingRef.current) {
         rotationRef.current += velocityRef.current;
         // Friction for manual swipes to slowly settle down to base velocity
         if (velocityRef.current > 0.08) {
             velocityRef.current = Math.max(0.08, velocityRef.current * 0.96);
         } else if (velocityRef.current < -0.08) {
             velocityRef.current = Math.min(-0.08, velocityRef.current * 0.96);
         } else {
             velocityRef.current = 0.08; 
         }
      }
      
      if (cylinderRef.current) {
        // Step back by radius so the front item is exactly at the screen plane
        cylinderRef.current.style.transform = `translateZ(${-radius}px) rotateY(${-rotationRef.current}deg)`;
      }
      
      rAFRef.current = requestAnimationFrame(animate);
    };
    
    rAFRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rAFRef.current);
    };
  }, [radius]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = e.clientX || (e.touches && e.touches[0].clientX);
    velocityRef.current = 0;
  };
  
  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - dragStartRef.current;
    
    // Convert drag pixels to rotation degrees
    const rotateDelta = deltaX * 0.15;
    rotationRef.current -= rotateDelta;
    velocityRef.current = -rotateDelta * 0.12; // Impart momentum
    
    dragStartRef.current = clientX;
  };
  
  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #0A0500 0%, #050200 50%, #0A0500 100%)",
        width: "100%",
        padding: isMobile ? "64px 0 80px" : "100px 0 120px",
        overflow: "hidden",
        borderTop: "1px solid rgba(201,168,76,0.06)",
        borderBottom: "1px solid rgba(201,168,76,0.06)",
      }}
    >
      {/* Title Block */}
      <div style={{ textAlign: "center", marginBottom: isMobile ? "50px" : "80px", position: "relative", zIndex: 10 }}>
        <h2 style={{
           fontFamily: "'Pinyon Script', cursive",
           fontSize: isMobile ? "56px" : "86px",
           color: "#D9B14A",
           margin: 0,
           lineHeight: 1,
           textShadow: "0 0 30px rgba(212, 175, 55, 0.4), 0 4px 18px rgba(0,0,0,0.8)"
        }}>
          The Past Editions
        </h2>
        <p style={{
           fontFamily: "'Cinzel', serif",
           color: "rgba(220, 215, 200, 0.8)",
           letterSpacing: "0.22em",
           fontSize: isMobile ? "9px" : "12px",
           textTransform: "uppercase",
           marginTop: "12px",
           textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)"
        }}>
          Spin the wheel of memories
        </p>
      </div>

      {/* 3D Scene */}
      <div 
        ref={sceneRef}
        style={{
          perspective: `${radius * 2.8}px`,
          position: "relative",
          height: isMobile ? "220px" : "380px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "pan-y", // Allow vertical native scroll, but block horizontal defaults
          cursor: "grab"
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          ref={cylinderRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transformStyle: "preserve-3d",
            willChange: "transform",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {photos.map((src, i) => {
            const angle = (360 / numItems) * i;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: `${itemWidth}px`,
                  height: isMobile ? "220px" : "380px",
                  // Push each item outwards matching the angle
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  // Golden styling for frames
                  borderRadius: "6px",
                  background: "#0A0500",
                  padding: isMobile ? "4px" : "6px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(201,168,76,0.3)",
                  backfaceVisibility: "hidden", // Items circling the back are hidden to prevent visual clutter
                  pointerEvents: "none", // Let the parent scene handle drag events cleanly
                }}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "2px",
                  overflow: "hidden"
                }}>
                  <img 
                    src={assetUrl(src)}
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "sepia(0.6) saturate(0.6) hue-rotate(-10deg) brightness(0.65) contrast(1.1)",
                    }}
                  />
                  {/* Subtle glass reflection overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
                    pointerEvents: "none"
                  }} />
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Deep shadows to create a hollow atmosphere on the cylinder's edges */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, #0A0500 0%, rgba(10,5,0,0.6) 15%, transparent 35%, transparent 65%, rgba(10,5,0,0.6) 85%, #0A0500 100%)",
          pointerEvents: "none"
        }} />
      </div>
    </div>
  );
}
