import React, { useRef, useEffect, useState } from "react";
import { TransitionProvider, TransitionViews } from "gatsby-plugin-transitions";
import Loader from "../components/Loader";
import Background from "../components/background";
import particleSim from "../particlesim/";

const particles = new Promise(resolve => {
  if (typeof window !== `undefined`) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.zIndex = "-1";
    canvas.style.top = "0";
    canvas.style.left = "0";
    particleSim(canvas, resolve);
  }
});

const Layout = ({ location, children }) => {
  switch (location) {
    case "/":
  }
  return (
    <Loader promise={particles} debounceMs={2000}>
      {canvas => (
        <>
          <Background canvas={canvas} />
          <TransitionProvider location={location}>
            <TransitionViews>{children}</TransitionViews>
          </TransitionProvider>
        </>
      )}
    </Loader>
  );
};

export default Layout;
