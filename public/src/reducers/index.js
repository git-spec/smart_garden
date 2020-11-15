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

const backgroundColorReducer = (backgroundColor = null, action) => {
    if (action.type === 'CHANGE_BGCOLOR') {
        return action.payload;
    }
    return backgroundColor;
};

const backgroundColor100Reducer = (backgroundColor100 = null, action) => {
    if (action.type === 'CHANGE_BGCOLOR100') {
        return action.payload;
    }
    return backgroundColor100;
};

const backgroundColor70Reducer = (backgroundColor70 = null, action) => {
    if (action.type === 'CHANGE_BGCOLOR70') {
        return action.payload;
    }
    return backgroundColor70;
};

// take in actions and update part of applications state
export default combineReducers({
    user: userReducer,
    socket: socketReducer,
    backgroundUrl: backgroundImageReducer,
    backgroundColor: backgroundColorReducer,
    backgroundColor100: backgroundColor100Reducer,
    backgroundColor70: backgroundColor70Reducer
});
