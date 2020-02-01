import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Slide from "./components/Slide";
import SlideContainer from "./components/SlideContainer";
import LinearProgress from "./components/LinearProgress";
import Welcome from "./slides/Welcome";
// import Background from "./components/Background";
import About from "./slides/About";
import Video from "./slides/Video";
import How from "./slides/How";
import LoadingScreen from "./components/LoadingScreen";
import particleSim from "./util/particle_sim/particleSim";
const App = ({ dispatch, activeSlide }) => {
  const [loaded, setLoaded] = useState(false);
  const [appended, setAppended] = useState(false);
  const div = useRef(null);
  const [canvas, setCanvas] = useState(null);
  useEffect(() => {
    const c = document.createElement("canvas");
    c.style = "position: fixed; z-index: -1; top: 0; left: 0;";
    particleSim(c, () => {
      setTimeout(() => setLoaded(true), 2000);
      setCanvas(c);
    });
  }, []);

  useEffect(() => {
    if (loaded && !appended && div.current && canvas) {
      const d = div.current;
      d.appendChild(canvas);
      setAppended(true);
    }
  }, [loaded, canvas, div, appended]);
  return (
    <LoadingScreen loaded={loaded}>
      <LinearProgress />
      <div ref={div}></div>
      <SlideContainer>
        <Slide index={0}>
          <Welcome active={activeSlide === 0} />
        </Slide>
        <Slide index={1}>
          <About active={activeSlide === 1} />
        </Slide>
        <Slide index={2}>
          <Video active={activeSlide === 2} />
        </Slide>
        <Slide index={3}>
          <How active={activeSlide === 3} />
        </Slide>
      </SlideContainer>
    </LoadingScreen>
  );
};

export default connect(({ activeSlide }) => ({ activeSlide }))(App);
