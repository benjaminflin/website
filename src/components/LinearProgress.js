import React from "react";
import useAnimation from "../util/useAnimation";
import { connect } from "react-redux";
import { container } from "./LinearProgress.module.css";
const LinearProgress = ({ slidePositions, activeSlide, lastSlide }) => {
    const ref = useAnimation(animate => {
        const lastProgress = lastSlide / (slidePositions.length - 1);
        const progress = activeSlide / (slidePositions.length - 1);
        const animation = [{ width: `${lastProgress * 100}%` }, { width: `${progress * 100}%` }];
        const timing = { duration: 300, easing: "ease-in-out", fill: "forwards" };
        animate(animation, timing);
    });

    return <div className={container} ref={ref} />;
};

export default connect(state => state)(LinearProgress);
