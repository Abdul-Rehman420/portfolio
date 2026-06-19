import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };

    const handleHoverStart = () => setHovered(true);
    const handleHoverEnd = () => setHovered(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    document.querySelectorAll("a, button, [role='button'], input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      document.querySelectorAll("a, button, [role='button'], input, textarea").forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-3 h-3 bg-primary rounded-full"
        animate={{ x: pos.x - 6, y: pos.y - 6, scale: clicked ? 0.5 : hovered ? 1.5 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] w-8 h-8 border border-primary/50 rounded-full"
        animate={{
          x: pos.x - 16,
          y: pos.y - 16,
          scale: clicked ? 0.8 : hovered ? 1.5 : 1,
          borderColor: hovered ? "rgba(37, 99, 235, 0.8)" : "rgba(37, 99, 235, 0.3)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </>
  );
};

export default CustomCursor;
