import { useEffect } from "react";
import ScrollStoryV2 from "./components/ScrollStory_V2";
import FilmStrip from "./components/FilmStrip";
import LandingPage from "./components/LandingPage";

export default function AppV2() {
  useEffect(() => {
    const STORAGE_KEY = 'srcc_mixer_scroll_pos';
    
    // Restore scroll position
    const savedPos = localStorage.getItem(STORAGE_KEY);
    if (savedPos) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedPos, 10),
          behavior: 'smooth'
        });
      }, 500); // Give time for content to render
    }

    // Save scroll position (debounced)
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, window.scrollY);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <ScrollStoryV2 />
      <FilmStrip />
      <LandingPage />
    </>
  );
}
