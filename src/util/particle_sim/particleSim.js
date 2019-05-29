import { createProgram, createVariable } from "./compute";
import createVBO from "./createVBO";
import createVAO from "./createVAO";
import createGLContext from "./createGLContext";
import createShader from "./createShader";
import { stream, debounce } from "../stream";
const particleSim = canvas => {
    // create canvas context
    const SIM_SIZE = 128;
    const { gl } = createGLContext(SIM_SIZE, SIM_SIZE, false);
    const NUM_PARTICLES = SIM_SIZE * SIM_SIZE * 4;

    const velocityComputeShader = `
    uniform sampler2D var_velocity;

    void main() {
        vec2 coord = gl_FragCoord.xy / dimensions.xy;
        vec2 velocity = texture2D(var_velocity, coord).xy;
        velocity += vec2(0.0005, 0.0005);
        gl_FragColor = vec4(velocity, 1.0, 1.0);
    }
    `;

    const positionComputeShader = `
    uniform sampler2D var_position;
    uniform sampler2D var_velocity;
    uniform float time;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise2(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
    
    float snoise(vec2 v) {
        vec2 r = texture2D(var_velocity, vec2(0.0,0.0)).xy;
        return (snoise2(v) + snoise2(v + r)) / 2.0;
    }
    vec2 curlNoise(vec2 p) {
        const float e = 0.1;

        float n1 = snoise(vec2(p.x, p.y + e));
        float n2 = snoise(vec2(p.x, p.y - e));
        float n3 = snoise(vec2(p.x + e, p.y));
        float n4 = snoise(vec2(p.x - e, p.y));
      
        float x = n2 - n1;
        float y = n4 - n3;

        return vec2(x, y) * 1.3;
    }

    void main() {
        vec2 coord = gl_FragCoord.xy / dimensions.xy;
        vec2 position = texture2D(var_position, coord).xy;
        vec2 velocity = texture2D(var_velocity, coord).xy;
        position = curlNoise(velocity);

        gl_FragColor = vec4(position, 1.0, 1.0);
    }
`;

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
    const simulate = () => {
        // velocity simulation
        velocityShader.setVariable(velVar, 0);
        velVar = velocityShader.execute("var_velocity");

        // position simulation with curl noise
        positionShader.setVariable(posVar, 0);
        positionShader.setVariable(velVar, 1);
        positionShader.setUniform({ name: "time", type: "float", length: "1", value: [time++] });
        posVar = positionShader.execute("var_position");
        return positionShader.read();
    };

    // rendering logic
    const { canvas: renderCanvas, gl: gl2 } = createGLContext(window.innerWidth, window.innerHeight, true, canvas);
    gl2.clearColor(0.2, 0.2, 0.2, 1);
    document.body.appendChild(renderCanvas);
    const vertexShader = `
        attribute vec4 position;
        void main(void) {
            gl_Position = position;
            gl_PointSize = 10.0;
        }
    `;
    const fragmentShader = `
        precision mediump float;
        void main(void) {
            gl_FragColor = vec4(vec3(0.3), 1.0);
        }
    `;
    const shader = createShader({ vertexSource: vertexShader, fragmentSource: fragmentShader })(gl2);
    const update = () => {
        const data = simulate();
        const vbo = createVBO({ data })(gl2);
        const vao = createVAO(vbo)(gl2);

        vao.bind();
        shader.bind();
        gl2.clear(gl.COLOR_BUFFER_BIT);
        gl2.drawArrays(gl.POINTS, 0, data.length / 4);
        requestAnimationFrame(update);
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

export default particleSim;
