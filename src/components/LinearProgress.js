import React from "react";
import useAnimation from "../util/useAnimation";
import { connect } from "react-redux";
import { container } from "./LinearProgress.module.css";
const LinearProgress = ({ numSlides, activeSlide, lastSlide }) => {
    const ref = useAnimation(
        animate => {
            const lastProgress = lastSlide / (numSlides - 1);
            const progress = activeSlide / (numSlides - 1);
            const animation = [{ width: `${lastProgress * 100}%` }, { width: `${progress * 100}%` }];
            const timing = { duration: 300, easing: "ease-in-out", fill: "forwards" };
            animate(animation, timing);
        },
        [activeSlide]
    );
    return <div className={container} ref={ref} />;
};

export default connect(({ activeSlide, lastSlide, numSlides }) => ({ activeSlide, lastSlide, numSlides }))(LinearProgress);
