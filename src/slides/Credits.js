import React from "react";
import { container, logo } from "./Credits.module.css";
const Credits = ({ active }) => {
    return (
        <div className={container}>
            <img src="react-redux.png" alt="react-redux" className={logo} />
            <p>Made with React + Redux</p>
        </div>
    );
};

export default Credits;
