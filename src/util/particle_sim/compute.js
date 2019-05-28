import createShader from "./createShader";
import createVAO from "./createVAO";
import createVBO from "./createVBO";
import createTexture from "./createTexture";

const prependFragSource = `
precision highp float;
uniform vec2 dimensions;
`;

const quadData = new Float32Array([1, -1, -1, -1, -1, 1, 1, -1, -1, 1, 1, 1]);

// creates a variable (name + floating point texture)
export const createVariable = ({ name, width, height, data }) => gl => {
    return {
        name,
        texture: createTexture({ width, height, data, internalFormat: gl.RGBA32F, srcType: gl.FLOAT })(gl)
    };
};

export const createProgram = ({ width, height, shader: shaderSource, uniforms }) => gl => {
    // default parameters
    width = width || 256;
    height = height || 256;
    if (!shaderSource) throw Error("need shader in order to create program");
    uniforms = uniforms || [];

    // create frame buffer of level 0 and bind it
    const texture = createTexture({ width, height, internalFormat: gl.RGBA32F, srcType: gl.FLOAT })(gl);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, 0);

    // create shader + vao
    const shader = createShader({ fragmentSource: prependFragSource + shaderSource })(gl);
    const vbo = createVBO({ data: quadData })(gl);
    const vao = createVAO(vbo)(gl);

    // add uniforms
    shader.setUniform({ name: "dimensions", type: "float", length: 2, value: [width, height] });
    uniforms.forEach(uniform => shader.setUniform(uniform));

    // variables map from name -> texture
    const textures = [];

    // adds the variable to the shader
    const setVariable = ({ name, texture }, position) => {
        textures[position] = texture;
        shader.bind();
        shader.setUniform({ name, i: position, type: "texture", value: texture });
    };

    // execute function which renders to quad and return variable
    const execute = (name = "render_result") => {
        vao.bind();
        shader.bind();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        textures.forEach((tex, i) => tex.bind(i));
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        const newTexture = createTexture({ width, height, internalFormat: gl.RGBA32F, srcType: gl.FLOAT })(gl);
        newTexture.bind();
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 0, 0, width, height, 0);
        return {
            name,
            texture: newTexture
        };
    };

    // reads result into memory
    const read = () => {
        const buffer = new Float32Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.FLOAT, buffer);
        return buffer;
    };

    return { execute, setVariable, read, setUniform: shader.setUniform };
};
