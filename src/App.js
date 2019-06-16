import React from "react";
import { connect } from "react-redux";
import Slide from "./components/Slide";
import SlideContainer from "./components/SlideContainer";
import LinearProgress from "./components/LinearProgress";
import Welcome from "./slides/Welcome";
import Background from "./components/Background";
import About from "./slides/About";
import Video from "./slides/Video";
import How from "./slides/How";
const App = ({ dispatch, activeSlide }) => {
    return (
        <div>
            <LinearProgress />
            <Background />
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
        </div>
    );
};

export default connect(({ activeSlide }) => ({ activeSlide }))(App);
