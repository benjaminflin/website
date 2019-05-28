import React, { useRef, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { content } from "./Slide.module.css";

const Slide = ({ children, index, slidePositions, activeSlide, lastSlide }) => {
    const ref = useRef(null);

    // the slide position for this slide
    const slidePos = slidePositions[index];

    // the active slide position
    const activeSlidePos = slidePositions[activeSlide];

    // the last active slide position
    const lastActiveSlidePos = slidePositions[lastSlide];

    // current x and y transormed
    const x = slidePos.x - activeSlidePos.x;
    const y = slidePos.y - activeSlidePos.y;

    // last x and y transformed
    const lastX = slidePos.x - lastActiveSlidePos.x;
    const lastY = slidePos.y - lastActiveSlidePos.y;

    // animate transition to new calculated position
    useLayoutEffect(() => {
        const animation = [{ transform: `translate(${lastX * 100}vw, ${lastY * 100}vh)`, offset: 0.0 }, { transform: `translate(${x * 100}vw, ${y * 100}vh)`, offset: 1.0 }];
        const timing = {
            duration: 700,
            fill: "forwards",
            easing: "ease-in-out"
        };

        if (ref.current) {
            ref.current.animate(animation, timing);
        }
    });

    return (
        <div ref={ref} className={content}>
            {children}
        </div>
    );
};

export default connect(({ activeSlide, slidePositions, lastSlide }) => ({ activeSlide, slidePositions, lastSlide }))(Slide);
