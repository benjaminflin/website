import React from "react";
import {
    container,
    video,
    separator,
    credits,
    description
} from "./Video.module.css";
import useAnimation from "../util/useAnimation";
const Video = ({ active }) => {
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

    const iframeRef = useAnimation(fadeInAnimation(), [active]);
    const headerRef = useAnimation(fadeInAnimation(50), [active]);
    const descriptionRef = useAnimation(fadeInAnimation(150), [active]);
    const creditsRef = useAnimation(fadeInAnimation(250), [active]);

    return (
        <div className={container}>
            <iframe
                ref={iframeRef}
                className={video}
                title="youtube"
                src="https://www.youtube.com/embed/m8wwTS2hfX8?start=69"
                frameBorder="0"
            />
            <h1 ref={headerRef}>Video</h1>
            <div ref={separatorRef} className={separator} />
            <p ref={descriptionRef} className={description}>
                This video is of me playing over my composition, &ldquo;Banality
                of Evil,&rdquo; at Shine Cafe in Sacramento, CA. If you want to
                get together to play or hire me for a gig, just contact me at my{" "}
                <a href="mailto:ben@flin.org">phone</a> or{" "}
                <a href="tel:(530)-400-1959">email.</a>
            </p>
            <small ref={creditsRef} className={credits}>
                Cooper Nelson - Alto Saxophone
                <br />
                Marti Sarigul-Klijn - Tenor Saxophone
                <br />
                Joshua Wisterman - Guitar
                <br />
                Benjamin Flin - Keyboard
                <br />
                Alex Reiff - Bass
                <br />
                Dana Wendel - Drums
                <br />
            </small>
        </div>
    );
};

export default Video;
