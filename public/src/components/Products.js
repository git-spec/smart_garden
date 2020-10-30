/* ---------------------------------------- IMPORT ---------------------------------------- */

import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
// import {Link} from 'react-router-dom';
import {
    Row,
    Col,
    // InputGroup,
    Button,
    Input,
    Container,
    Collapse,
    CardBody,
    // Card,
    CardHeader,
    Label,
    FormGroup
} from 'reactstrap';
// components
import ConfirmModal from './ConfirmModal';
import LineChart from './LineChart';
// services
import {
    checkHubNumPost,
    addHubPost,
    getHubsPost,
    deleteHubPost,
    checkDeviceNumPost,
    addDevicePost,
    getDevicesPost,
    deleteDevicePost
} from '../services/productsApi';
import {getData} from '../services/getData';

/* ---------------------------------------- SETUP ---------------------------------------- */

const Products = props => {

    const data = getData();

    // refs
    const addHubIconRef = React.createRef();
    const addDeviceIconRefs = [];
    const openHubsIconRef = React.createRef();
    const openHubIconRefs = [];
    const hubStatusRefs = [];
    const deviceStatusRefs = [];

    // state
    const initialState = {
        hubs: [],
        devices: [],
        hubName: '',
        deviceName: '',
        hubNum: '',
        deviceNum: '',
        collapseHubs: false,
        collapseHub: null,
        collapseAddHub: false,
        collapseAddDevice: null,
        confirmModalShow: false,
        confirmModalContent: null,
        confirmModalDelete: null,
        feed: []
    };
    const [state, setState] = useState(initialState);

    /* ---------------------------------------- USE EFFECT ---------------------------------------- */

    // get hubs & devices data from db at initial render
    useEffect(() => {
        getHubsPost().then(hubs => {
            switch (hubs) {
                case 2:
                    alert('Server error');
                    break;
                case 10:
                    break;
                default:
                    getDevicesPost().then(devices => {
                        switch (devices) {
                            case 2:
                                alert('Server error');
                                break;
                            case 10:
                                break;
                            default:
                                setState(state => ({...state, hubs, devices}));
                                break;
                        }
                    }).catch(err => {
                        alert(err);
                    });
                    break;
            }
        }).catch(err => {
            alert(err);
        });
    }, []);

/* ---------------------------------------- SOCKET.IO ---------------------------------------- */

    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
        // console.log('connected');
        socket.emit('user_connect', '3');
    });

    socket.on('hub_connect', sn => {
        console.log(hubStatusRefs);
        const idx = hubStatusRefs.map(foundHub => foundHub.sn).indexOf(sn);
        if (idx !== -1) {
            hubStatusRefs[idx].ref.current.classList.remove('text-danger');
            hubStatusRefs[idx].ref.current.classList.add('text-success');
        }
        console.log('hub connected', sn);
        // if (hubStatusRefs[0]) {
        //     if (hubStatusRefs[0].current) {
        //         hubStatusRefs[0].current.classList.remove('text-danger');
        //         hubStatusRefs[0].current.classList.add('text-success');
        //         console.log('hub connected.....', sn);
        //     }
        // }
    });

    socket.on('hub_disconnect', sn => {
        const idx = hubStatusRefs.map(foundHub => foundHub.sn).indexOf(sn);
        if (idx !== -1) {
            hubStatusRefs[idx].ref.current.classList.remove('text-success');
            hubStatusRefs[idx].ref.current.classList.add('text-danger');
        }
        console.log('hub disconnected', sn);
    });

    socket.on('device_connect', sn => {
        console.log(deviceStatusRefs);
        // if (deviceStatusRefs.length > 0) {
        //     const idx = deviceStatusRefs.map(foundDevice => foundDevice.sn).indexOf(sn);
        //     if (idx !== -1) {
        //         deviceStatusRefs[idx].ref.current.classList.remove('text-danger');
        //         deviceStatusRefs[idx].ref.current.classList.add('text-success');
        //     }
        // }
        console.log('device connected', sn);
    });

    socket.on('device_disconnect', sn => {
        console.log(deviceStatusRefs);
        // if (deviceStatusRefs.length > 0) {
        //     const idx = deviceStatusRefs.map(foundDevice => foundDevice.sn).indexOf(sn);
        //     if (idx !== -1) {
        //         deviceStatusRefs[idx].ref.current.classList.remove('text-success');
        //         deviceStatusRefs[idx].ref.current.classList.add('text-danger');
        //     }
        // }
        console.log('device disconnected', sn);
    });

/* ---------------------------------------- TOGGLES ---------------------------------------- */

    const toggleHubs = e => {
        // toggle up & down button
        openHubsIconRef.current.classList.toggle('up');
        openHubsIconRef.current.classList.toggle('down');
        setState({
            ...state,
            collapseHubs: !state.collapseHubs
        });
    };

    const toggleHub = (e, idx) => {
        e.preventDefault();
        // toggle up & down buttons
        openHubIconRefs.forEach((item, index) => {
            if (idx !== index) {
                item.current.classList.remove('down');
                item.current.classList.add('up');
            } else {
                item.current.classList.toggle('up');
                item.current.classList.toggle('down');
            }
        });
        setState({
            ...state,
            collapseHub: state.collapseHub === Number(idx) ? null : Number(idx)
        });
    };

    const toggleAddHub = e => {
        // toggle plus & minus button
        addHubIconRef.current.classList.toggle('plus');
        addHubIconRef.current.classList.toggle('minus');
        setState({
            ...state,
            collapseAddHub: !state.collapseAddHub
        });
    };

    const toggleAddDevice = (e, idx) => {
        e.preventDefault();
        // toggle plus & minus button
        addDeviceIconRefs[idx].current.classList.toggle('plus');
        addDeviceIconRefs[idx].current.classList.toggle('minus');
        setState({
            ...state,
            collapseAddDevice: state.collapseAddDevice === Number(idx) ? null : Number(idx)
        });
    };

/* ---------------------------------------- BUTTONS ---------------------------------------- */

    // delete hub
    const onDeleteHubBtnClick = (e, hubID) => {
        e.preventDefault();
        const deleteHub = hubID => {
            deleteHubPost(hubID).then(data => {
                if (data !== 2) {
                    setState({
                        ...state,
                        hubs: data,
                        confirmModalShow: false
                    });
                } else {
                    alert('Server error!');
                }
            }).catch(err => {
                alert(err);
            });
        };
        setState({
            ...state,
            confirmModalShow: true,
            confirmModalContent: (
                <p>
                    Are you sure you want to delete this hub?
                    <br />
                    All your devices connected to this hub will also be deleted.
                </p>
            ),
            confirmModalDelete: () => deleteHub(hubID)
        });
    };

    // delete device
    const onDeleteDeviceBtnClick = (e, deviceID) => {
        e.preventDefault();
        const deleteDevice = deviceID => {
            deleteDevicePost(deviceID).then(data => {
                if (data !== 2) {
                    setState({
                        ...state,
                        devices: data,
                        confirmModalShow: false
                    });
                } else {
                    alert('Server error!');
                }
            }).catch(err => {
                alert(err);
            });
        };
        setState({
            ...state,
            confirmModalShow: true,
            confirmModalContent: <p>Are you sure you want to delete this device?</p>,
            confirmModalDelete: () => deleteDevice(deviceID)
        });
    };

    // add hub
    const onAddHubBtnClick = e => {
        e.preventDefault();
        if (state.hubName.trim() && state.hubNum.trim()) {
            checkHubNumPost(state.hubNum.trim()).then(data => {
                // 1 serialnumber found
                // 2 server error
                // 3 serialnumber not found
                // 4 serialnumber already registered
                switch (data) {
                    case 1:
                        addHubPost(state.hubName.trim(), state.hubNum.trim()).then(data => {
                            if (data !== 2) {
                                setState({
                                    ...state,
                                    hubs: data,
                                    hubName: '',
                                    hubNum: ''
                                });
                            } else {
                                alert('Server error!');
                            }
                        }).catch(err => {
                            alert(err);
                        });
                        break;
                    case 2:
                        alert('Server error!');
                        break;
                    case 3:
                        alert('Serialnumber not found!');
                        break;
                    case 4:
                        alert('Serialnumber already registered!');
                        break;
                    default:
                        break;
                }
            }).catch(err => {
                alert(err);
            });
        } else {
            alert('Please fill out all inputs!');
        }
    };

    // add device
    const onAddDeviceBtnClick = (e, hubID) => {
        e.preventDefault();
        if (state.deviceName.trim() && state.deviceNum.trim()) {
            checkDeviceNumPost(state.deviceNum.trim()).then(data => {
                // 1 serialnumber found
                // 2 server error
                // 3 serialnumber not found
                // 4 serialnumber already registered
                switch (data) {
                    case 1:
                        addDevicePost(state.deviceName.trim(), state.deviceNum.trim(), hubID).then(data => {
                            if (data !== 2) {
                                setState({
                                    ...state,
                                    devices: data,
                                    deviceName: '',
                                    deviceNum: ''
                                });
                            } else {
                                alert('Server error!');
                            }
                        }).catch(err => {
                            alert(err);
                        });
                        break;
                    case 2:
                        alert('Server error!');
                        break;
                    case 3:
                        alert('Serialnumber not found!');
                        break;
                    case 4:
                        alert('Serialnumber already registered!');
                        break;
                    default:
                        break;
                }
            }).catch(err => {
                alert(err);
            });
        } else {
            alert('Please fill out all inputs!');
        }
    };

    /* ---------------------------------------- STRUCTURE ---------------------------------------- */

    if (state.hubs && state.devices) {
        return (
            <Container>
                {/* modal */}
                <ConfirmModal
                    className="bg-danger"
                    title="Confirm Deletion"
                    show={state.confirmModalShow}
                    delete={state.confirmModalDelete}
                    close={() => setState({...state, confirmModalShow: false})}
                >
                    {state.confirmModalContent}
                </ConfirmModal>
                <h3 className="text-trans mb-4">Hello User, how are you?</h3>
                <Row>
                    <Col lg="4">
                        <div>
                            {/* hubs */}
                            <Button className="accordion text-uppercase p-0" onClick={toggleHubs}>
                                hubs
                            </Button>
                            <Button
                                className="badge-pill btn-outline-light bg-transparent ml-3 up"
                                innerRef={openHubsIconRef}
                                onClick={toggleHubs}
                            >
                                <span></span><span></span>
                            </Button>
                            <Collapse isOpen={state.collapseHubs}>
                                {/* hub-loop */}
                                {state.hubs.map((hub, idx) => {
                                    const openHubIconRef = React.createRef();
                                    openHubIconRefs.push(openHubIconRef);
                                    const addDeviceIconRef = React.createRef();
                                    addDeviceIconRefs.push(addDeviceIconRef);
                                    const hubStatusRef = React.createRef();
                                    hubStatusRefs.push({ref: hubStatusRef, sn: hub.sn_number});
                                    return (
                                        <div key={idx}>
                                            <CardHeader className="p-0 pl-1">
                                                <Button
                                                    innerRef={hubStatusRef}
                                                    className="accordion p-0 text-danger"
                                                    onClick={e => toggleHub(e, idx)}
                                                >
                                                    {idx + 1}. Hub {hub.name}
                                                </Button>
                                                <Button
                                                    className="badge-pill btn-outline-light bg-transparent ml-3 p-0 minus"
                                                    onClick={e => onDeleteHubBtnClick(e, hub.id)}
                                                >
                                                    <span></span><span></span>
                                                </Button>
                                                <Button
                                                    className="badge-pill btn-outline-light bg-transparent ml-3 up"
                                                    innerRef={openHubIconRef}
                                                    onClick={e => toggleHub(e, idx)}
                                                >
                                                    <span></span><span></span>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={state.collapseHub === idx}>
                                                {/* device-loop */}
                                                {state.devices.filter(device => device.hub_id === hub.id).map((device, idx) => {
                                                    const deviceStatusRef = React.createRef();
                                                    deviceStatusRefs.push({ref: deviceStatusRef, sn: device.sn_number});
                                                    return (
                                                        <CardBody key={idx} className="p-0 pl-1">
                                                            {/* <div ref={ref => { deviceStatusRef.current[idx] = ref; }} className="text-danger"> */}
                                                            <div ref={deviceStatusRef} className="text-danger">
                                                                {idx + 1}. Device {device.name} | {device.device_name}
                                                            </div>
                                                            <Button
                                                                className="badge-pill btn-outline-light bg-transparent ml-3 p-0 minus"
                                                                onClick={e => onDeleteDeviceBtnClick(e, device.id)}
                                                            >
                                                                <span></span><span></span>
                                                            </Button>
                                                        </CardBody>
                                                    );
                                                })}
                                                {/* add device */}
                                                <CardBody className="p-0 pl-1">
                                                    <Button
                                                        className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                                        innerRef={addDeviceIconRef}
                                                        onClick={e => toggleAddDevice(e, idx)}
                                                    >
                                                        <span></span><span></span>
                                                    </Button>
                                                    <Collapse isOpen={state.collapseAddDevice === idx}>
                                                        <Row>
                                                            <Col>
                                                                <Input
                                                                    className="badge-pill bg-transparent py-0"
                                                                    placeholder="Enter a serial number"
                                                                    onChange={e =>
                                                                        setState({...state, deviceNum: e.target.value})
                                                                    }
                                                                    value={state.deviceNum}
                                                                />
                                                                <Input
                                                                    className="badge-pill bg-transparent py-0"
                                                                    placeholder="Enter a name for your device"
                                                                    onChange={e =>
                                                                        setState({...state, deviceName: e.target.value})
                                                                    }
                                                                    value={state.deviceName}
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <Button
                                                                    className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                                                    onClick={e => onAddDeviceBtnClick(e, hub.id)}
                                                                >
                                                                    <span></span><span></span>
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Collapse>
                                                </CardBody>
                                            </Collapse>
                                        </div>
                                    );
                                })}
                                {/* add hub */}
                                {/* {console.log(hubStatusRefs)} */}
                                <div>
                                    <CardHeader className="p-0 pl-1">
                                        <Button
                                            innerRef={addHubIconRef}
                                            className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                            onClick={toggleAddHub}
                                        >
                                            <span></span><span></span>
                                        </Button>
                                    </CardHeader>
                                    {/* <CardBody> */}
                                    <Collapse isOpen={state.collapseAddHub}>
                                        <Row>
                                            <Col>
                                                <Input
                                                    className="badge-pill bg-transparent py-0"
                                                    placeholder="Enter a serial number"
                                                    onChange={e => setState({...state, hubNum: e.target.value})}
                                                    value={state.hubNum}
                                                />
                                                <Input
                                                    className="badge-pill bg-transparent py-0"
                                                    placeholder="Enter a name for your hub"
                                                    onChange={e => setState({...state, hubName: e.target.value})}
                                                    value={state.hubName}
                                                />
                                            </Col>
                                            <Col>
                                                <Button
                                                    className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                                    onClick={onAddHubBtnClick}
                                                >
                                                    <span></span><span></span>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Collapse>
                                    {/* </CardBody> */}
                                </div>
                            </Collapse>
                        </div>
                    </Col>
                    <Col className="p-3" lg="8">
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                        <p className="text-light">
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                            et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                            diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                            gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                        </p>
                        <LineChart data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" />
                        <FormGroup>
                            <Label for="rangeInput">Range</Label>
                            <Input
                                type="range"
                                id="rangeInput"
                                name="rangeInput"
                                min="0"
                                max="100"
                                // onInput="this.output.amount.value=this.value"
                            />
                            <output name="amount" id="amount" htmlFor="rangeInput">
                                0
                            </output>
                        </FormGroup>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Products;
