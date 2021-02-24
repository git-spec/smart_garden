export const setUserAction = user => {
    return {
        type: 'CHANGE_USER',
        payload: user
    };
}

export const setSocketAction = socket => {
    return {
        type: 'CHANGE_SOCKET',
        payload: socket
    };
}

export const setBackgroundImageAction = backgroundUrl => {
    return {
        type: 'CHANGE_BGIMG',
        payload: backgroundUrl
    };
};

export const setBackgroundColor1Action = backgroundColor1 => {
    return {
        type: 'CHANGE_BGCOLOR_1',
        payload: backgroundColor1
    };
}

export const setBackgroundColor5Action = backgroundColor5 => {
    return {
        type: 'CHANGE_BGCOLOR_5',
        payload: backgroundColor5
    };
}

export const setNavAction = nav => {
    return {
        type: 'CHANGE_NAV',
        payload: nav
    };
}