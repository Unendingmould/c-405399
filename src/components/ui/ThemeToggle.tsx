import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme} 
      className="w-9 h-9 p-0 rounded-full bg-secondary/50"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-200" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
