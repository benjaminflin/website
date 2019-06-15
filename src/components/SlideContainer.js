import React, { useEffect } from "react";
import { connect } from "react-redux";
import { container } from "./Slide.module.css";
const SlideContainer = ({ children, activeSlide, dispatch }) => {
    // updates active slide based on target scroll position
    useEffect(() => {
        const setSlide = ({ target }) => {
            // calculate current slide number from window height (slide height)
            const position = Math.round(window.scrollY / window.innerHeight);

            // only update if position has changed
            if (position !== activeSlide)
                dispatch({ type: "CHANGE_SLIDE", slide: position });
        };

        // add/remove listeners
        window.addEventListener("scroll", setSlide);

        return () => {
            window.removeEventListener("scroll", setSlide);
        };
    });
    useEffect(() => {
        dispatch({ type: "SET_NUM_SLIDES", numSlides: children.length });
    }, [dispatch, children]);
    return <div className={container}>{children}</div>;
};

export default connect(({ activeSlide }) => ({ activeSlide }))(SlideContainer);
