import React, { useLayoutEffect, useRef } from "react";
import { container, title, links, separator, name, about, subtitle } from "./Welcome.module.css";
const Welcome = ({ active, incrementSlide }) => {
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const separatorRef = useRef(null);
    const linkRef = useRef(null);
    const animate = (ref, animation, timing) => {
        if (ref.current) {
            ref.current.animate(animation, timing);
        }
    };

    useLayoutEffect(() => {
        const firstNameAnimation = [
            {
                transform: "translateX(100%)"
            },
            {
                transform: "translateX(0)"
            }
        ];

        const lastNameAnimation = [
            {
                transform: "translateX(-100%)"
            },
            {
                transform: "translateX(0)"
            }
        ];

        const separatorAnimation = [{ transform: "rotate(0)" }, { transform: "rotate(5deg)" }];

        const linkFadeAnimation = [{ opacity: 0 }, { opacity: 1 }];

        const timing = { duration: 900, easing: "ease-in-out", fill: "forwards" };
        if (!active) {
            firstNameAnimation.reverse();
            lastNameAnimation.reverse();
            linkFadeAnimation.reverse();
            timing.duration = 200;
        }

        animate(firstNameRef, firstNameAnimation, timing);
        animate(lastNameRef, lastNameAnimation, timing);
        animate(separatorRef, separatorAnimation, timing);
        animate(linkRef, linkFadeAnimation, timing);
    }, [active]);

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
            <div className={about} onClick={incrementSlide}>
                <i className="fas fa-arrow-right" />
            </div>
        </div>
    );
};
export default Welcome;
