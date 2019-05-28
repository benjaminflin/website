const initialState = {
    slidePositions: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
    activeSlide: 0,
    lastSlide: 0
};

const clamp = (x, a, b) => Math.max(Math.min(x, b), a);

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_SLIDE":
            return { ...state, activeSlide: clamp(action.slide, 0, state.slidePositions.length - 1), lastSlide: state.activeSlide };
        default:
            return state;
    }
};

export default reducer;
