import {
    Camera,
    Mesh,
    Plane,
    Program,
    Renderer,
    RenderTarget
  } from 'ogl';
  import { resolveLygia } from 'resolve-lygia';
  import { Pane } from 'tweakpane';
  
  import vertex from '../shaders/vertex.glsl?raw';
  import fragment from '../shaders/fragment.glsl?raw';
  import asciiVertex from '../shaders/ascii-vertex.glsl?raw';
  import asciiFragment from '../shaders/ascii-fragment.glsl?raw';


  const renderer = new Renderer();
  const gl = renderer.gl;
  document.body.appendChild(gl.canvas);
  
  const camera = new Camera(gl, { near: 0.1, far: 100 });
  camera.position.set(0, 0, 3);
  
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  }
  window.addEventListener('resize', resize);
  resize();

  const geometry = new Plane(gl, { width: 2, height: 2 });
  
  const renderTarget = new RenderTarget(gl);

  const perlinProgram = new Program(gl, {
    vertex,
    fragment: resolveLygia(fragment),
    uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: 5.0 },
        uSpeed: { value: 0.25 },
        uValue: { value: 0.75 },
        uNoiseType: { value: 3 },
        uChromatic: { value: true },
        uRainbow: { value: false },
        uInvert: { value: false }

      }
  });
  const perlinMesh = new Mesh(gl, { geometry, program: perlinProgram });
  
  const asciiProgram = new Program(gl, {
    vertex: asciiVertex,
    fragment: asciiFragment,
    uniforms: {
      uTexture: { value: renderTarget.texture },
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
    },
  });
  const asciiMesh = new Mesh(gl, { geometry, program: asciiProgram });
  
  const pane = new Pane();
  pane.addBinding(perlinProgram.uniforms.uFrequency, 'value', {
    min: 0, max: 10, label: 'Frequency'
  });
  pane.addBinding(perlinProgram.uniforms.uSpeed, 'value', {
    min: 0, max: 2, label: 'Speed'
  });
  pane.addBinding(perlinProgram.uniforms.uValue, 'value', {
    min: 0, max: 1, label: 'Lightness'
  });

  pane.addBinding(perlinProgram.uniforms.uRainbow, 'value', {
    label: 'Rainbow Mode'
  });
  
  pane.addBinding(perlinProgram.uniforms.uChromatic, 'value', {
    label: 'Chromatic Aberration'
  });

  pane.addBinding(perlinProgram.uniforms.uInvert, 'value', {
    label: 'Invert'
  });
  

  pane.addBinding(perlinProgram.uniforms.uNoiseType, 'value', {
    options: {
      Perlin: 0,
      Worley: 1,
      FBM: 2,
      Voronoi: 3,
      Curl: 4,
      GerstnerWave: 5
    },
    label: 'Noise Type'
  });
  
  
  function update(t) {
    requestAnimationFrame(update);
    const time = t * 0.001;
    perlinProgram.uniforms.uTime.value = time;
  
    asciiProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    
    renderer.render({ scene: perlinMesh, camera, target: renderTarget });
  
    renderer.render({ scene: asciiMesh, camera });
  }
  requestAnimationFrame(update);

  gl.canvas.id = 'shader-bg';
Object.assign(gl.canvas.style, {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  zIndex: '-1', // Keeps it behind your UI
});
