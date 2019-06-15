export const changeSlide = (slide = 0) => {
    window.scrollTo({ top: window.innerHeight * slide, behavior: "smooth" });

    return {
        type: "CHANGE_SLIDE",
        slide
    };
};
