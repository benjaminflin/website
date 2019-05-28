import React, { useRef, useEffect } from "react";
import { container, separator, profile, header, paragraph, strong, link } from "./About.module.css";
const About = ({ active }) => {
    const separatorRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef(null);

    const animate = (ref, animation, timing) => {
        if (ref.current) {
            ref.current.animate(animation, timing);
        }
    };

    useEffect(() => {
        const separatorAnimation = [{ transform: `scaleX(0)` }, { transform: `scaleX(1)` }];
        const fadeAnimation = [{ opacity: 0 }, { opacity: 1 }];

        const timing = { duration: 900, easing: "ease-in-out", fill: "forwards" };

        if (!active) {
            separatorAnimation.reverse();
            fadeAnimation.reverse();
        }
        animate(separatorRef, separatorAnimation, timing);
        animate(textRef, fadeAnimation, timing);
        animate(imgRef, fadeAnimation, timing);
    }, [active]);

    return (
        <div class={container}>
            <img ref={imgRef} src="https://graph.facebook.com/100005109492782/picture?type=large" alt="profile" className={profile} />
            <h1 className={header}>About Me</h1>
            <div class={separator} ref={separatorRef} />
            <p ref={textRef} className={paragraph}>
                <strong className={strong}>H</strong>i, I'm Ben Flin. I grew up in Davis, California and I'm currently enrolled at Columbia University (CC, '21), majoring in Computer Science. I do
                frontend development right now and I'm currently teaching myself about machine learning. I also play jazz piano and love{" "}
                <a className={link} href="https://open.spotify.com/playlist/3TbVlB1eSakKQozECtUSLr">
                    listening
                </a>{" "}
                to jazz.
            </p>
        </div>
    );
};

export default About;
