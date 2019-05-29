import { useLayoutEffect, useRef } from "react";
const useAnimation = (callback, deps) => {
    // dom element to do animation on
    const ref = useRef(null);

    useLayoutEffect(() => {
        // error checking
        const el = ref.current;
        if (!el) {
            console.warn("could not find ref to animate");
            return;
        }

        // animation callback
        const animate = (keyframes, options) => el.animate(keyframes, options);

        // call callback with animate function
        callback(animate);
    }, [deps, callback]);

    return ref;
};

export default useAnimation;
