const createTexture = ({ level, internalFormat, width, height, srcFormat, srcType, data }) => gl => {
    // default params
    level = level || 0;
    internalFormat = internalFormat || gl.RGBA;
    srcFormat = srcFormat || gl.RGBA;
    srcType = srcType || gl.UNSIGNED_BYTE;
    width = width || 256;
    height = height || 256;

    // handle
    const texture = gl.createTexture();

    // bind, unbind
    const bind = (i = 0) => {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    };

    const unbind = () => {
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    // set texture data
    bind();

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, 0, srcFormat, srcType, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    unbind();

    return { bind, unbind, texture };
};

export default createTexture;
