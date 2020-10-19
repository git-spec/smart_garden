import React, {useState} from 'react';
import {Container, Row, Col, Button, Collapse, Card, CardBody, Input} from 'reactstrap';

function User() {
    const initialState = {
        change: '',
        isOpen1: false,
        isOpen2: false,
        inputHub: false
    };
    const [state, setState] = useState(initialState);
  
    const toggle1 = () => state.isOpen1 === false ? setState({...state, isOpen1: true}) : setState({...state, isOpen1: false});
    const toggle2 = () => state.isOpen2 === false ? setState({...state, isOpen2: true}) : setState({...state, isOpen2: false});
    
    const onBtnInputHub = () => {
        if (state.inputHub === false) {
            setState({...state, change: 'change'});
            setState({...state, isOpen1: true});
            setState({...state, inputHub: true});
        } else {
            setState({...state, change: ''});
            setState({...state, inputHub: false});
            setState({...state, isOpen1: false});
        };
    }
  
    return(
        <Container className="mt-5 pt-5">
            <h3 className="text-trans mb-4">Hello User</h3>
            <Row>
                <Col md="3">
                    <div>
                        <Button className="accordion text-uppercase p-0" onClick={toggle1}>
                            hubs
                        </Button>
                        <Button className={`plus-minus badge-pill btn-outline-light bg-transparent ml-3 p-1 ${state.change}`} onClick={onBtnInputHub}>
                            <svg version="1.1" className="plus"
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px" y="0px" width="67px" height="67px" viewBox="0 0 67 67" enableBackground="new 0 0 67 67">
                                <path d="M61.667,28.334H38.333V5c0-2.761-2.238-5-5-5s-5,2.239-5,5v23.334H5c-2.762,0-5,2.239-5,5s2.238,5,5,5h23.333v23.333
                                    c0,2.762,2.238,5,5,5s5-2.238,5-5V38.334h23.334c2.762,0,5-2.239,5-5S64.429,28.334,61.667,28.334z"/>
                            </svg>
                            <svg version="1.1" className="minus"
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px" y="0px" width="67px" height="67px" viewBox="0 -28.334 67 67" enableBackground="new 0 -28.334 67 67">
                                <path d="M61.667,10H5c-2.762,0-5-2.239-5-5s2.238-5,5-5h56.667c2.762,0,5,2.239,5,5S64.429,10,61.667,10z"/>
                            </svg>
                        </Button>
                        <Collapse isOpen={state.isOpen1}>
                            {state.inputHub === true ?
                                <Row>
                                    <Col>
                                        <Input className="badge-pill bg-transparent py-0" placeholder="Enter the serial number" />
                                        <Input className="badge-pill bg-transparent py-0" placeholder="Enter a name for your hub" />
                                    </Col>
                                    <Col>
                                        <Button className="plus badge-pill btn-outline-light bg-transparent ml-3 p-1">
                                            <svg version="1.1" className="plus"
                                                xmlns="http://www.w3.org/2000/svg"
                                                x="0px" y="0px" width="67px" height="67px" viewBox="0 0 67 67" enableBackground="new 0 0 67 67">
                                                <path d="M61.667,28.334H38.333V5c0-2.761-2.238-5-5-5s-5,2.239-5,5v23.334H5c-2.762,0-5,2.239-5,5s2.238,5,5,5h23.333v23.333
                                                    c0,2.762,2.238,5,5,5s5-2.238,5-5V38.334h23.334c2.762,0,5-2.239,5-5S64.429,28.334,61.667,28.334z"/>
                                            </svg>
                                        </Button>
                                    </Col>
                                </Row>
                            :
                                ''
                            }
                            <Card>
                                <CardBody className="p-0 pl-1">
                                    <Button className="accordion p-0" onClick={toggle2}>
                                        Hub 1
                                    </Button>
                                    <Button className="minus badge-pill btn-outline-light bg-transparent ml-3 p-1">
                                        <svg version="1.1" className="minus"
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px" y="0px" width="67px" height="67px" viewBox="0 -28.334 67 67" enableBackground="new 0 -28.334 67 67">
                                            <path d="M61.667,10H5c-2.762,0-5-2.239-5-5s2.238-5,5-5h56.667c2.762,0,5,2.239,5,5S64.429,10,61.667,10z"/>
                                        </svg>
                                    </Button>
                                    <Collapse isOpen={state.isOpen2}>
                                        <Card>
                                            <CardBody className="p-0 pl-1">
                                                Device 1
                                                <Button className="minus badge-pill btn-outline-light bg-transparent ml-3 p-1">
                                                    <svg version="1.1" className="minus"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        x="0px" y="0px" width="67px" height="67px" viewBox="0 -28.334 67 67" enableBackground="new 0 -28.334 67 67">
                                                        <path d="M61.667,10H5c-2.762,0-5-2.239-5-5s2.238-5,5-5h56.667c2.762,0,5,2.239,5,5S64.429,10,61.667,10z"/>
                                                    </svg>
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </CardBody>
                            </Card>
                        </Collapse>
                    </div>
                </Col>
                <Col md="9">
                </Col>
            </Row>
        </Container>
    );
}

export default User;