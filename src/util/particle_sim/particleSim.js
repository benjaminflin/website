import { createProgram, createVariable } from "./compute";
import createVBO from "./createVBO";
import createVAO from "./createVAO";
import createGLContext from "./createGLContext";
import createShader from "./createShader";
import { stream, debounce } from "../stream";
import velocityComputeShader from "./velocityShader.js";
import positionComputeShader from "./positionShader.js";

const particleSim = canvas => {
  // create canvas context
  const SIM_SIZE = 128;
  let gl;
  try {
    gl = createGLContext(SIM_SIZE, SIM_SIZE, false).gl;
  } catch (e) {
    return particleSim2(canvas);
  }
  const NUM_PARTICLES = SIM_SIZE * SIM_SIZE * 4;

  // Note: although this is called velocity, it really doesn't act like it
  // in the simulation. I just needed a bunch of random values that change regularly over time to feed into the curl noise
  const velocityShader = createProgram({
    shader: velocityComputeShader,
    width: SIM_SIZE,
    height: SIM_SIZE
  })(gl);

  const positionShader = createProgram({
    shader: positionComputeShader,
    width: SIM_SIZE,
    height: SIM_SIZE
  })(gl);

  const getRandomData = (width, height) => {
    const data = new Array(width * height * 4);
    for (let i = 0; i < NUM_PARTICLES; i += 4) {
      // encode position
      data[i] = -1 + Math.random() * 2;
      data[i + 1] = -1 + Math.random() * 2;
      data[i + 2] = 1.0;
      data[i + 3] = 1.0;
    }
    return new Float32Array(data);
  };
  // variables setup
  let posVar = createVariable({
    data: getRandomData(128, 128),
    width: SIM_SIZE,
    height: SIM_SIZE,
    name: "var_position"
  })(gl);

  let velVar = createVariable({
    data: getRandomData(128, 128),
    width: SIM_SIZE,
    height: SIM_SIZE,
    name: "var_velocity"
  })(gl);

  let time = 0;

  let mousePosition = { x: 0, y: 0 };
  const simulate = () => {
    // velocity simulation
    velocityShader.setVariable(velVar, 0);
    velVar = velocityShader.execute("var_velocity");

    // position simulation with curl noise
    positionShader.setVariable(posVar, 0);
    positionShader.setVariable(velVar, 1);

    positionShader.setUniform({
      name: "time",
      type: "float",
      length: "1",
      value: [time++]
    });
    positionShader.setUniform({
      name: "mousePosition",
      type: "float",
      length: "2",
      value: [mousePosition.x, mousePosition.y]
    });
    posVar = positionShader.execute("var_position");
    return positionShader.read();
  };

  window.addEventListener("mousemove", ({ clientX, clientY }) => {
    mousePosition.x = (clientX / window.innerWidth) * 2 - 1.0;
    mousePosition.y = -((clientY / window.innerHeight) * 2 - 1.0);
  });

  // rendering logic
  const { canvas: renderCanvas, gl: gl2 } = createGLContext(
    window.innerWidth,
    window.innerHeight,
    true,
    canvas
  );
  gl2.clearColor(0.1, 0.1, 0.1, 1);
  document.body.appendChild(renderCanvas);
  const vertexShader = `
        attribute vec4 position;
        void main(void) {
            gl_Position = position;
            gl_PointSize = ${(5.0 * window.devicePixelRatio).toFixed(1)};
        }
    `;
  const fragmentShader = `
        precision mediump float;
        void main(void) {
            gl_FragColor = vec4(vec3(0.2), 1.0);
        }
    `;
  const shader = createShader({
    vertexSource: vertexShader,
    fragmentSource: fragmentShader
  })(gl2);
  const update = () => {
    const data = simulate();
    const vbo = createVBO({ data })(gl2);
    const vao = createVAO(vbo)(gl2);

    vao.bind();
    shader.bind();
    gl2.clear(gl.COLOR_BUFFER_BIT);
    gl2.drawArrays(gl.POINTS, 0, data.length / 4);
    requestIdleCallback(update);
  };
  update();
  const resize = (width, height) => {
    const pixelRatio = window.devicePixelRatio;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    gl2.viewport(0, 0, width * pixelRatio, height * pixelRatio);
  };

  const resize$ = stream(emit => {
    window.addEventListener("resize", () => {
      emit(null);
    });
  }).pipe(debounce(500));

  resize$.subscribe(() => {
    resize(window.innerWidth, window.innerHeight);
  });
};

// backup particle simulation for browsers without webgl2 or for mobile browsers
const particleSim2 = canvas => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const particles = [];
  const NUM_PARTICLES = 50;
  const MAX_LIFETIME = 300;
  const MIN_LIFETIME = 10;
  const MAX_RADIUS = 10;
  const createParticle = (x, y, dx, dy, lifetime, health = lifetime) => ({
    x,
    y,
    dx,
    dy,
    lifetime,
    health
  });

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dx = Math.random() * 2.0 - 1.0;
    const dy = Math.random() * 2.0 - 1.0;
    const lifetime = Math.max(
      Math.floor(Math.random() * MAX_LIFETIME),
      MIN_LIFETIME
    );
    particles.push(createParticle(x, y, dx, dy, lifetime));
  }

  const resetParticle = p => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dx = Math.random() * 2.0 - 1.0;
    const dy = Math.random() * 2.0 - 1.0;
    const lifetime = Math.max(
      Math.floor(Math.random() * MAX_LIFETIME),
      MIN_LIFETIME
    );
    p.x = x;
    p.y = y;
    p.dx = dx;
    p.dy = dy;
    p.lifetime = lifetime;
    p.health = lifetime;
  };

  const update = () => {
    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.health-- === 0) {
        resetParticle(p);
      }
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(77, 77, 77)";
    for (const p of particles) {
      const radius =
        MAX_RADIUS *
        ((Math.sin(
          (2.0 * Math.PI * (p.lifetime - p.health)) / p.lifetime - Math.PI / 2
        ) +
          1.0) /
          2.0);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  };

  const animate = () => {
    update();
    draw();
    requestAnimationFrame(animate);
  };

  const resize$ = stream(emit => {
    window.addEventListener("resize", () => {
      emit(null);
    });
  }).pipe(debounce(300));

  resize$.subscribe(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animate();
};

export default particleSim;
