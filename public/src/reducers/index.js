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

// take in actions and update part of applications state
export default combineReducers({
    user: userReducer,
    socket: socketReducer,
    backgroundUrl: backgroundImageReducer,
    backgroundColor1: backgroundColor1Reducer,
    backgroundColor5: backgroundColor5Reducer,
    nav: navReducer
});
