import React, { useEffect, useState } from "react";
import smoothscroll from "smoothscroll-polyfill";
import ShaderBackground from "./components/background";

smoothscroll.polyfill();

const App = () => {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const fullText = "Hey, I'm Jam.\nFull stack developer based in Sydney.";

  // Typing effect
  useEffect(() => {
    let index = 0;
    let cancelled = false;

    setIsPaused(true);

    const startTyping = () => {
      if (cancelled) return;
      if (index < fullText.length) {
        const char = fullText[index++];
        setTypedText((prev) => prev + char);

        if (char === "\n") {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            startTyping();
          }, 1000);
        } else {
          setTimeout(startTyping, 40);
        }
      } else {
        setTypingDone(true);
      }
    };

    const delay = setTimeout(() => {
      setIsPaused(false);
      startTyping();
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, [fullText]);

  // Cursor blink
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

  // Fade effect on scroll
  useEffect(() => {
    const container = document.getElementById("scroll-container");
    const hero = document.getElementById("hero-section");
    const canvas = document.getElementById("shader-bg");

    const onScroll = () => {
      const heroProgress = Math.min(container.scrollTop / (window.innerHeight * 0.3), 1);
      const canvasProgress = Math.min(container.scrollTop / (window.innerHeight * 0.9), 1);
      hero.style.opacity = 1 - heroProgress;
      canvas.style.opacity = 1 - canvasProgress;
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // Snap scroll behavior
  useEffect(() => {
    const container = document.getElementById("scroll-container");
    const hero = document.getElementById("hero-section");
    const more = document.getElementById("more-section");
    let scrolling = false;

    const handleWheel = (e) => {
      e.preventDefault();
      if (scrolling) return;

      scrolling = true;
      (e.deltaY > 0 ? more : hero)?.scrollIntoView({ behavior: "smooth" });
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
          className="relative h-screen flex flex-col items-start justify-center snap-start px-8"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="relative w-full max-w-[86rem] h-[10rem]">
            <span className="absolute inset-0 bg-black/70 rounded-xl blur-xl opacity-60" />
            <p className="relative text-white font-bold text-8xl sm:text-7xl leading-tight font-['Helvetica','Arial','sans-serif'] whitespace-pre-line">
              {typedText}
              <span
                className={`ml-1 ${
                  typingDone || isPaused
                    ? showCursor
                      ? "opacity-100"
                      : "opacity-0"
                    : "opacity-100"
                }`}
              >
                |
              </span>
            </p>
          </div>

          <button
            id="scroll-btn"
            onClick={() =>
              document
                .getElementById("more-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white text-black p-4 rounded-full text-3xl shadow-lg hover:bg-black hover:text-white z-20"
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
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
