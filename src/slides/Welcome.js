import React from "react";
import useAnimation from "../util/useAnimation";
import { container, title, links, separator, name, subtitle } from "./Welcome.module.css";
const Welcome = ({ active }) => {
    const firstNameRef = useAnimation(
        animate => {
            const keyframes = [
                {
                    transform: "translateX(100%)"
                },
                {
                    transform: "translateX(0)"
                }
            ];
            const options = { duration: 900, easing: "ease-in-out", fill: "forwards" };
            if (!active) options.direction = "reverse";
            animate(keyframes, options);
        },
        [active]
    );
    const lastNameRef = useAnimation(
        animate => {
            const keyframes = [
                {
                    transform: "translateX(-100%)"
                },
                {
                    transform: "translateX(0)"
                }
            ];
            const options = { duration: 900, easing: "ease-in-out", fill: "forwards" };
            if (!active) options.direction = "reverse";
            animate(keyframes, options);
        },
        [active]
    );
    const separatorRef = useAnimation(
        animate => {
            const keyframes = [{ transform: "rotate(0)" }, { transform: "rotate(5deg)" }];
            const options = { duration: 900, easing: "ease-in-out", fill: "forwards" };
            animate(keyframes, options);
        },
        [active]
    );
    const linkRef = useAnimation(animate => {
        const keyframes = [{ opacity: 0 }, { opacity: 1 }];
        const options = { duration: 900, easing: "ease-in-out", fill: "forwards" };
        if (!active) options.direction = "reverse";
        animate(keyframes, options);
    });

    return (
        <div className={container}>
            <div className={title}>
                <div className={name}>
                    <div ref={firstNameRef}>ben</div>
                </div>
                <div className={separator} ref={separatorRef} />
                <div className={name}>
                    <div ref={lastNameRef}>flin</div>
                </div>
            </div>
            <div className={subtitle}>Web Developer and Musician</div>
            <div ref={linkRef} className={links}>
                <a href="https://instagram.com/benflin">
                    <i className="fab fa-instagram" />
                </a>
                <a href="https://github.com/benjaminflin">
                    <i className="fab fa-github" />
                </a>
                <a href="https://facebook.com/benrflin">
                    <i className="fab fa-facebook-f" />
                </a>
            </div>
        </div>
    );
};
export default Welcome;
