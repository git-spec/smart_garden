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

export const setBackgroundImageAction = backgroundUrl => {
    return {
        type: 'CHANGE_BGIMG',
        payload: backgroundUrl
    };
};

export const setBackgroundColorAction = backgroundColor => {
    return {
        type: 'CHANGE_BGCOLOR',
        payload: backgroundColor
    };
};

export const setBackgroundColor100Action = backgroundColor100 => {
    return {
        type: 'CHANGE_BGCOLOR100',
        payload: backgroundColor100
    };
};

export const setBackgroundColor70Action = backgroundColor70 => {
    return {
        type: 'CHANGE_BGCOLOR70',
        payload: backgroundColor70
    };
};
