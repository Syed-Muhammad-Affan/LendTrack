import { useEffect, useState } from 'react';
import { AppContext } from './AppContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-d-background');
      document.body.classList.remove('bg-l-background');
    } else {
      document.body.classList.remove('bg-d-background');
      document.body.classList.add('bg-l-background');
    }
  }, [darkMode]);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
