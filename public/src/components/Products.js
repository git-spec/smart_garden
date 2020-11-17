/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useState, useEffect, Fragment} from 'react';
// router dom
import {useHistory} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {
    setSocketAction,
    setBackgroundImageAction,
    setBackgroundColorAction,
    setBackgroundColor100Action,
    setBackgroundColor70Action
} from '../actions';
// socket
import io from 'socket.io-client';
// reactstrap
import {
    Row,
    Col,
    Button,
    Input,
    Container,
    Collapse,
    CardBody,
    Card,
    CardHeader,
    CardTitle,
    CardSubtitle,
    CardText
} from 'reactstrap';
// components
import ConfirmModal from './ConfirmModal';
import MonitorAll from './MonitorAll';
import MonitorSoil from './MonitorSoil';
import MonitorWater from './MonitorWater';
import MonitorTempHum from './MonitorTempHum';
import MonitorLight from './MonitorLight';
// window dimension hook
import {useWindowDimension} from './UseWindowDimension';
// services
import {
    checkHubNumPost,
    addHubPost,
    getHubsPost,
    deleteHubPost,
    checkDeviceNumPost,
    addDevicePost,
    getDevicesPost,
    deleteDevicePost,
    deviceOnOffPost,
    saveRangesPost
} from '../services/productsApi';

/* ********************************************************* COMPONENT ********************************************************* */
const Products = props => {

    const history = useHistory();
    const [width, height] = useWindowDimension();

/* ********************************************************* REFERENCES ********************************************************* */
    const addHubIconRef = React.createRef();
    const addDeviceIconRefs = [];
    // const openHubsIconRef = React.createRef();
    const openHubIconRefs = [];
    const shineHubRefs = [];
    const shineDeviceRefs = [];

/* ********************************************************* STATE ********************************************************* */
    const initialState = {
        // hubs & devices
        hubs: [],
        devices: [],
        hubName: '',
        deviceName: '',
        hubNum: '',
        deviceNum: '',
        // collapse
        collapseHubs: false,
        collapseHub: null,
        collapseAddHub: false,
        collapseAddDevice: null,
        // modal
        confirmModalShow: false,
        confirmModalContent: null,
        confirmModalDelete: null,
        // monitor
        realTimeData: {},
        currentHub: {},
        currentDevice: {}
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* USE EFFECT ********************************************************* */
    useEffect(() => {
        // delete image-url
        // props.setBackgroundImageAction("");
        // store class color-5
        props.setBackgroundColorAction('color-5');
        // store class color100
        props.setBackgroundColor100Action("color100");
        props.setBackgroundColor70Action(null);

        // get hubs & devices data from db at initial render
        getHubsPost().then(hubs => {
            if (hubs === 2) {
                alert('Server error');
            } else if (hubs === 10) {
                history.push('/login');
            } else {
                getDevicesPost().then(devices => {
                    if (devices === 2) {
                        alert('Server error');
                    } else if (devices === 10) {
                        history.push('/login');
                    } else {
                        setState({...state, hubs, devices});
                    }
                }).catch(err => {
                    alert(err);
                });
            }
        }).catch(err => {
            alert(err);
        });
    // eslint-disable-next-line
    }, []);

/* ********************************************************* SOCKET.IO ********************************************************* */
    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('connected');
            props.setSocketAction(socket);
            socket.emit('user_connect', props.user.id);
        });

        socket.on('hub_connect', sn => {
            if (state.hubs) {
                setState(state => {
                    const hubs = [...state.hubs];
                    const hub = hubs.find(hub => hub.sn_number === sn);
                    const idx = hubs.map(hub => hub.sn_number).indexOf(sn);
                    if (hub) {
                        hub.connected = 1;
                        hubs[idx] = hub;
                        console.log('hub connected', sn);
                    }
                    return ({...state, hubs});
                });
            }
        });

        socket.on('hub_disconnect', sn => {
            if (state.hubs) {
                setState(state => {
                    const hubs = [...state.hubs];
                    const hub = hubs.find(hub => hub.sn_number === sn);
                    const idx = hubs.map(hub => hub.sn_number).indexOf(sn);
                    if (hub) {
                        hub.connected = 0;
                        hubs[idx] = hub;
                        console.log('hub disconnected', sn);
                    }
                    return ({...state, hubs});
                });
            }
        });

        socket.on('device_connect', sn => {
            if (state.devices) {
                setState(state => {
                    let devices = [...state.devices];
                    const device = devices.find(device => device.sn_number === sn);
                    const idx = devices.map(device => device.sn_number).indexOf(sn);
                    if (device) {
                        device.connected = 1;
                        devices[idx] = device;
                        console.log('device connected', sn);
                    }
                    return ({...state, devices});
                });
            }
        });

        socket.on('device_disconnect', sn => {
            if (state.devices) {
                setState(state => {
                    let devices = [...state.devices];
                    const device = devices.find(device => device.sn_number === sn);
                    const idx = devices.map(device => device.sn_number).indexOf(sn);
                    if (device) {
                        device.connected = 0;
                        devices[idx] = device;
                        console.log('device disconnected', sn);
                    }
                    return ({...state, devices});
                });
            }
        });

        socket.on('realTimeIncomingData', data => {
            console.log(data);
            setState(state => ({...state, realTimeData: data.data}));
        });

        socket.on('disconnect', () => {
            // the connection was lost, may have been caused by the server, the network...
            console.log('disconnected');
            socket.emit('user_disconnect', props.user.id);
            props.setSocketAction(null);
            socket.disconnect();
        });

        // cleanup
        return () => {
            // the user leaves the component
            // console.log('cleanup');
            socket.emit('user_disconnect', props.user.id);
            props.setSocketAction(null);
            socket.disconnect();
        };
    // eslint-disable-next-line
    }, []);

/* ********************************************************* TOGGLES ********************************************************* */
    // set card-header shiny
    const shineHub = (e, idx) => {
        e.preventDefault();
        shineHubRefs.forEach((item, index) => {
            if (idx !== index) {
                item.current.classList.remove('shine');
            } else {
                item.current.classList.add('shine');
            };
        });
    }
    const shineDevice = (e, idx) => {
        e.preventDefault();
        shineDeviceRefs.forEach((item, index) => {
            if (idx !== index) {
                item.current.classList.remove('shine');
            } else {
                item.current.classList.add('shine');
            };
        });
    }
    // remove shiny hub
    const toggleHubs = e => {
        e.preventDefault();
        shineHubRefs.forEach((item) => {
            item.current.classList.remove('shine');
        });
    }
    // remove shiny device
    const toggleDevices = e => {
        e.preventDefault();
        shineDeviceRefs.forEach((item) => {
            item.current.classList.remove('shine');
        });
    }

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
            };
        });
        // collapse hub
        setState({
            ...state,
            collapseHub: state.collapseHub === Number(idx) ? null : Number(idx)
        });
    }

    const toggleAddHub = e => {
        e.preventDefault();
        // toggle plus hidden
        addHubIconRef.current.classList.add('hidden');
        setState({
            ...state,
            collapseAddHub: !state.collapseAddHub
        });
    }

    const toggleDeleteHub = e => {
        e.preventDefault();
        // toggle plus visible
        addHubIconRef.current.classList.toggle('show');
        addHubIconRef.current.classList.toggle('hidden');
        setState({
            ...state,
            collapseAddHub: !state.collapseAddHub
        });
    }

    const toggleAddDevice = (e, idx) => {
        e.preventDefault();
        // toggle plus hidden
        addDeviceIconRefs[idx].current.classList.toggle('show');
        addDeviceIconRefs[idx].current.classList.toggle('hidden');
        setState({
            ...state,
            collapseAddDevice: state.collapseAddDevice === Number(idx) ? null : Number(idx)
        });
    }

    const toggleDeleteDevice = (e, idx) => {
        e.preventDefault();
        // toggle plus visible
        addDeviceIconRefs[idx].current.classList.toggle('show');
        addDeviceIconRefs[idx].current.classList.toggle('hidden');
        setState({
            ...state,
            collapseAddDevice: state.collapseAddDevice === Number(idx) ? null : Number(idx)
        });
    }

/* ********************************************************* DELETE HUB ********************************************************* */
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

/* ********************************************************* DELETE DEVICE ********************************************************* */
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

/* ********************************************************* ADD HUB ********************************************************* */
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

/* ********************************************************* ADD DEVICE ********************************************************* */
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

/* ********************************************************* SHOW DEVICE DATA ********************************************************* */
    // rerender the data section
    const onShowDeviceDataClick = (e, hub, device) => {
        e.preventDefault();
        // send order to RPI to stop the request from previous device
        if (state.currentDevice.sn_number && state.currentDevice.connected) {
            props.socket.emit('stopRealTimeData', {userId: props.user.id, sn: state.currentDevice.sn_number});
        }
        // get real time data: socket emit to send the order to raspberry
        setState({
            ...state,
            realTimeData: {},
            currentHub: hub,
            currentDevice: device
        });
        if (device.type_id !== 2 && device.connected) {
            props.socket.emit('getRealTimeData', {userId: props.user.id, sn: device.sn_number});
        }
    };

    // water on off switcher
    const statusChange = () => {
        // console.log(!state.currentDevice.status);
        deviceOnOffPost(state.currentDevice.sn_number, !state.currentDevice.status).then(() => {
            props.socket.emit('waterOnOff', {sn: state.currentDevice.sn_number, status: !state.currentDevice.status});
            const newDevices = [...state.devices];
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].status = !state.currentDevice.status;
            setState({...state, devices: newDevices});
        });
    };

    // save parameters for watering
    const onSaveBtnClick = (e, inputRangeTime, inputRangeDuration, soilMoistureDevice) => {
        e.preventDefault();
        saveRangesPost(inputRangeTime, inputRangeDuration, state.currentDevice.sn_number, soilMoistureDevice).then(data => {
            const newDevices = [...state.devices];
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].water_time = inputRangeTime;
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].water_duration = inputRangeDuration;
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].moisture_device_id = soilMoistureDevice;
            props.socket.emit('waterConf', {sn: state.currentDevice.sn_number, time: inputRangeTime, duration: inputRangeDuration, soilMoistureDevice: soilMoistureDevice});
            setState({...state, devices: newDevices});
        });
    }

/* ********************************************************* RETURN ********************************************************* */
    if (state.hubs && state.devices && props.user) {
        return (
            <Container>
{/* ********************************************************* MODAL ********************************************************* */}
                <ConfirmModal
                    className="bg-danger"
                    title="Confirm Deletion"
                    show={state.confirmModalShow}
                    delete={state.confirmModalDelete}
                    close={() => setState({...state, confirmModalShow: false})}
                >
                    {state.confirmModalContent}
                </ConfirmModal>
                <div>{width} x {height}</div>
                <h3 className="text-trans mb-4">Hello {props.user.userName}, how are you?</h3>
                <Row>
                    <Col lg="5" className="accordion">
                        <Card color="transparent" className="border-0">
{/* ********************************************************* HUBS ********************************************************* */}
                            <CardHeader className="p-0 mb-3 d-flex align-items-center">
                                <CardTitle className="m-0 flex-grow-1">
                                    <Button className="accordion text-uppercase p-0" onClick={e => toggleHubs(e)}>
                                        <h5>hubs</h5>
                                    </Button>
                                    {/* <span className="active-lcd mx-2"></span> */}
                                </CardTitle>
                                <CardSubtitle>
                                    <Button
                                        innerRef={addHubIconRef}
                                        className="badge-pill btn-outline-light bg-transparent ml-3 my-auto p-0 plus"
                                        // show={state.collapseAddHub}
                                        onClick={toggleAddHub}
                                    >
                                        <span></span><span></span>
                                    </Button>
                                    <Button
                                        className="badge-pill btn-outline-light bg-transparent ml-3 my-auto up"
                                        // innerRef={openHubsIconRef}
                                        // onClick={toggleHubs}
                                    >
                                        <span></span><span></span>
                                    </Button>
                                </CardSubtitle>
                            </CardHeader>
{/* ********************************************************* ADD HUB ********************************************************* */}
                            <Collapse isOpen={state.collapseAddHub}>
                                <CardHeader className="p-0 mb-3 d-flex align-items-center justify-align-space-between">
                                    <CardSubtitle>
                                        <Button
                                            className="badge-pill btn-outline-light bg-transparent mr-3 p-0 minus"
                                            onClick={toggleDeleteHub}
                                        >
                                            <span></span><span></span>
                                        </Button>
                                    </CardSubtitle>
                                    <CardTitle className="flex-grow-1 m-0">
                                        <Input
                                            className="badge-pill bg-transparent py-0 mb-3"
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
                                    </CardTitle>
                                    <CardSubtitle>
                                        <Button
                                            className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                            onClick={onAddHubBtnClick}
                                        >
                                            <span></span><span></span>
                                        </Button>
                                    </CardSubtitle>
                                </CardHeader>
                            </Collapse>
                            <CardBody className="p-0">
                                <Collapse isOpen={true}>
{/* ********************************************************* LOOP HUBS ********************************************************* */}
                                    {state.hubs.map((hub, idx) => {
                                        const openHubIconRef = React.createRef();
                                        openHubIconRefs.push(openHubIconRef);
                                        const addDeviceIconRef = React.createRef();
                                        addDeviceIconRefs.push(addDeviceIconRef);
                                        const shineHubRef = React.createRef();
                                        shineHubRefs.push(shineHubRef);
                                        return (
                                            <div key={idx} ref={shineHubRef}>
                                                <CardHeader className="p-0 mb-2 d-flex align-items-center">
                                                    <Button className="accordion p-0 flex-grow-1" onClick={e => {toggleHub(e, idx); shineHub(e, idx); toggleDevices(e)}}>
                                                        <CardTitle className="m-0 text-left d-flex align-items-center">
                                                                {hub.name}
                                                            <span className={hub.connected ? 'active-lcd mx-2' : 'inactive-lcd mx-2'}></span>
                                                        </CardTitle>
                                                    </Button>
                                                    <CardSubtitle>
                                                        <Button
                                                            className="badge-pill btn-outline-light bg-transparent ml-3 p-0 minus"
                                                            onClick={e => onDeleteHubBtnClick(e, hub.id)}
                                                        >
                                                            <span></span><span></span>
                                                        </Button>
                                                        <Button
                                                            className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                                            innerRef={addDeviceIconRef}
                                                            onClick={e => toggleAddDevice(e, idx)}
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
                                                    </CardSubtitle>
                                                </CardHeader>
{/* ********************************************************* ADD DEVICE ********************************************************* */}
                                                <CardBody className="p-0 pl-2">
                                                    <Collapse isOpen={state.collapseAddDevice === idx}>
                                                        <CardHeader className="p-0 mb-3 d-flex align-items-center justify-align-space-between">
                                                            <CardSubtitle className="p-0">
                                                                <Button
                                                                    className="badge-pill btn-outline-light bg-transparent mr-3 p-0 minus"
                                                                    onClick={e => toggleDeleteDevice(e, idx)}
                                                                >
                                                                    <span></span><span></span>
                                                                </Button>
                                                            </CardSubtitle>
                                                            <CardTitle className="flex-grow-1 m-0">
                                                                <Input
                                                                    className="badge-pill bg-transparent py-0 mb-3"
                                                                    placeholder="Enter a serial number"
                                                                    onChange={e => setState({...state, deviceNum: e.target.value})}
                                                                    value={state.deviceNum}
                                                                />
                                                                <Input
                                                                    className="badge-pill bg-transparent py-0"
                                                                    placeholder="Enter a name for your device"
                                                                    onChange={e => setState({...state, deviceName: e.target.value})}
                                                                    value={state.deviceName}
                                                                />
                                                            </CardTitle>
                                                            <CardSubtitle className="p-0">
                                                                <Button
                                                                    className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                                                    onClick={e => onAddDeviceBtnClick(e, hub.id)}
                                                                >
                                                                    <span></span><span></span>
                                                                </Button>
                                                            </CardSubtitle>
                                                        </CardHeader>
                                                    </Collapse>
                                                </CardBody>
                                                <CardBody className="p-0 pl-3">
                                                    <Collapse isOpen={state.collapseHub === idx}>
{/* ********************************************************* LOOP DEVICE ********************************************************* */}
                                                        {state.devices.filter(device => device.hub_id === hub.id).map((device, idx) => {
                                                            const shineDeviceRef = React.createRef();
                                                            shineDeviceRefs.push(shineDeviceRef);
                                                            return (
                                                                <div key={idx} ref={shineDeviceRef}>
                                                                    <CardHeader className="p-0 d-flex align-items-center">
                                                                        <Button className="accordion p-0 flex-grow-1">
                                                                            <CardTitle className="m-0 text-left d-flex align-items-center"
                                                                                onClick={e => {
                                                                                    onShowDeviceDataClick(e, hub, device);
                                                                                    shineDevice(e, idx);
                                                                                    toggleHubs(e);
                                                                                }}
                                                                            >
                                                                                {device.name}
                                                                                <span className={device.connected ? 'active-lcd mx-2' : 'inactive-lcd mx-2'}></span>
                                                                            </CardTitle>
                                                                        </Button>
                                                                        <CardSubtitle>
                                                                            <Button
                                                                                className="badge-pill btn-outline-light bg-transparent ml-3 p-0 minus"
                                                                                onClick={e => onDeleteDeviceBtnClick(e, device.id)}
                                                                            >
                                                                                <span></span><span></span>
                                                                            </Button>
                                                                            {/* <Button
                                                                                className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus"
                                                                                innerRef={addDeviceIconRef}
                                                                                onClick={e => toggleAddDevice(e, idx)}
                                                                            >
                                                                                <span></span><span></span>
                                                                            </Button>
                                                                            <Button
                                                                                className="badge-pill btn-outline-light bg-transparent ml-3 up"
                                                                                innerRef={openHubIconRef}
                                                                                onClick={e => toggleHub(e, idx)}
                                                                            >
                                                                                <span></span><span></span>
                                                                            </Button> */}
                                                                        </CardSubtitle>
                                                                    </CardHeader>
                                                                    <CardBody className="p-0">
                                                                        <CardText className="m-0 mb-3">
                                                                            {device.device_name}
                                                                        </CardText>
                                                                    </CardBody>
{/* ******************************************************** MONITOR MOBILE ********************************************************* */}
                                                                    {width <= 991 && (
                                                                        <Fragment>
                                                                            {device.type_id === 1 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="px-3 mt-md-0 mt-3" lg="7">
                                                                                    <Col className="p-3">
                                                                                        <MonitorSoil data={state.realTimeData} hub={state.currentHub} device={state.currentDevice} />
                                                                                    </Col>
                                                                                </Col>  
                                                                            )}
                                                                            {device.type_id === 2 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="px-3 mt-md-0 mt-3" lg="7">
                                                                                    <Col className="p-3">
                                                                                        <MonitorWater data={state.realTimeData} devices={state.devices} hub={state.currentHub} device={state.currentDevice} statusChange={statusChange} save={onSaveBtnClick} />
                                                                                    </Col>
                                                                                </Col>  
                                                                            )}
                                                                            {device.type_id === 3 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="px-3 mt-md-0 mt-3" lg="7">
                                                                                    <Col className="p-3">
                                                                                        <MonitorTempHum data={state.realTimeData} hub={state.currentHub} device={state.currentDevice} />  
                                                                                    </Col>
                                                                                </Col>  
                                                                            )}
                                                                            {device.type_id === 4 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="px-3 mt-md-0 mt-3" lg="7">
                                                                                    <Col className="p-3">
                                                                                        <MonitorLight data={state.realTimeData} hub={state.currentHub} device={state.currentDevice} />
                                                                                    </Col>
                                                                                </Col> 
                                                                            )}
                                                                        </Fragment>
                                                                    )}                                                            
                                                                </div>
                                                            );
                                                        })}
                                                    </Collapse>
                                                </CardBody>
                                            </div>
                                        );
                                    })}
                                </Collapse>
                            </CardBody>
                        </Card>
                    </Col>
{/* ******************************************************** MONITOR DESKTOP ********************************************************* */}
                    {width > 991 && (
                        <Col className="px-3 mt-md-0 mt-3" lg="7">
                            <Col className="p-3">
                                {!state.currentDevice && (
                                    <MonitorAll data={state.realTimeData} hub={state.currentHub} device={state.currentDevice} />    
                                )}
                                {state.currentDevice.type_id === 1 && (
                                    <MonitorSoil data={state.realTimeData} hub={state.currentHub} device={state.currentDevice} />
                                )}
                                {state.currentDevice.type_id === 2 && (
                                    <MonitorWater data={state.realTimeData} devices={state.devices} hub={state.currentHub} device={state.currentDevice} statusChange={statusChange} save={onSaveBtnClick} />
                                )}
                                {state.currentDevice.type_id === 3 && (
                                    <MonitorTempHum data={state.realTimeData} hub={state.currentHub} device={state.currentDevice} />  
                                )}
                                {state.currentDevice.type_id === 4 && (
                                    <MonitorLight data={state.realTimeData} hub={state.currentHub} device={state.currentDevice} />
                                )}
                            </Col>
                        </Col>
                    )}
                </Row>
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
};

const mapStateToProps = state => {
    return {
        user: state.user,
        socket: state.socket
    };
};
export default connect(mapStateToProps, {
    setSocketAction,
    setBackgroundImageAction,
    setBackgroundColorAction,
    setBackgroundColor100Action,
    setBackgroundColor70Action
})(Products);
