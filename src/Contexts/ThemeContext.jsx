import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Since we're using light mode only, these are just placeholder functions
  // to maintain compatibility with existing components that might call useTheme
  const darkMode = false; // Always false for light mode only
  const toggleDarkMode = () => {}; // Empty function since we don't toggle

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
