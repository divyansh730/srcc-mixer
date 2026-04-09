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
      background: "#050200", // Deep rich dark color fitting the aesthetic
      borderTop: "1px solid rgba(201, 168, 76, 0.4)",
      boxShadow: "0 -8px 32px rgba(201, 168, 76, 0.08)",
      padding: isMobile ? "40px 20px 20px" : "60px 80px 30px",
      position: "relative",
      zIndex: 10,
      width: "100%",
      boxSizing: "border-box", // Prevents horizontal scroll locks
    }}>
      <div style={{
        maxWidth: "1180px",
        margin: "0 auto",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "center" : "flex-end",
        gap: "40px",
        textAlign: isMobile ? "center" : "left",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: isMobile ? "center" : "flex-start" }}>
          <div>
            <h3 style={{
              margin: 0,
              fontFamily: "'Cinzel', serif",
              fontSize: isMobile ? "18px" : "22px",
              fontWeight: 600,
              color: "#DDE3ED",
              letterSpacing: "0.15em",
              textTransform: "uppercase"
            }}>
              The Placement Cell
            </h3>
            <p style={{
              margin: "6px 0 0 0",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "15px",
              color: "rgba(201, 168, 76, 0.8)",
              letterSpacing: "0.08em",
              fontStyle: "italic"
            }}>
              Shri Ram College of Commerce
            </p>
          </div>
          <p style={{
            margin: "12px 0 0 0",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "15px",
            color: "rgba(226, 230, 237, 0.85)",
            letterSpacing: "0.05em",
            maxWidth: "340px",
            lineHeight: 1.5,
            fontStyle: "italic"
          }}>
            &quot;The future belongs to those who believe in the beauty of their dreams.&quot;<br />
            <span style={{ fontStyle: "normal", fontSize: "12px", opacity: 0.8, display: "block", marginTop: "4px" }}>— Eleanor Roosevelt</span>
          </p>
        </div>

        <div style={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : "flex-end",
          gap: "24px"
        }}>
          <div style={{ 
            display: "flex", 
            gap: isMobile ? "24px" : "32px",
            fontFamily: "'Cinzel', serif",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            color: "rgba(201, 168, 76, 0.9)",
            textTransform: "uppercase"
          }}>
            {["Instagram", "LinkedIn", "Facebook"].map(platform => (
              <a key={platform} href="#" style={{ 
                color: "inherit", 
                textDecoration: "none", 
                transition: "all 0.4s ease",
                position: "relative"
              }} 
                 onMouseEnter={(e) => {
                   e.currentTarget.style.color = "#FFF";
                   e.currentTarget.style.textShadow = "0 0 12px rgba(201,168,76,0.6)";
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.color = "rgba(201, 168, 76, 0.9)";
                   e.currentTarget.style.textShadow = "none";
                 }}>
                {platform}
              </a>
            ))}
          </div>

          <p style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "13px",
            color: "rgba(226, 230, 237, 0.3)",
            letterSpacing: "0.06em",
          }}>
            &copy; {new Date().getFullYear()} The Placement Cell, SRCC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
