import React from "react";
import { useSpring, animated } from "react-spring";
import InstagramIcon from "../images/instagram.svg";
import GithubIcon from "../images/github.svg";
import FacebookIcon from "../images/facebook.svg";
import {
  container,
  center,
  title,
  links,
  separator,
  name,
  subtitle,
  personal,
  portfolio
} from "./home.module.css";
import { Link } from "gatsby";
const useFadeIn = config => {
  return useSpring({
    config,
    to: { opacity: 1 },
    from: { opacity: 0 }
  });
};

const Home = () => {
  const slow = useFadeIn({ tension: 25 });
  const med = useFadeIn({ tension: 50 });
  const fast = useFadeIn({ tension: 100 });

  const rotate = useSpring({
    to: { transform: "rotate(7deg)" },
    from: { transform: "rotate(0deg)" }
  });

  const fromLeft = useSpring({
    to: { transform: "translate(0%)" },
    from: { transform: "translate(-100%)" }
  });

  const fromRight = useSpring({
    to: { transform: "translate(0%)" },
    from: { transform: "translate(100%)" }
  });
  return (
    <main className={container}>
      <div className={center}>
        <div className={personal}>
          <Link to="/">{"<< Personal"}</Link>
        </div>
        <div className={portfolio}>
          <Link to="/portfolio">{"Portfolio >>"}</Link>
        </div>
        <div className={title}>
          <div className={name}>
            <animated.div style={fromRight}>ben</animated.div>
          </div>
          <animated.div className={separator} style={rotate} />
          <div className={name}>
            <animated.div style={fromLeft}>flin</animated.div>
          </div>
        </div>
        <animated.div className={subtitle} style={fast}>
          Web Developer and Musician
        </animated.div>
        <animated.div className={links} style={med}>
          <a href="mailto:ben@flin.org">ben@flin.org</a>
          <a href="tel:530-400-1959">530.400.1959</a>
        </animated.div>
        <animated.div className={links} style={slow}>
          <a href="https://instagram.com/benflin">
            <InstagramIcon />
          </a>
          <a href="https://github.com/benjaminflin">
            <GithubIcon />
          </a>
          <a href="https://facebook.com/benrflin">
            <FacebookIcon />
          </a>
        </animated.div>
      </div>
    </main>
  );
};

export default Home;
