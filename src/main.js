const app = document.getElementById('app');

// Create scroll container
const container = document.createElement('div');
container.className = 'h-screen overflow-y-scroll scroll-smooth';
app.appendChild(container);

// Hero Section
const hero = document.createElement('section');
hero.className =
  'h-screen flex flex-col items-center justify-center relative z-10 text-white';

hero.innerHTML = `
  <div class="pointer-events-auto backdrop-grayscale backdrop-brightness-50 bg-black/30 rounded-2xl p-6 text-center">
    <h1 class="text-5xl font-bold mb-4">Hello, I'm Jam.</h1>
    <p class="text-2xl mb-4">I'm a full stack web developer</p>
  </div>
<button
  id="scroll-btn"
  class="pointer-events-auto absolute bottom-8 left-1/2 transform -translate-x-1/2 
         bg-white text-black p-4 rounded-full 
         hover:bg-black hover:text-white transition text-3xl"
>
  ↓
</button>

`;
container.appendChild(hero);

// More Section
const more = document.createElement('section');
more.id = 'more-section';
more.className =
  'min-h-screen bg-black text-white flex items-center justify-center px-10 py-20';

more.innerHTML = `
  <div class="max-w-3xl text-center">
    <h2 class="text-4xl font-bold mb-4">More About Me</h2>
    <p class="text-lg text-gray-300">I'm passionate about building clean, scalable web applications. Scroll down to explore more of my projects, blogs, and contact info.</p>
  </div>
`;
container.appendChild(more);

// Smooth scroll on button click
document.getElementById('scroll-btn').addEventListener('click', () => {
  more.scrollIntoView({ behavior: 'smooth' });
});

let scrolling = false;

container.addEventListener('wheel', (e) => {
  if (scrolling) return;

  if (e.deltaY > 0) {
    // Scrolling down
    scrolling = true;
    more.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => (scrolling = false), 500);
  } else if (e.deltaY < 0) {
    // Scrolling up
    scrolling = true;
    hero.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => (scrolling = false), 500);
  }
});

