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

// take in actions and update part of applications state
export default combineReducers({
    user: userReducer,
    socket: socketReducer
});
