const createVAO = vbo => gl => {
    const vao = gl.createVertexArray();

    const bind = () => {
        gl.bindVertexArray(vao);
    };

    const unbind = () => {
        gl.bindVertexArray(null);
    };

    const setVBO = ({ bind: bindVBO, unbind: unbindVBO, size, type, normalize, stride, offset }) => {
        // bind
        bind();
        bindVBO();

        // attrib
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, size, type, normalize, stride, offset);

        // unbind
        unbindVBO();
        unbind();
    };

    setVBO(vbo);

    return { bind, unbind, setVBO };
};

export default createVAO;
