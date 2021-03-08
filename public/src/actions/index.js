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

export const setSlide1Action = slide1 => {
    return {
        type: 'SLIDE_1',
        payload: slide1
    };
}

export const setSlide2Action = slide2 => {
    return {
        type: 'SLIDE_2',
        payload: slide2
    };
}

export const setSlide3Action = slide3 => {
    return {
        type: 'SLIDE_3',
        payload: slide3
    };
}

export const setSlideAni1Action = slideAni1 => {
    return {
        type: 'SLIDE_ANI_1',
        payload: slideAni1
    };
}

export const setSlideAni2Action = slideAni2 => {
    return {
        type: 'SLIDE_ANI_2',
        payload: slideAni2
    };
}

export const setSlideAni3Action = slideAni3 => {
    return {
        type: 'SLIDE_ANI_3',
        payload: slideAni3
    };
}