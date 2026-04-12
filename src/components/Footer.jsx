import { useState, useEffect } from "react";

export default function Footer() {
  const socialLinks = [
    {
      platform: "Instagram",
      href: "https://www.instagram.com/pcsrcc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      platform: "LinkedIn",
      href: "https://www.linkedin.com/company/the-placement-cell-srcc",
    },
    {
      platform: "YouTube",
      href: "https://www.youtube.com/@ThePlacementCellSRCC",
    },
  ];

  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const renderSocialIcon = (platform) => {
    const iconStyle = {
      width: isMobile ? "17px" : "18px",
      height: isMobile ? "17px" : "18px",
      display: "block",
      color: "currentColor",
      opacity: 0.92,
    };

    if (platform === "Instagram") {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={iconStyle} aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    }

    if (platform === "LinkedIn") {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={iconStyle} aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
          <line x1="8.4" y1="10" x2="8.4" y2="17" />
          <circle cx="8.4" cy="7.2" r="0.95" fill="currentColor" stroke="none" />
          <path d="M12.3 17v-4.2c0-1.5 1-2.3 2.1-2.3s2 .8 2 2.3V17" />
          <line x1="12.3" y1="10" x2="12.3" y2="17" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={iconStyle} aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="12" rx="3" />
        <polygon points="10,10 15.5,12 10,14" fill="currentColor" stroke="none" />
      </svg>
    );
  };

  return (
    <footer style={{
      background: "linear-gradient(180deg, rgba(10, 5, 0, 0.8) 0%, rgba(12, 6, 2, 0.95) 100%)",
      borderTop: "1px solid rgba(201, 168, 76, 0.25)",
      boxShadow: "inset 0 8px 24px rgba(0, 0, 0, 0.6), 0 -12px 40px rgba(201, 168, 76, 0.12)",
      padding: isMobile ? "40px 20px 24px" : "60px 80px 40px",
      position: "relative",
      zIndex: 10,
      width: "100%",
      boxSizing: "border-box",
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
        position: "relative",
        zIndex: 2,
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
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.14em",
            color: "rgba(201, 168, 76, 0.9)",
            textTransform: "uppercase"
          }}>
            {socialLinks.map(({ platform, href }) => (
              <a key={platform} href={href} target="_blank" rel="noopener noreferrer" style={{ 
                color: "inherit", 
                textDecoration: "none", 
                transition: "all 0.4s ease",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                minWidth: isMobile ? "72px" : "84px"
              }} 
                 onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FFF";
                    e.currentTarget.style.textShadow = "0 0 12px rgba(201,168,76,0.6)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(201, 168, 76, 0.9)";
                    e.currentTarget.style.textShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}>
                <span style={{
                  width: isMobile ? "34px" : "38px",
                  height: isMobile ? "34px" : "38px",
                  borderRadius: "50%",
                  border: "1px solid rgba(201,168,76,0.32)",
                  background: "radial-gradient(circle at 30% 25%, rgba(201,168,76,0.2), rgba(9,4,1,0.7))",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 16px rgba(0,0,0,0.32)",
                }}>
                  {renderSocialIcon(platform)}
                </span>
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
