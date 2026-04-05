import React, { useEffect, useState } from "react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const photos = [
  "20190404_193521.jpg",
  "20190406_142113.jpg",
  "20190419_164112.jpg",
  "241597.jpeg",
  "6c46bf57-42b7-4b98-a735-0beb9e5127da.jpeg",
  "Copy of 1000084716.jpg",
  "Copy of 1000104776.jpg",
  "Copy of 1e1ca10e-1d7f-4742-9dc0-fd9544ebf739.jpg",
  "IMG-20170427-WA0003.jpg",
  "IMG-20170428-WA0021.jpg",
  "IMG-20240403-WA0005.jpg",
  "IMG-20240403-WA0007.jpg",
  "IMG-20240403-WA0008.jpg",
  "IMG-20240405-WA0008.jpg",
  "IMG-20240405-WA0013.jpg",
  "IMG-20240405-WA0014.jpg",
  "IMG-20240408-WA0012.jpg",
  "IMG-20240408-WA0013.jpg",
  "IMG-20240430-WA0099.jpg",
  "IMG-20240610-WA0332.jpg",
  "IMG-20241019-WA0054~2.jpg",
  "IMG-20241024-WA0020.jpg",
  "IMG-20250309-WA0045.jpg",
  "WhatsApp Image 2024-03-29 at 10.38.45 PM (2).jpeg",
  "WhatsApp Image 2024-03-29 at 10.39.52 PM (5).jpeg",
  "WhatsApp Image 2024-04-06 at 3.06.55 PM.jpeg",
  "WhatsApp Image 2024-04-11 at 11.50.19.jpeg",
  "WhatsApp Image 2024-04-11 at 11.56.18 AM (2).jpeg",
];

// Shuffle array once when the module loads
const shuffledPhotos = [...photos].sort(() => 0.5 - Math.random());

export default function HeroPhotoCollage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#020100",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-5%",
          left: "-5%",
          width: "110%",
          height: "110%",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(auto-fill, minmax(80px, 1fr))"
            : "repeat(auto-fill, minmax(140px, 1fr))",
          gridAutoRows: isMobile ? "80px" : "140px",
          gap: "2px",
          gridAutoFlow: "row",
          filter: "sepia(0.65) brightness(0.5) contrast(1.1) saturate(1.2)",
          opacity: 0.65, // Clearly visible but darkened to stay visually behind the text
        }}
      >
        {/* Repeat the shuffled array a few times to ensure we have enough images to cover any screen size without blowing them up */}
        {[...shuffledPhotos, ...shuffledPhotos, ...shuffledPhotos, ...shuffledPhotos].map((photo, i) => {
          return (
            <div
              key={i}
              style={{
                borderRadius: "2px",
                overflow: "hidden",
                backgroundColor: "#000",
              }}
            >
              <img
                src={assetUrl(`team-photos/${photo}`)}
                alt="Memory"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* OVERLAY: Radial vignette merging to darker edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(2,1,0,0.3) 85%, rgba(0,0,0,0.85) 1%)",
          pointerEvents: "none",
        }}
      />

      {/* OVERLAY: Linear gradient for blending top navigation and very bottom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
