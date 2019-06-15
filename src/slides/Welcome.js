import React from "react";
import { connect } from "react-redux";
import useAnimation from "../util/useAnimation";
import { changeSlide } from "../actions";
import {
    container,
    title,
    links,
    separator,
    name,
    subtitle,
    scroll
} from "./Welcome.module.css";
const Welcome = ({ active, dispatch }) => {
    // first name translation
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
    // last name translation
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
    // rotation animation of the separator
    const separatorRef = useAnimation(
        animate => {
            const keyframes = [
                { transform: "rotate(0)" },
                { transform: "rotate(5deg)" }
            ];
            const options = {
                duration: 900,
                easing: "ease-in-out",
                fill: "forwards"
            };
            animate(keyframes, options);
        },
        [active]
    );

    // fade in animation with optional delay
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
    const linkRef = useAnimation(fadeInAnimation());
    const subtitleRef = useAnimation(fadeInAnimation(50));
    const contactRef = useAnimation(fadeInAnimation(100));
    const scrollInfoRef = useAnimation(fadeInAnimation(150));
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
            <div className={subtitle} ref={subtitleRef}>
                Web Developer and Musician
            </div>
            <div className={links} ref={contactRef}>
                <a href="mailto:ben@flin.org">ben@flin.org</a>
                <a href="tel:530-400-1959">530.400.1959</a>
            </div>
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
            <div ref={scrollInfoRef} className={scroll}>
                Scroll to Continue
                <i
                    onClick={() => dispatch(changeSlide(1))}
                    className="fas fa-chevron-down"
                />
            </div>
        </div>
    );
};
export default connect()(Welcome);
