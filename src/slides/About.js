import React from "react";
import useAnimation from "../util/useAnimation";
import {
    container,
    separator,
    profile,
    header,
    paragraph,
    link
} from "./About.module.css";
const About = ({ active }) => {
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

    const fadeAnimation = animate => {
        const keyframes = [{ opacity: 0 }, { opacity: 1 }];
        const options = {
            duration: 900,
            easing: "ease-in-out",
            fill: "forwards"
        };
        if (!active) options.direction = "reverse";
        animate(keyframes, options);
    };
    const textRef = useAnimation(fadeAnimation, [active]);
    const imgRef = useAnimation(fadeAnimation, [active]);
    const headerRef = useAnimation(fadeAnimation, [active]);
    return (
        <div className={container}>
            <a href="https://facebook.com/benrflin">
                <img
                    ref={imgRef}
                    src="https://graph.facebook.com/100005109492782/picture?type=large"
                    alt="profile"
                    className={profile}
                />
            </a>
            <h1 ref={headerRef} className={header}>
                About Me
            </h1>
            <div className={separator} ref={separatorRef} />
            <p ref={textRef} className={paragraph}>
                Hi, I'm Ben Flin. I grew up in Davis, California and I'm
                currently enrolled at Columbia University (CC, '21), majoring in
                Computer Science. I do frontend development right now and I'm
                currently teaching myself machine learning. I also play jazz
                piano and love{" "}
                <a
                    className={link}
                    href="https://open.spotify.com/playlist/3TbVlB1eSakKQozECtUSLr"
                >
                    listening
                </a>{" "}
                to jazz.
            </p>
        </div>
    );
};

export default About;
