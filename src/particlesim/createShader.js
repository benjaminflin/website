const compileShader = (gl, shaderSource, shaderType) => {
    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        throw Error("could not compile shader:" + gl.getShaderInfoLog(shader));
    }

    return shader;
};

const defaultVertexSource = `
attribute vec4 a_position;
varying vec2 coord;
void main(void) {
    gl_Position = a_position;
    coord = a_position.xy;
}
`;

const createShader = ({ vertexSource: _vertexSource, fragmentSource }) => gl => {
    // use default vertex shader
    const vertexSource = _vertexSource || defaultVertexSource;

    // compile shaders
    const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

    // create and link program
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    // throw if error
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw new Error("program filed to link:" + gl.getProgramInfoLog(program));
    }

    // bind and unbind functions
    const bind = () => {
        gl.useProgram(program);
    };

    const unbind = () => {
        gl.useProgram(null);
    };

    // automatically creates texture from value
    const setUniformTexture = ({ name, value, i }) => {
        const { bind: texBind, unbind: texUnbind } = value;

        bind();
        texBind(i);

        const loc = gl.getUniformLocation(program, name);
        gl.uniform1i(loc, i);

        texUnbind();
        unbind();
    };

    const setUniform = uniform => {
        if (uniform.type === "texture") {
            setUniformTexture(uniform);
            return;
        }
        const { name, type, length, value } = uniform;
        bind();
        const typeStrMap = {
            float: "f",
            int: "i",
            bool: "i"
        };

        const typeStr = typeStrMap[type];
        const loc = gl.getUniformLocation(program, name);
        gl[`uniform${length}${typeStr}v`](loc, value);
        unbind();
    };

    return { program, bind, unbind, setUniform };
};

export default createShader;
