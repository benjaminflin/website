const createGLContext = (width, height, usePixelRatio = true, canvas = document.createElement("canvas")) => {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const ext = gl.getExtension("EXT_color_buffer_float");

    if (!gl || !ext) throw Error("webgl + extensions not supported");

    if (usePixelRatio) {
        const pixelRatio = window.devicePixelRatio;
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        gl.viewport(0, 0, width * pixelRatio, height * pixelRatio);
    } else {
        gl.viewport(0, 0, width, height);
    }
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { canvas, gl };
};

export default createGLContext;
