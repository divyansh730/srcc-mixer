import { useState, useEffect } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <footer style={{
      background: "linear-gradient(180deg, #1f1107 0%, #110702 100%)",
      borderTop: "2px solid rgba(201,168,76,0.35)",
      boxShadow: "0 -10px 40px rgba(0,0,0,0.4)",
      padding: isMobile ? "24px 20px 12px" : "32px 80px 16px",
      position: "relative",
      zIndex: 10,
    }}>
      <div style={{
        maxWidth: "1180px",
        margin: "0 auto",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: "40px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "18px",
            color: "#DDE3ED",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}>
            The Placement Cell
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "12px",
            color: "#C9A84C",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}>
            Shri Ram College of Commerce
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          gap: isMobile ? "24px" : "40px",
          fontFamily: "'Cinzel', serif",
          fontSize: "11px",
          letterSpacing: "0.15em",
          color: "rgba(226, 230, 237, 0.7)",
          textTransform: "uppercase"
        }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.3s" }} 
             onMouseEnter={(e) => e.target.style.color = "#C9A84C"}
             onMouseLeave={(e) => e.target.style.color = "rgba(226, 230, 237, 0.7)"}>Instagram</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.3s" }}
             onMouseEnter={(e) => e.target.style.color = "#C9A84C"}
             onMouseLeave={(e) => e.target.style.color = "rgba(226, 230, 237, 0.7)"}>LinkedIn</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.3s" }}
             onMouseEnter={(e) => e.target.style.color = "#C9A84C"}
             onMouseLeave={(e) => e.target.style.color = "rgba(226, 230, 237, 0.7)"}>Facebook</a>
        </div>
      </div>


    </footer>
  );
}
