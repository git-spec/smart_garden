/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useState, useEffect, createRef, Fragment} from 'react';
// router dom
import {useHistory, Link} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setSocketAction, setBackgroundColor5Action, setBackgroundColor1Action} from '../actions';
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
    CardText,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
// components
import ConfirmModal from './ConfirmModal';
import MonitorAll from './monitors/MonitorAll';
import MonitorSoil from './monitors/MonitorSoil';
import MonitorWater from './monitors/MonitorWater';
import MonitorTempHum from './monitors/MonitorTempHum';
import MonitorLight from './monitors/MonitorLight';
import MonitorKitchen from './monitors/MonitorKitchen';
import MonitorHomeOffice from './monitors/MonitorHomeOffice';
import MonitorGarden from './monitors/MonitorGarden';
import MonitorBalcony from './monitors/MonitorBalcony';
// window dimension hook
import {useWindowDimension} from '../hooks/useWindowDimension';
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
const Dashboard = props => {

    const history = useHistory();
    const [width] = useWindowDimension();

/* ********************************************************* REFERENCES ********************************************************* */
    const addHubIconRef = createRef();
    const addDeviceIconRefs = [];
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
        currentDevice: {},
        currentMonitor: 0
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* USE EFFECT ********************************************************* */
    useEffect(() => {
        // set background color of nav
        props.setBackgroundColor5Action('color-5');
        props.setBackgroundColor1Action(null);

        // get the hubs and devices of the user from the database on first rendering
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
    // Socket.io is used for the real-time exchange of hubs and devices. 
    // In this way, the data from the sensors is forwarded to the frontend, but also which devices are connected.
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
                    return {...state, hubs};
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
                    return {...state, hubs};
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
                    return {...state, devices};
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
                    return {...state, devices};
                });
            }
        });

        socket.on('realTimeIncomingData', data => {
            setState(state => ({...state, realTimeData: data.data}));
        });

        socket.on('disconnect', () => {
            console.log('disconnected');
            socket.emit('user_disconnect', props.user.id);
            props.setSocketAction(null);
            socket.disconnect();
        });

        // cleanup: the user and socket are disconnected when the user leaves the component
        return () => {
            socket.emit('user_disconnect', props.user.id);
            props.setSocketAction(null);
            socket.disconnect();
        };
    // eslint-disable-next-line
    }, []);

/* ********************************************************* HIGHLIGHT ********************************************************* */    
    // highlight selected hub
    const shineHub = (e, idx) => {
        e.preventDefault();
        shineHubRefs.forEach((item, index) => {
            if (idx !== index) {
                item.current.classList.remove('shine');
            } else {
                item.current.classList.add('shine');
            }
        });
    };

    // highlight selected device
    const shineDevice = (e, deviceSN) => {
        e.preventDefault();
        shineDeviceRefs.forEach(item => {
            if (deviceSN !== item.current.id) {
                item.current.classList.remove('shine');
            } else {
                item.current.classList.add('shine');
            }
        });
    };

    // remove highlighting of the hub
    const toggleHubs = e => {
        e.preventDefault();
        shineHubRefs.forEach(item => {
            item.current.classList.remove('shine');
        });
    };

    // remove highlighting of the device
    const toggleDevices = e => {
        e.preventDefault();
        shineDeviceRefs.forEach(item => {
            item.current.classList.remove('shine');
        });
    };

/* ********************************************************* TOGGLE HUBS ********************************************************* */    
    // pressing the hubs heading collapses all open hubs and shows the overview monitor
    const resetHubs = e => {
        e.preventDefault();
        openHubIconRefs.forEach(item => {
            item.current.classList.remove('down');
            item.current.classList.add('up');
        });
        setState({
            ...state,
            currentMonitor: 0,
            collapseHub: null
        });
    };
    
    // pressing on a hub heading opens a closed section or closes it if it is already open
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
        // collapse hub and change monitor
        setState({
            ...state,
            collapseHub: state.collapseHub === Number(idx) ? null : Number(idx),
            currentMonitor: idx + 5
        });
    };

/* ********************************************************* DELETE HUB ********************************************************* */
    // opens or closes the section to delete a hub
    const toggleDeleteHub = e => {
        e.preventDefault();
        // toggle plus visible
        addHubIconRef.current.classList.toggle('show');
        addHubIconRef.current.classList.toggle('hidden');
        setState({...state, collapseAddHub: !state.collapseAddHub});
    };
    
    // By clicking the delete button, the user can delete one of his hubs. 
    // He must confirm the deletion before the hub is permanently deleted.
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
    // opens or closes the section to delete a device
    const toggleDeleteDevice = (e, idx) => {
        e.preventDefault();
        // toggle plus visible
        addDeviceIconRefs[idx].current.classList.toggle('show');
        addDeviceIconRefs[idx].current.classList.toggle('hidden');
        setState({...state, collapseAddDevice: state.collapseAddDevice === Number(idx) ? null : Number(idx)});
    };

    // By clicking the delete button, the user can delete one of his devices. 
    // He must confirm the deletion before the device is permanently deleted.
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
    // opens or closes the section to add a hub
    const toggleAddHub = e => {
        e.preventDefault();
        // toggle plus hidden
        addHubIconRef.current.classList.add('hidden');
        setState({...state, collapseAddHub: !state.collapseAddHub});
    };
    
    // The user can add a new hub in his dashboard, for which he must 
    // enter a valid serial number and can also assign a name to the it.
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
    // opens or closes the section to add a device
    const toggleAddDevice = (e, idx) => {
        e.preventDefault();
        // toggle plus hidden
        addDeviceIconRefs[idx].current.classList.toggle('show');
        addDeviceIconRefs[idx].current.classList.toggle('hidden');
        setState({...state, collapseAddDevice: state.collapseAddDevice === Number(idx) ? null : Number(idx)});
    };

    // The user can add a new device in his dashboard, for which he must 
    // enter a valid serial number and can also assign a name to the it.
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
/* ********************************************************* SHOW DEVICES ********************************************************* */
    // show the real time data of the devices in the monitor
    const onShowDeviceDataClick = (e, hub, device) => {
        e.preventDefault();
        // send order to raspberry to stop the request from previous device
        if (state.currentDevice.sn_number && state.currentDevice.connected) {
            props.socket.emit('stopRealTimeData', {userId: props.user.id, sn: state.currentDevice.sn_number});
        };
        // get real time data: socket emit to send the order to raspberry
        setState({
            ...state,
            realTimeData: {},
            currentHub: hub,
            currentDevice: device,
            currentMonitor: device.type_id
        });
        if (device.type_id !== 2 && device.connected) {
            props.socket.emit('getRealTimeData', {userId: props.user.id, sn: device.sn_number});
        };
    };

    // turns the water pump on or off
    const statusChange = () => {
        deviceOnOffPost(state.currentDevice.sn_number, !state.currentDevice.status).then(() => {
            props.socket.emit('waterOnOff', {sn: state.currentDevice.sn_number, status: !state.currentDevice.status});
            const newDevices = [...state.devices];
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].status = !state.currentDevice.status;
            setState({...state, devices: newDevices});
        });
    };

    // saves the parameters for the water pump control: from which soil moisture value watering should start and for how long
    const onSaveBtnClick = (e, inputRangeTime, inputRangeDuration, soilMoistureDevice) => {
        e.preventDefault();
        saveRangesPost(inputRangeTime, inputRangeDuration, state.currentDevice.sn_number, soilMoistureDevice).then(data => {
            const newDevices = [...state.devices];
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].water_time = inputRangeTime;
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].water_duration = inputRangeDuration;
            newDevices[newDevices.map(device => device.sn_number).indexOf(state.currentDevice.sn_number)].moisture_device_id = soilMoistureDevice;
            props.socket.emit('waterConf', {
                sn: state.currentDevice.sn_number,
                time: inputRangeTime,
                duration: inputRangeDuration,
                soilMoistureDevice: soilMoistureDevice
            });
            setState({...state, devices: newDevices});
        });
    };

/* ********************************************************* PROFILE ********************************************************* */
    let userImg;
    if (props.user.img) {
        userImg = props.user.img;
    } else {
        userImg = '/src/imgs/dummy.svg';
    }
    const o_date = new Intl.DateTimeFormat();
    const f_date = (m_ca, m_it) => Object({...m_ca, [m_it.type]: m_it.value});
    const m_date = o_date.formatToParts().reduce(f_date, {});
    const data = m_date.day + '/' + m_date.month + '/' + m_date.year;

/* ********************************************************* RETURN ********************************************************* */
    if (state.hubs && state.devices && props.user) {
        return (
            <Container className="pt-4 mt-5 mx-sm-5 mx-lg-auto px-sm-5 px-lg-0">

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
{/* ********************************************************* BREADCRUMB ********************************************************* */}
                <Col className="p-0 mb-3">
                    <Breadcrumb className="bg-transparent">
                        <BreadcrumbItem className="bg-transparent">
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem className="bg-transparent">
                            <Link to="/user/profile">UserProfile</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem className="bg-transparent" active>
                            DashBoard
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
{/* ********************************************************* PROFILE ********************************************************* */}
                <Row className="mb-5 d-flex align-items-center">
                    <Col className="d-flex align-items-center">
                        <div className="mr-2">
                            <span>
                                <img src={userImg} alt="" style={{width: '32px', height: '32px', borderRadius: '50%'}} /> 
                            </span>
                        </div>
                        <div className="flex-grow-1 p-0 m-0">
                            <div>
                                {props.user.firstName} {props.user.lastName}
                            </div>
                            <div>{data}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="5" className="accordion pr-lg-5">
                        <Card color="transparent" className="border-0">
{/* ********************************************************* HUBS ********************************************************* */}
                            <CardHeader className="p-0 mb-3 d-flex align-items-center">
                                <CardTitle className="m-0 flex-grow-1">
                                    <Button className="accordion text-uppercase p-0" onClick={e => {toggleHubs(e); resetHubs(e);}}>
                                        <h5 style={state.currentMonitor === 0 ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>
                                            hubs
                                        </h5>
                                    </Button>
                                </CardTitle>
                                <CardSubtitle>
                                    <Button innerRef={addHubIconRef} className="badge-pill btn-outline-light bg-transparent ml-3 my-auto p-0 plus" onClick={toggleAddHub}>
                                        <span></span><span></span>
                                    </Button>
                                    <Button className="badge-pill btn-outline-light bg-transparent ml-3 my-auto up">
                                        <span></span><span></span>
                                    </Button>
                                </CardSubtitle>
                            </CardHeader>
{/* ********************************************************* ADD HUB ********************************************************* */}
                            <Collapse isOpen={state.collapseAddHub}>
                                <CardHeader className="p-0 mb-3 d-flex align-items-center justify-align-space-between">
                                    <CardSubtitle>
                                        <Button className="badge-pill btn-outline-light bg-transparent mr-3 p-0 minus" onClick={toggleDeleteHub}>
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
                                        <Button className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus" onClick={onAddHubBtnClick}>
                                            <span></span><span></span>
                                        </Button>
                                    </CardSubtitle>
                                </CardHeader>
                            </Collapse>
                            <CardBody className="p-0">
                                <Collapse isOpen={true}>
{/* ********************************************************* LOOP HUBS ********************************************************* */}
                                    {state.hubs.map((hub, idx) => {
                                        const openHubIconRef = createRef();
                                        openHubIconRefs.push(openHubIconRef);
                                        const addDeviceIconRef = createRef();
                                        addDeviceIconRefs.push(addDeviceIconRef);
                                        const shineHubRef = createRef();
                                        shineHubRefs.push(shineHubRef);
                                        return (
                                            <div key={idx} ref={shineHubRef}>
                                                <CardHeader className="p-0 mb-2 d-flex align-items-center">
                                                    <Button
                                                        className="accordion p-0 flex-grow-1"
                                                        onClick={e => {toggleHub(e, idx); shineHub(e, idx); toggleDevices(e);}}
                                                    >
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
                                                            onClick={e => {toggleHub(e, idx); shineHub(e, idx);}}
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
                                                <CardBody className="p-0">
                                                    <Collapse isOpen={state.collapseHub === idx}>
{/* ********************************************************* LOOP DEVICE ********************************************************* */}
                                                        {state.devices.filter(device => device.hub_id === hub.id).map((device, idx) => {
                                                            const shineDeviceRef = createRef();
                                                            shineDeviceRefs.push(shineDeviceRef);
                                                            return (
                                                                <div key={device.sn_number} id={device.sn_number} ref={shineDeviceRef}>
                                                                    <CardHeader className="p-0 pl-3 d-flex align-items-center">
                                                                        <Button className="accordion p-0 flex-grow-1">
                                                                            <CardTitle
                                                                                className="m-0 text-left d-flex align-items-center"
                                                                                onClick={e => {onShowDeviceDataClick(e, hub, device); shineDevice(e, device.sn_number); toggleHubs(e);}}
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
                                                                            <Button className="badge-pill btn-outline-light bg-transparent ml-3 p-0 plus">
                                                                                <span></span><span></span>
                                                                            </Button>
                                                                            <Button className="badge-pill btn-outline-light bg-transparent ml-3 up">
                                                                                <span></span><span></span>
                                                                            </Button>
                                                                        </CardSubtitle>
                                                                    </CardHeader>
                                                                    <CardBody className="p-0 pl-3">
                                                                        <CardText className="m-0 mb-3">
                                                                            {device.device_name}
                                                                        </CardText>
                                                                    </CardBody>
{/* ******************************************************** MONITOR MOBILE ********************************************************* */}
                                                                    {width <= 991 && (
                                                                        <Fragment>
                                                                            {state.currentMonitor === 1 && device.type_id === 1 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                                    <Col className="p-0 px-sm-3 pt-sm-3">
                                                                                        <MonitorSoil
                                                                                            chartData={{fontSize: 6, pointRadius: 1}}
                                                                                            data={state.realTimeData}
                                                                                            hub={state.currentHub}
                                                                                            device={state.currentDevice}
                                                                                        />
                                                                                    </Col>
                                                                                </Col>
                                                                            )}
                                                                            {state.currentMonitor === 2 && device.type_id === 2 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                                    <Col className="p-0 px-sm-3 pt-sm-3">
                                                                                        <MonitorWater
                                                                                            devices={state.devices}
                                                                                            hub={state.currentHub}
                                                                                            device={state.currentDevice}
                                                                                            statusChange={statusChange} 
                                                                                            save={onSaveBtnClick} 
                                                                                        />
                                                                                    </Col>
                                                                                </Col>
                                                                            )}
                                                                            {state.currentMonitor === 3 && device.type_id === 3 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                                    <Col className="p-0 px-sm-3 pt-sm-3">
                                                                                        <MonitorTempHum
                                                                                            chartData={{fontSize: 6, pointRadius: 1}}
                                                                                            data={state.realTimeData}
                                                                                            hub={state.currentHub}
                                                                                            device={state.currentDevice}
                                                                                        />
                                                                                    </Col>
                                                                                </Col>
                                                                            )}
                                                                            {state.currentMonitor === 4 && device.type_id === 4 && device.sn_number === state.currentDevice.sn_number && (
                                                                                <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                                    <Col className="p-0 px-sm-3 pt-sm-3">
                                                                                        <MonitorLight
                                                                                            chartData={{fontSize: 6, pointRadius: 1}}
                                                                                            data={state.realTimeData}
                                                                                            hub={state.currentHub}
                                                                                            device={state.currentDevice}
                                                                                        />
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
                                                {width <= 991 && (
                                                    <Fragment>
                                                        {state.currentMonitor === 5 && hub.id === 1 && (
                                                            <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                <Col className="p-0 px-sm-3 pt-sm-3">
                                                                    <MonitorKitchen />
                                                                </Col>
                                                            </Col>
                                                        )}
                                                        {state.currentMonitor === 6 && hub.id === 2 && (
                                                            <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                <Col className="p-0 px-sm-3 pt-sm-3">
                                                                    <MonitorHomeOffice />
                                                                </Col>
                                                            </Col>
                                                        )}
                                                        {state.currentMonitor === 7 && hub.id === 5 && (
                                                            <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                <Col className="p-0 px-sm-3 pt-sm-3">
                                                                    <MonitorGarden />
                                                                </Col>
                                                            </Col>
                                                        )}
                                                        {state.currentMonitor === 8 && hub.id === 7 && (
                                                            <Col className="p-0 mt-lg-0 my-4" lg="7">
                                                                <Col className="p-0 px-sm-3 pt-sm-3">
                                                                    <MonitorBalcony />
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
                        </Card>
                    </Col>
                    {width <= 991 && (
                        <Fragment>
                            {state.currentMonitor === 0 && (
                                <Col className="mt-lg-0 mt-3 mb-4" lg="7">
                                    <Col className="p-0 px-sm-3 pt-sm-3">
                                        <MonitorAll />
                                    </Col>
                                </Col>
                            )}
                        </Fragment>
                    )}
{/* ******************************************************** MONITOR DESKTOP ********************************************************* */}
                    {width > 991 && (
                        <Col className="px-3 mt-lg-0 mt-3" lg="7">
                            <Col className="p-3">
                                {state.currentMonitor === 0 && <MonitorAll />}
                                {state.currentMonitor === 1 && (
                                    <MonitorSoil
                                        chartData={{fontSize: 12, pointRadius: 2}}
                                        data={state.realTimeData}
                                        hub={state.currentHub}
                                        device={state.currentDevice}
                                    />
                                )}
                                {state.currentMonitor === 2 && (
                                    <MonitorWater
                                        devices={state.devices}
                                        hub={state.currentHub}
                                        device={state.currentDevice}
                                        statusChange={statusChange}
                                        save={onSaveBtnClick}
                                    />
                                )}
                                {state.currentMonitor === 3 && (
                                    <MonitorTempHum
                                        chartData={{fontSize: 12, pointRadius: 2}}
                                        data={state.realTimeData}
                                        hub={state.currentHub}
                                        device={state.currentDevice}
                                    />
                                )}
                                {state.currentMonitor === 4 && (
                                    <MonitorLight
                                        chartData={{fontSize: 12, pointRadius: 2}}
                                        data={state.realTimeData}
                                        hub={state.currentHub}
                                        device={state.currentDevice}
                                    />
                                )}
                                {state.currentMonitor === 5 && <MonitorKitchen />}
                                {state.currentMonitor === 6 && <MonitorHomeOffice />}
                                {state.currentMonitor === 7 && <MonitorGarden />}
                                {state.currentMonitor === 8 && <MonitorBalcony />}
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

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {
        user: state.user,
        socket: state.socket
    };
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps, {setSocketAction, setBackgroundColor5Action, setBackgroundColor1Action})(Dashboard);
