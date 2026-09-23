import { useEffect, useState } from 'react';
import { AppContext } from './appContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-DBackground');
      document.body.classList.remove('bg-LBackground');
    } else {
      document.body.classList.remove('bg-DBackground');
      document.body.classList.add('bg-LBackground');
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
