import React, { useEffect, useState } from "react";
import smoothscroll from "smoothscroll-polyfill";
import ShaderBackground from "./components/background";

// Kick off the polyfill
smoothscroll.polyfill();

const App = () => {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // The full text to type, including a newline.
  const fullText = "Hey, I'm Jam.\nFull stack web developer based in Sydney.";

  useEffect(() => {
    let index = 0;
    let cancelled = false;
    const initialDelay = 500; // wait before typing starts

    const type = () => {
      if (cancelled) return;
      if (index < fullText.length) {
        const char = fullText.charAt(index);
        setTypedText((prev) => prev + char);
        index++;
        if (char === "\n") {
          // Pause and blink while waiting between lines.
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            type();
          }, 1000);
        } else {
          setTimeout(type, 40);
        }
      } else {
        setTypingDone(true);
      }
    };

    // Start with an initial pause before typing the first character.
    setIsPaused(true);
    const initialTimer = setTimeout(() => {
      setIsPaused(false);
      type();
    }, initialDelay);

    return () => {
      cancelled = true;
      clearTimeout(initialTimer);
    };
  }, [fullText]);

  // Cursor blinking effect:
  // If we are paused (initial or between lines) or typing is complete, let it blink.
  // Otherwise (when actively typing) keep it solid.
  useEffect(() => {
    if (!isPaused && !typingDone) {
      setShowCursor(true);
      return;
    }
    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(blink);
  }, [isPaused, typingDone]);

  // Scroll snap behavior.
  useEffect(() => {
    const container = document.getElementById("scroll-container");
    const hero = document.getElementById("hero-section");
    const more = document.getElementById("more-section");
    let scrolling = false;

    const handleWheel = (e) => {
      e.preventDefault();
      if (scrolling) return;
      scrolling = true;
      const direction = e.deltaY > 0 ? 1 : -1;
      (direction > 0 ? more : hero)?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => (scrolling = false), 500);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      id="scroll-container"
      className="relative h-screen w-screen overflow-y-auto scroll-smooth snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <ShaderBackground />

      <div id="content" className="relative z-10">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative h-screen flex flex-col items-center justify-center pointer-events-auto snap-start"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="text-white bg-black/50 rounded-4xl p-4 text-center text-5xl whitespace-pre-line">
            {typedText}
            <span
              className={`ml-1 ${
                (typingDone || isPaused)
                  ? (showCursor ? "opacity-100" : "opacity-0")
                  : "opacity-100"
              }`}
            >
              |
            </span>
          </div>

          <button
            id="scroll-btn"
            onClick={() =>
              document.getElementById("more-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black p-4 rounded-full text-3xl shadow-lg transition duration-300 hover:bg-black hover:text-white z-20"
          >
            ↓
          </button>
        </section>

        {/* More Section */}
        <section
          id="more-section"
          className="min-h-screen bg-[#181a1b] text-white flex items-center justify-center px-10 py-20 snap-start"
          style={{ scrollSnapAlign: "start" }}
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
