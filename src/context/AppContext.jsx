import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("neutral");

  function applyTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
    setTheme(name);
  }

  return (
    <AppContext.Provider value={{ theme, applyTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
