import React, { useRef, useEffect } from "react";
import particleSim from "../util/particle_sim/particleSim";
const Background = () => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const canvas = ref.current;
            canvas.style = "position: fixed; z-index: -1;";
            particleSim(canvas);
        }
    }, []);
    return <canvas ref={ref} />;
};

export default Background;
