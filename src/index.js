setTimeout(() => {
  if (window.OffscreenCanvas) {
    const simCanvas = document.getElementById("simCanvas");
    simCanvas.width = window.innerWidth;
    simCanvas.height = window.innerHeight;
    const renderer = simCanvas.getContext("bitmaprenderer");
    const worker = new Worker("src/particlesim.js", { type: "module" });
    worker.postMessage({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    worker.onmessage = function (evt) {
      const bitmap = evt.data;
      renderer.transferFromImageBitmap(bitmap);
    };
  }
});
