import React from 'react';
import ViewportProvider from '../components/ViewportProvider';
// get window width and height from context of viewport provider
export const useViewport = () => {
    const {width, height} = React.useContext(viewportContext);
    return {width, height};
}