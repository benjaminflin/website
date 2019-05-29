const initialState = {
    activeSlide: 0,
    lastSlide: 0,
    numSlides: 0
};

const clamp = (x, a, b) => Math.max(Math.min(x, b), a);

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_SLIDE":
            return { ...state, activeSlide: clamp(action.slide, 0, state.numSlides - 1), lastSlide: state.activeSlide };
        case "SET_NUM_SLIDES":
            return { ...state, numSlides: action.numSlides };
        default:
            return state;
    }
};

export default reducer;
