import {combineReducers} from 'redux';

const userReducer = (user = null, action) => {
    if (action.type === 'CHANGE_USER') {
        // if action contains payload the main state has changed
        return action.payload;
    }
    return user;
};

const socketReducer = (socket = null, action) => {
    if (action.type === 'CHANGE_SOCKET') {
        return action.payload;
    }
    return socket;
};

const backgroundImageReducer = (backgroundUrl = null, action) => {
    if (action.type === 'CHANGE_BGIMG') {
        return action.payload;
    }
    return backgroundUrl;
};

const backgroundColor1Reducer = (backgroundColor1 = null, action) => {
    if (action.type === 'CHANGE_BGCOLOR_1') {
        return action.payload;
    }
    return backgroundColor1;
};

const backgroundColor5Reducer = (backgroundColor5 = null, action) => {
    if (action.type === 'CHANGE_BGCOLOR_5') {
        return action.payload;
    }
    return backgroundColor5;
};

const navReducer = (nav = null, action) => {
    if (action.type === 'CHANGE_NAV') {
        return action.payload;
    }
    return nav;
};

const slide1Reducer = (slide1 = null, action) => {
    if (action.type === 'SLIDE_1') {
        return action.payload;
    }
    return slide1;
};

const slide2Reducer = (slide2 = null, action) => {
    if (action.type === 'SLIDE_2') {
        return action.payload;
    }
    return slide2;
};

const slide3Reducer = (slide3 = null, action) => {
    if (action.type === 'SLIDE_3') {
        return action.payload;
    }
    return slide3;
};

const slideAni1Reducer = (slideAni1 = null, action) => {
    if (action.type === 'SLIDE_ANI_1') {
        return action.payload;
    }
    return slideAni1;
};

const slideAni2Reducer = (slideAni2 = null, action) => {
    if (action.type === 'SLIDE_ANI_2') {
        return action.payload;
    }
    return slideAni2;
};

const slideAni3Reducer = (slideAni3 = null, action) => {
    if (action.type === 'SLIDE_ANI_3') {
        return action.payload;
    }
    return slideAni3;
};

// take in actions and update part of applications state
export default combineReducers({
    user: userReducer,
    socket: socketReducer,
    backgroundUrl: backgroundImageReducer,
    backgroundColor1: backgroundColor1Reducer,
    backgroundColor5: backgroundColor5Reducer,
    nav: navReducer,
    slide1: slide1Reducer,
    slide2: slide2Reducer,
    slide3: slide3Reducer,
    slideAni1: slideAni1Reducer,
    slideAni2: slideAni2Reducer,
    slideAni3: slideAni3Reducer
});
