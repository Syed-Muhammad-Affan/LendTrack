import { useState } from 'react';
import { Button } from '../../@/components/ui/button';
import { setTheme, getInitialTheme } from '../lib/theme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setThemeState] = useState(getInitialTheme());

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="text-primary">
      {theme === 'dark' ? <Sun className="size-6"/> : <Moon className="size-6"/>}
    </Button>
  );
}