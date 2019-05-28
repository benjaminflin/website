import React from "react";
import { container } from "./Slide.module.css";
const SlideContainer = ({ children }) => {
    return (
        <div style={{ height: `${100 * children.length}vh` }} className={container}>
            {children}
        </div>
    );
};

export default SlideContainer;
