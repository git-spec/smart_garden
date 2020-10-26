import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button, Collapse, Card, CardBody, Input, Label, FormGroup} from 'reactstrap';
import LineChart from './LineChart';
import {getData} from '../services/getData';

function User() {
    const initialState = {
        isPlusMinus: 'plus',
        isUpDown: 'up',
        isOpen1: false,
        isOpen2: false,
        inputHub: false,
        feed: []
    };
    const [state, setState] = useState(initialState);
  
    const toggle1 = () => state.isOpen1 === false ? setState({...state, isOpen1: true}) : setState({...state, isOpen1: false});
    const toggle2 = () => state.isOpen2 === false ? setState({...state, isOpen2: true}) : setState({...state, isOpen2: false});
    
    const onBtnIsOpen = e => {
        e.preventDefault();
        if (state.inputHub === false) {
            setState({...state, isOpen1: true});
        } else {
            setState({...state, isOpen1: false});
        };
    }
    const onBtnInputHub = e => {
        e.preventDefault();
        if (state.inputHub === false) {
            setState({...state, inputHub: true});
        } else {   
            setState({...state, inputHub: false});
        };
    }
    // change plus to minus 
    const onBtnPlusMinus = e => {
        e.preventDefault();
        if (state.isPlusMinus === 'plus') {
            setState({...state, isPlusMinus: 'minus'});
        } else {
            setState({...state, isPlusMinus: 'plus'});
        };
    }
    // change up to down
    const onBtnUpDown = e => {
        e.preventDefault();
        if (state.isUpDown === 'up') {
            setState({...state, isUpDown: 'down'});
        } else {
            setState({...state, isUpDown: 'up'});
        }
    }

    useEffect(() => {
        // window.setInterval(() => {
        //   setState({
        //     ...state,
        //     feed: getData()
        //   })
        // }, 5000)
    })

    const data = {
        "title": "Visits",
        "data": [
          {
            "time": 'Tue',
            "value": 39
          },
          {
            "time": 'Wed',
            "value": 60
          }
        ]
      };

    // console.log(state.feed);
  
    return(
        <Container>
            <h3 className="text-trans mb-4">Hello User, how are you?</h3>
            <Row>
                <Col lg="4">
                    <div>
                        <Button className="accordion text-uppercase p-0" onClick={toggle1}>
                            hubs
                        </Button>
                        <Button className={`badge-pill btn-outline-light bg-transparent ml-3 p-0 ${state.isPlusMinus}`} onClick={e => onBtnPlusMinus(e)}><span></span><span></span></Button>
                        <Button className="minus badge-pill btn-outline-light bg-transparent ml-3 p-0" onClick={e => onBtnPlusMinus(e)}><span></span><span></span></Button>
                        <Button className={`badge-pill btn-outline-light bg-transparent ml-3 ${state.isUpDown}`} onClick={e => onBtnUpDown(e)}><span></span><span></span></Button>
                        <Collapse isOpen={state.isOpen1}>
                            {state.inputHub === true ?
                                <Row>
                                    <Col>
                                        <Input className="badge-pill bg-transparent py-0" placeholder="Enter the serial number" />
                                        <Input className="badge-pill bg-transparent py-0" placeholder="Enter a name for your hub" />
                                    </Col>
                                    <Col>
                        <Button className={`badge-pill btn-outline-light bg-transparent ml-3 ${state.isUpDown}`} onClick={e => onBtnUpDown(e)}><span></span><span></span></Button>
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
                <Col className="p-3" lg="8">
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                    <p className="text-light">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    <LineChart data={data.data} title={data.title} color='white' />
                    
      <FormGroup>
        <Label for="rangeInput">Range</Label>
        <Input type="range" id="rangeInput" 
       name="rangeInput" min="0" max="100"
       oninput="this.output.amount.value=this.value" />
       <output name="amount" id="amount" htmlFor="rangeInput">0</output>
      </FormGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default User;