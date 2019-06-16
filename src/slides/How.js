import React from "react";
import { container, logo, content, separator } from "./How.module.css";
import useAnimation from "../util/useAnimation";
const How = ({ active }) => {
    const fadeInAnimation = (delay = 0) => animate => {
        const keyframes = [
            { opacity: 0, transform: "translateY(10px)" },
            { opacity: 1, transform: "translateY(0)" }
        ];
        const options = {
            duration: 900,
            delay,
            easing: "ease-in-out",
            fill: "forwards"
        };
        if (!active) options.direction = "reverse";
        animate(keyframes, options);
    };

    const separatorRef = useAnimation(
        animate => {
            const keyframes = [
                { transform: `scaleX(0)` },
                { transform: `scaleX(1)` }
            ];
            const options = {
                duration: 900,
                easing: "ease-in-out",
                fill: "forwards"
            };
            if (!active) options.direction = "reverse";
            animate(keyframes, options);
        },
        [active]
    );

    const imgRef = useAnimation(fadeInAnimation(), [active]);
    const headerRef = useAnimation(fadeInAnimation(50), [active]);
    const contentRef = useAnimation(fadeInAnimation(150), [active]);
    return (
        <div className={container}>
            <img
                ref={imgRef}
                src="react-redux.png"
                alt="react-redux"
                className={logo}
            />
            <h1 ref={headerRef}>How it's Made</h1>
            <div ref={separatorRef} className={separator} />
            <p ref={contentRef} className={content}>
                I made this website with react + redux. I took this opportunity
                to challenge myself, so every component is made from the tools
                only given by <code>create-react-app</code> cli and redux. The
                particle system in the background was made in{" "}
                <code>webgl2</code>. I used shaders to compute the positions of
                the particles after filtering them through a curl noise
                functions and used floating point textures to read and display
                them. This website is still in development and I expect some
                minor changes in the future.
            </p>
        </div>
    );
};

export default How;
