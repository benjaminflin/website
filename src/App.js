import React, { useEffect } from "react";
import { connect } from "react-redux";
import Slide from "./components/Slide";
import SlideContainer from "./components/SlideContainer";
import LinearProgress from "./components/LinearProgress";
import Welcome from "./slides/Welcome";
import Background from "./components/Background";
import About from "./slides/About";
import Credits from "./slides/Credits";
const App = ({ dispatch, activeSlide }) => {
    // change active slide position using scroll
    useEffect(() => {
        const setSlide = () => {
            const position = Math.round(window.scrollY / window.innerHeight);
            if (position !== activeSlide) dispatch({ type: "CHANGE_SLIDE", slide: position });
        };

        window.addEventListener("scroll", setSlide);

        return () => {
            window.removeEventListener("scroll", setSlide);
        };
    });

    const incrementSlide = () => {
        window.scrollTo(0, window.innerHeight * (activeSlide + 1));
        dispatch({ type: "CHANGE_SLIDE", slide: activeSlide + 1 });
    };
    // const decrementSlide = () => {
    //     window.scrollTo(0, window.innerHeight * (activeSlide - 1));
    //     dispatch({ type: "CHANGE_SLIDE", slide: activeSlide - 1 });
    // };
    return (
        <div>
            <LinearProgress />
            <SlideContainer>
                <Slide index={0}>
                    <Welcome active={activeSlide === 0} incrementSlide={incrementSlide} />
                </Slide>
                <Slide index={1}>
                    <About active={activeSlide === 1} />
                </Slide>
                <Slide index={2}>
                    <Credits active={activeSlide === 2} />
                </Slide>
                <Background />
            </SlideContainer>
        </div>
    );
};

export default connect(state => state)(App);
