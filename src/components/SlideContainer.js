import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { container, fakecontent } from "./Slide.module.css";
const SlideContainer = ({ children, activeSlide, dispatch }) => {
    const ref = useRef(null);

    // updates active slide based on target scroll position
    useEffect(() => {
        const setSlide = ({ target }) => {
            // calculate current slide number from window height (slide height)
            const position = Math.round(target.scrollTop / window.innerHeight);

            // only update if position has changed
            if (position !== activeSlide) dispatch({ type: "CHANGE_SLIDE", slide: position });
        };

        // add/remove listeners
        const el = ref.current;
        el.addEventListener("scroll", setSlide);

        return () => {
            el.removeEventListener("scroll", setSlide);
        };
    });
    return (
        <div ref={ref} className={container}>
            {children}
            {/* render fake content for programmatic scrolling */}
            {children.map((_, i) => (
                <div key={i} className={fakecontent} />
            ))}
        </div>
    );
};

export default connect(({ activeSlide }) => ({ activeSlide }))(SlideContainer);
