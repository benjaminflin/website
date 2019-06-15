import React from "react";
import { content } from "./Slide.module.css";
const Slide = ({ children }) => (
    <section className={content}>{children}</section>
);
export default Slide;
