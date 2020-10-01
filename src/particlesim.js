import positionSrc from "./positionProgram.js";
class Variable {
  constructor(gl, name, width, height, data) {
    this.texture = gl.createTexture();
    this.name = name;
    this.set(gl, width, height, data);

    // clamp to edge and nearest filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  set(gl, width, height, data) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0, // level
      gl.RGBA, // internalFormat
      width,
      height,
      0, // border
      gl.RGBA, // format
      gl.FLOAT, // type
      data
    );
  }
}

const defaultVertexSource = `
      attribute vec2 aPosition;

      void main(void) {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;
class Program {
  constructor(gl, source, vertexSource = defaultVertexSource) {
    this.variables = [];
    this.constants = [];
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, source);
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(this.program)
      );
      return null;
    }
  }

  loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compiling error: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  addConstant(name, type, data) {
    this.constants[name] = { type, data };
  }
  addVariable(variable) {
    this.variables[name] = variable;
  }
}

class Renderer {
  constructor(gl) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const quad = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW);
  }

  resize(gl, width, height) {
    gl.viewport(0, 0, width, height);
  }
  render(gl, program) {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(
      gl.getAttribLocation(program.program, "aPosition"),
      2, // num floats per vector
      gl.FLOAT, // type
      false, // normalize
      0, // stride
      0 // offset
    );
    gl.enableVertexAttribArray(0);
    gl.useProgram(program.program);
    let i = 0;
    for (const name in program.variables) {
      const v = program.variables[name];
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, v.texture);
      const loc = gl.getUniformLocation(program.program, name);
      gl.uniform1i(loc, i++);
    }
    for (const name in program.constants) {
      const c = program.constants[name];
      const loc = gl.getUniformLocation(program.program, name);
      gl[`uniform${c.type}`](loc, c.data);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0 /* offset */, 4 /* vertex count */);
  }
}

const pointsSrc = `
  precision highp float;
  void main(void) {
    gl_FragColor = vec4(0.0,0.0,1.0,1.0);
  }
`;
const size = 200;
onmessage = function (evt) {
  const { width, height } = evt.data;
  const canvas = new OffscreenCanvas(size, size);
  const gl = canvas.getContext("webgl");
  const ext = gl.getExtension("OES_texture_float");

  let positions = new Array(size * size * 4);
  for (let i = 0; i < size * size * 4; i++) {
    positions[i] = Math.random();
  }

  const variable = new Variable(
    gl,
    "varPosition",
    size,
    size,
    new Float32Array(positions)
  );

  let time = 0;

  const program = new Program(gl, positionSrc);
  program.addVariable(variable);
  program.addConstant("dimensions", "2fv", new Float32Array([size, size]));
  program.addConstant("time", "1f", time);

  const renderer = new Renderer(gl);

  const pointsProgram = new Program(
    gl,
    pointsSrc,
    `attribute vec4 aPosition;

      void main(void) {
        gl_Position = vec4(aPosition.xy, 0.0, 1.0);
        gl_PointSize = 10.0;
      }`
  );
  const pixels = new Float32Array(size * size * 4);
  const buffer = gl.createBuffer();
  const fb = gl.createFramebuffer();
  const renderTexture = gl.createTexture();

  function render() {
    program.constants["time"] = { type: "1f", data: time++ };
    renderer.resize(gl, size, size);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    renderer.render(gl, program);
    gl.readPixels(0, 0, size, size, gl.RGBA, gl.FLOAT, pixels);

    variable.set(gl, size, size, pixels);

    renderer.resize(gl, width, height);

    // TODO: move this into a class
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pixels, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      gl.getAttribLocation(program.program, "aPosition"),
      4, // num floats per vector
      gl.FLOAT, // type
      false, // normalize
      0, // stride
      0 // offset
    );
    gl.enableVertexAttribArray(0);
    gl.useProgram(pointsProgram.program);
    gl.drawArrays(gl.POINTS, 0, size * size);
    const bitmap = canvas.transferToImageBitmap();
    postMessage(bitmap, [bitmap]);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};
