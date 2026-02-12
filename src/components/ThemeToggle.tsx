import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <motion.button
      onClick={() => setDark(!dark)}
      className="relative w-9 h-9 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
      whileTap={{ scale: 0.9 }}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: dark ? 180 : 0, scale: dark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun className="w-4 h-4 text-foreground" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: dark ? 0 : -180, scale: dark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon className="w-4 h-4 text-foreground" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
