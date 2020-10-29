import React, {useState} from 'react'
import {
    Container,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

function Navigation(props) {

    // refs
    const toggleMobileIconRef = React.createRef();
    const toggleDesktopIconRef = React.createRef();
    const sidebarRef = React.createRef();

    // state
    const initialState = {
        collapsed: true
    };
    const [state, setState] = useState(initialState);

    // opens menu on small devices
    const toggleMobileNavbar = () => {
        toggleMobileIconRef.current.classList.toggle('open');
        sidebarRef.current.classList.toggle('active');
    };
    // opens menu on large devices
    const toggleDesktopNavbar = () => {
        toggleDesktopIconRef.current.classList.toggle('open');
        setState({...state, collapsed: !state.collapsed});
    };
    
    return (
        <Navbar fixed="top">
            <Container className="px-sm-3 px-0">
                <NavbarBrand href="/">
                    <svg version="1.1" className="logo"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px" y="0px" width="461px" height="223px" viewBox="0 0 461 223" enableBackground="new 0 0 461 223">
                        <defs>
                        </defs>
                        <path d="M266.942,89.79c-9.375-8.973-22.405-13.522-38.729-13.522h-25.461c-6.627,0-12,5.373-12,12s5.373,12,12,12h25.461
                            c19.84,0,29.08,8.68,29.08,27.316v0.725h-24.972c-0.03,0-0.059,0.004-0.089,0.005c-0.03-0.001-0.059-0.005-0.089-0.005
                            c-30.207,0-48.972,18.157-48.972,47.385s18.765,47.385,48.972,47.385h37.149c6.627,0,12-5.373,12-12v-78.633v-4.861
                            C281.293,111.845,276.331,98.776,266.942,89.79z M207.172,175.693c0-15.954,7.935-23.385,24.972-23.385
                            c0.03,0,0.059-0.004,0.089-0.005c0.03,0.001,0.059,0.005,0.089,0.005h24.972v46.77h-25.149
                            C215.107,199.078,207.172,191.647,207.172,175.693z"/>
                        <path d="M20,43.998c-11.046,0-20,8.953-20,20c0,6.537,3.15,12.323,8,15.973v11.171v119.937c0,6.627,5.373,12,12,12s12-5.373,12-12
                            V91.142V79.971c4.85-3.649,8-9.436,8-15.973C40,52.951,31.046,43.998,20,43.998z M20,72.755c-4.836,0-8.757-3.922-8.757-8.757
                            c0-4.837,3.92-8.757,8.757-8.757c4.836,0,8.757,3.92,8.757,8.757C28.757,68.833,24.836,72.755,20,72.755z"/>
                        <path d="M148.942,89.79c-9.371-8.969-22.394-13.518-38.707-13.522c-0.002,0-0.005,0-0.007,0l-39.207-0.047
                            c-6.547,0-12.014,5.463-12.014,12v122.857c0,6.627,5.373,12,12,12s12-5.373,12-12V100.235l27.193,0.033c0.005,0,0.009,0,0.014,0
                            c19.84,0,29.08,8.68,29.08,27.316v4.861v78.633c0,6.627,5.373,12,12,12s12-5.373,12-12v-78.633v-4.861
                            C163.293,111.845,158.331,98.776,148.942,89.79C139.571,80.821,158.331,98.776,148.942,89.79z"/>
                        <path d="M461.482,88.26c0-6.627-5.373-12-12-12s-12,5.373-12,12v110.843l-27.192-0.032c-0.006,0-0.01,0-0.015,0
                            c-19.84,0-29.08-8.68-29.08-27.316v-4.861V88.26c0-6.627-5.373-12-12-12s-12,5.373-12,12v78.633v4.861
                            c0,15.739,4.963,28.809,14.352,37.794c9.371,8.969,22.394,13.518,38.706,13.522c0.003,0,0.005,0,0.008,0l39.207,0.047
                            c6.536,0,12.015-5.459,12.015-12V88.26C461.482,81.632,461.482,88.26,461.482,88.26z"/>
                        <path d="M369.997,0c-6.564,0-13.451,3.164-17.957,8.05c-20.334,0.755-34.938,10.34-41.275,26.263
                            c-8.126-5.146-18.285-7.915-30.314-8.264c-4.506-4.882-11.389-8.043-17.951-8.043c-11.047,0-37,8.955-37,20
                            c0,11.047,25.954,20,37,20c6.521,0,13.357-3.122,17.865-7.952c24.029,0.892,26.885,14.56,26.885,24.927v6v142.098h24V80.98v-12
                            V54.006c0-14.404,6.481-21.245,20.903-21.938C356.66,36.887,363.485,40,369.997,40c11.047,0,37-8.953,37-20
                            C406.997,8.955,381.043,0,369.997,0z M260.468,46.763c-4.837,0-20.827-3.92-20.827-8.757c0-4.835,15.99-8.756,20.827-8.756
                            c4.835,0,10.886,3.92,10.886,8.756C271.354,42.843,265.303,46.763,260.468,46.763z M372.027,28.757
                            c-4.836,0-10.886-3.92-10.886-8.757c0-4.835,6.05-8.756,10.886-8.756c4.837,0,20.827,3.92,20.827,8.756
                            C392.854,24.837,376.864,28.757,372.027,28.757z"/>
                    </svg>
                </NavbarBrand>
                {/* navbar toggle for devices smaller than 576px */}
                <NavbarToggler className="d-block d-sm-none" onClick={toggleMobileNavbar}>
                    <div ref={toggleMobileIconRef} className="menu-icon"><span></span><span></span><span></span></div>
                </NavbarToggler>
                <div ref={sidebarRef} id="sidebar">
                    <Nav vertical className="mx-3">
                        <NavItem>
                            <NavLink className="text-white" href="/">home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">products</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">news</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">account</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">logout</NavLink>
                        </NavItem>
                    </Nav>
                </div>
                {/* navbar toggle for devices larger than 576px */}
                <NavbarToggler className="d-none d-sm-block" onClick={toggleDesktopNavbar}>
                    <div ref={toggleDesktopIconRef} className="menu-icon"><span></span><span></span><span></span></div>
                </NavbarToggler>
                <Collapse isOpen={!state.collapsed} navbar>
                    <Nav
                        // navbar 
                        // justified
                        // fill
                        horizontal="center"
                    >
                        <NavItem>
                            <NavLink className="text-white" href="/">home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">products</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">news</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">account</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-white" href="/">logout</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;