import React from 'react';

const viewportContext = React.createContext({});

const ViewportProvider = ({children}) => {
    // add state variable width and default it to the current window height
    const [width, setWidth] = React.useState(window.innerWidth);
    // add state variable height and default it to the current window height
    const [height, setHeight] = React.useState(window.innerHeight);

    React.useEffect(() => {
        // set the height in state as well as the width
        const handleWindowResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        // add event listener to window for getting current width and height and setting them to state
        window.addEventListener("resize", handleWindowResize);
        // cleanup event listener
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
    // store width and height in the value of the Provider
    return (
        <viewportContext.Provider value={{width, height}}>
            {children}
        </viewportContext.Provider>
    );
};

export default ViewportProvider;