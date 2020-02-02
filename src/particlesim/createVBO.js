const createVBO = ({ data, size, type, normalize, stride, offset }) => gl => {
    // default params
    size = size || 2;
    type = type || gl.FLOAT;
    normalize = normalize || false;
    stride = stride || 0;
    offset = offset || 0;

    const vbo = gl.createBuffer();
    // bind, unbind
    const bind = () => {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    };
    const unbind = () => {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };

    bind();
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    unbind();

    return { vbo, bind, unbind, size, type, normalize, stride, offset };
};

export default createVBO;
