export const setUserAction = user => {
    return {
        type: 'CHANGE_USER',
        payload: user
    };
};

export const setSocketAction = socket => {
    return {
        type: 'CHANGE_SOCKET',
        payload: socket
    };
};
