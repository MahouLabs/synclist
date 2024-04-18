import { useEffect, useState } from "react";

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1400,
};

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function updateDimensions() {
      setWindowWidth(window.innerWidth);
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return windowWidth;
}
