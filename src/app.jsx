import React, { useEffect, useState, useRef } from "react";
import ShaderBackground from "./components/background";

const App = () => {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [typingDone, setTypingDone] = useState(false);

  const fullText = "Hey, I'm Jam.\nI'm a full stack web developer.";
  const indexRef = useRef(0);

  // Scroll snap behavior
  useEffect(() => {
    const container = document.getElementById("scroll-container");
    const hero = document.getElementById("hero-section");
    const more = document.getElementById("more-section");
    let scrolling = false;

    const handleWheel = (e) => {
      if (scrolling) return;
      scrolling = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      (direction > 0 ? more : hero)?.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => (scrolling = false), 500);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      const i = indexRef.current;
      if (i < fullText.length) {
        setTypedText((prev) => prev + fullText[i]);
        indexRef.current += 1;
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Cursor blinking animation
  useEffect(() => {
    if (!typingDone) return;
    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 600);
    return () => clearInterval(blink);
  }, [typingDone]);

  return (
    <div
      id="scroll-container"
      className="relative h-screen w-screen overflow-y-auto scroll-smooth"
    >
      <ShaderBackground />

      <div id="content" className="relative z-10">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative h-screen flex flex-col items-center justify-center pointer-events-auto"
        >
          <div className="text-white backdrop-grayscale backdrop-brightness-50 bg-black/30 rounded-2xl p-6 text-center text-5xl  whitespace-pre-line">
            {typedText}
            <span
              className={`ml-1 ${typingDone ? (showCursor ? "opacity-100" : "opacity-0") : "opacity-100"}`}
            >
              |
            </span>
          </div>

          <button
            id="scroll-btn"
            onClick={() =>
              document.getElementById("more-section")?.scrollIntoView({ behavior: "smooth" })
            }
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black p-4 rounded-full text-3xl shadow-lg transition duration-300 hover:bg-black hover:text-white z-20"
          >
            ↓
          </button>
        </section>

        {/* More Section */}
        <section
          id="more-section"
          className="min-h-screen bg-[#181a1b] text-white flex items-center justify-center px-10 py-20"
        >
          <div className="max-w-3xl text-center">
            <h2 className="text-4xl font-bold mb-4">More About Me</h2>
            <p className="text-lg text-gray-300">
              I'm passionate about building clean, scalable web applications.
              Scroll down to explore more of my projects, blogs, and contact info.
            </p>
          </div>
        </section>
      </div>

      
    </div>
  );
};

export default App;
