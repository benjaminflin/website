import React from "react";
import { connect } from "react-redux";
import Slide from "./components/Slide";
import SlideContainer from "./components/SlideContainer";
import LinearProgress from "./components/LinearProgress";
import Welcome from "./slides/Welcome";
import Background from "./components/Background";
import About from "./slides/About";
import Credits from "./slides/Credits";
const App = ({ dispatch, activeSlide }) => {
    // actions to automatically increment and decrement slides
    // TODO: make middleware to replace this which automatically handles the scrolling side effect
    const incrementSlide = () => {
        window.scrollTo(0, window.innerHeight * (activeSlide + 1));
        dispatch({ type: "CHANGE_SLIDE", slide: activeSlide + 1 });
    };
    const decrementSlide = () => {
        window.scrollTo(0, window.innerHeight * (activeSlide - 1));
        dispatch({ type: "CHANGE_SLIDE", slide: activeSlide - 1 });
    };
    return (
        <div>
            <LinearProgress />
            <Background />
            <SlideContainer>
                <Slide index={0}>
                    <Welcome active={activeSlide === 0} incrementSlide={incrementSlide} />
                </Slide>
                <Slide index={1}>
                    <About active={activeSlide === 1} incrementSlide={incrementSlide} decrementSlide={decrementSlide} />
                </Slide>
                <Slide index={2}>
                    <Credits active={activeSlide === 2} decrementSlide={decrementSlide} />
                </Slide>
            </SlideContainer>
        </div>
    );
};

export default connect(({ activeSlide }) => ({ activeSlide }))(App);
