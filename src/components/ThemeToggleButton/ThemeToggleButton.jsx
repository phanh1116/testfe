import { useTheme } from "@/provider/ThemeProvider";
import { useEffect } from "react";

import "./theme-toggle.css";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const storageKey = "theme";

  const getColorPreference = () => {
    if (localStorage.getItem(storageKey)) {
      return localStorage.getItem(storageKey);
    } else {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  };

  const reflectPreference = () => {
    if (typeof window !== "undefined") {
      document.querySelector(":root").dataset.theme = theme;
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const setPreference = (preferredTheme) => {
    localStorage.setItem(storageKey, preferredTheme);
    reflectPreference();
  };

  const handleToggleTheme = () => {
    const toggleTheme = theme === "light" ? "dark" : "light";
    setTheme(toggleTheme);
    setPreference(toggleTheme);
  };

  useEffect(() => {
    const preference = getColorPreference();
    setTheme(preference);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", ({ matches: isDark }) => {
        setTheme(isDark ? "dark" : "light");
        setPreference(isDark ? "dark" : "light");
      });
  }, [setTheme]);

  return (
    <button
      className="theme-toggle flex items-center justify-center"
      id="theme-toggle"
      title="Toggle light & dark"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-live="polite"
      onClick={handleToggleTheme}
    >
      <svg
        className="sun-and-moon"
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <mask className="moon" id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle
          className="sun"
          cx="12"
          cy="12"
          r="6"
          mask="url(#moon-mask)"
          fill="currentColor"
        />
        <g className="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </button>
  );
}
