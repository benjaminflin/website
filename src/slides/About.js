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

    const textRef = useAnimation(fadeInAnimation(), [active]);
    const imgRef = useAnimation(fadeInAnimation(50), [active]);
    const headerRef = useAnimation(fadeInAnimation(150), [active]);
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
                piano. Check out my{" "}
                <a
                    className={link}
                    href="https://open.spotify.com/playlist/3TbVlB1eSakKQozECtUSLr"
                >
                    spotify playlist
                </a>{" "}
                if you're interested in what I'm listening to.
            </p>
        </div>
    );
};

export default About;
