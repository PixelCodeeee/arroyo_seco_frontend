import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const FONT_SIZES = ["normal", "large", "xlarge"];

const FONT_SIZE_PX = {
  normal: "16px",
  large:  "19px",
  xlarge: "22px",
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "normal";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Cambia el font-size raíz del documento — todos los rem escalan automáticamente
    document.documentElement.style.fontSize = FONT_SIZE_PX[fontSize];
    document.documentElement.setAttribute("data-fontsize", fontSize);
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const cycleFontSize = () => {
    setFontSize((prev) => {
      const idx = FONT_SIZES.indexOf(prev);
      return FONT_SIZES[(idx + 1) % FONT_SIZES.length];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, cycleFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}