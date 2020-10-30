/* ******************************************************** IMPORT ********************************************************* */
import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
// import {Link} from 'react-router-dom';
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
    Label, 
    FormGroup,
    CardTitle,
    CardSubtitle,
    CardText
} from 'reactstrap';
// components
import ConfirmModal from './ConfirmModal';
import ReactTable from './Table';
import LineChart from './LineChart';
import LineChartMultiple from './LineChartMultiple';
import BarChartHorizontal from './BarChartHorizontal';
import BarChartHorizontalMixed from './BarChartHorizontalMixed';
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

/* ******************************************************** COMPONENT ********************************************************* */
const Products = props => {
  
/* ******************************************************** REFFERENCES ********************************************************* */
    const addHubIconRef = React.createRef();
    const addDeviceIconRefs = [];
    const openHubsIconRef = React.createRef();
    const openHubIconRefs = [];
    const hubStatusRefs = [];
    const deviceStatusRefs = [];

/* ******************************************************** STATE ********************************************************* */
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

/* ******************************************************** USE EFFECT ********************************************************* */
    useEffect(() => {
        // get hubs & devices data from db at initial render
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

/* ******************************************************** SOCKET.IO ********************************************************* */

    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
        console.log('connected');
        socket.emit('user_connect', '3');
    });

    socket.on('hub_connect', sn => {
        // console.log(hubStatusRefs);
        // const idx = hubStatusRefs.map(foundHub => foundHub.sn).indexOf(sn);
        // if (idx !== -1) {
        //     hubStatusRefs[idx].ref.current.classList.remove('text-danger');
        //     hubStatusRefs[idx].ref.current.classList.add('text-success');
        // }
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
        // const idx = hubStatusRefs.map(foundHub => foundHub.sn).indexOf(sn);
        // if (idx !== -1) {
        //     hubStatusRefs[idx].ref.current.classList.remove('text-success');
        //     hubStatusRefs[idx].ref.current.classList.add('text-danger');
        // }
        console.log('hub disconnected', sn);
    });

    socket.on('device_connect', sn => {
        // console.log(deviceStatusRefs);
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
        // console.log(deviceStatusRefs);
        // if (deviceStatusRefs.length > 0) {
        //     const idx = deviceStatusRefs.map(foundDevice => foundDevice.sn).indexOf(sn);
        //     if (idx !== -1) {
        //         deviceStatusRefs[idx].ref.current.classList.remove('text-success');
        //         deviceStatusRefs[idx].ref.current.classList.add('text-danger');
        //     }
        // }
        console.log('device disconnected', sn);
    });

/* ******************************************************** TOGGLES ********************************************************* */
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

/* ******************************************************** DELETE HUB ********************************************************* */
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
/* ******************************************************** DELETE DEVICE ********************************************************* */
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
/* ******************************************************** ADD HUB ********************************************************* */
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
/* ******************************************************** ADD DEVICE ********************************************************* */
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
    
    const data = getData();
  
/* ******************************************************** RETURN ********************************************************* */
if (state.hubs && state.devices) {
        return (
            <Container>
{/* ******************************************************** MODAL ********************************************************* */}
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
                    <Col lg="5" className="accordion">
                        <Card color="transparent" className="border-0">
{/* ******************************************************** HUBS ********************************************************* */}
                            <CardHeader className="p-0 d-flex align-items-center">
                                <CardTitle className="m-0 flex-grow-1">
                                    <Button className="accordion text-uppercase p-0" onClick={toggleHubs}>hubs</Button>
                                    <span className="active-light mx-2"></span>
                                </CardTitle>
                                <CardSubtitle>
                                    <Button
                                        innerRef={addHubIconRef}
                                        className="badge-pill btn-outline-light bg-transparent ml-3 my-auto p-0 plus"
                                        onClick={toggleAddHub}
                                    >
                                        <span></span><span></span>
                                    </Button>
                                    <Button
                                        className="badge-pill btn-outline-light bg-transparent ml-3 my-auto up"
                                        innerRef={openHubsIconRef}
                                        onClick={toggleHubs}
                                    >
                                        <span></span><span></span>
                                    </Button>
                                </CardSubtitle>
                            </CardHeader>
{/* ******************************************************** ADD HUB ********************************************************* */}
                            <Collapse isOpen={state.collapseAddHub}>
                                <CardHeader className="px-0 d-flex align-items-center justify-align-space-between">
                                    <CardTitle className="flex-grow-1 m-0">
                                        <Input
                                            className="badge-pill bg-transparent py-0 mb-3"
                                            placeholder="Enter a serial number"
                                            onChange={e => setState({...state, hubNum: e.target.value})}
                                            value={state.hubNum}
                                        />
                                        <Input
                                            className="badge-pill bg-transparent py-0 mb-3"
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
                                <Collapse isOpen={state.collapseHubs}>
{/* ******************************************************** LOOP HUB ********************************************************* */}
                                    {state.hubs.map((hub, idx) => {
                                        const openHubIconRef = React.createRef();
                                        openHubIconRefs.push(openHubIconRef);
                                        const addDeviceIconRef = React.createRef();
                                        addDeviceIconRefs.push(addDeviceIconRef);
                                        const hubStatusRef = React.createRef();
                                        hubStatusRefs.push({ref: hubStatusRef, sn: hub.sn_number});
                                        return (
                                            <div key={idx}>
                                                <CardHeader className="p-0 pl-2 mb-1 d-flex align-items-center">
                                                    <CardTitle className="m-0 flex-grow-1">
                                                        <Button
                                                            className="accordion p-0"
                                                            onClick={e => toggleHub(e, idx)}
                                                        >
                                                            {hub.name}
                                                        </Button>
                                                        <span 
                                                            ref={hubStatusRef}
                                                            className="active-light mx-2">
                                                        </span>
                                                    </CardTitle>
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
{/* ******************************************************** ADD DEVICE ********************************************************* */}
                                                <CardBody className="p-0 pl-2">
                                                    <Collapse isOpen={state.collapseAddDevice === idx}>
                                                        <CardHeader className="px-0 d-flex align-items-center justify-align-space-between">
                                                            <CardTitle className="flex-grow-1 m-0">
                                                                <Input
                                                                    className="badge-pill bg-transparent py-0 mb-3"
                                                                    placeholder="Enter a serial number"
                                                                    onChange={e =>
                                                                        setState({...state, deviceNum: e.target.value})
                                                                    }
                                                                    value={state.deviceNum}
                                                                />
                                                                <Input
                                                                    className="badge-pill bg-transparent py-0 mb-3"
                                                                    placeholder="Enter a name for your device"
                                                                    onChange={e =>
                                                                        setState({...state, deviceName: e.target.value})
                                                                    }
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
                                                <CardBody className="p-0 pl-2">
                                                    <Collapse isOpen={state.collapseHub === idx}>
{/* ******************************************************** LOOP DEVICE ********************************************************* */}
                                                        {state.devices.filter(device => device.hub_id === hub.id).map((device, idx) => {
                                                            const deviceStatusRef = React.createRef();
                                                            deviceStatusRefs.push({ref: deviceStatusRef, sn: device.sn_number});
                                                            return (
                                                                <CardHeader key={idx} className="p-0 pl-3 mb-2">
                                                                    <CardTitle className="m-0 d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center">
                                                                            {device.name}
                                                                            <span 
                                                                                ref={deviceStatusRef} 
                                                                                className="active-light mx-2">
                                                                            </span>
                                                                        </div>
                                                                        <Button
                                                                            className="badge-pill btn-outline-light bg-transparent ml-3 p-0 minus"
                                                                            onClick={e => onDeleteDeviceBtnClick(e, device.id)}
                                                                        >
                                                                            <span></span><span></span>
                                                                        </Button>
                                                                    </CardTitle>
                                                                    <CardSubtitle>
                                                                        {device.device_name}
                                                                    </CardSubtitle>
                                                                    <CardText className="d-flex align-items-center">
                                                                        <label className="switch">
                                                                            <input type="checkbox" />
                                                                            <span className="slider round"></span>
                                                                        </label>
                                                                        <span className="ml-3">OFF / ON</span>
                                                                    </CardText>
                                                                </CardHeader>
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
{/* ******************************************************** MONITOR ********************************************************* */}
                    <Col className="px-3 mt-md-0 mt-3" lg="7">
                        <Col className="p-3">
                            {/* <h3 className="text-center">kitchen</h3> */}
                            <ReactTable />
                            <LineChart data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" />
                            <LineChartMultiple data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" />
                            <BarChartHorizontal data={data[3].data} title={data[3].title} color="rgb(0, 168, 230)" />
                            <BarChartHorizontalMixed data={data[3].data} title={data[3].title} color="rgb(0, 168, 230)" />
                            <FormGroup>
                                <Label for="rangeInput">Range</Label>
                                <Input
                                    type="range"
                                    id="rangeInput"
                                    name="rangeInput"
                                    min="0"
                                    max="100"
                                    onInput="this.output.amount.value=this.value"
                                />
                                <output name="amount" id="amount" htmlFor="rangeInput">
                                    0
                                </output>
                            </FormGroup>
                        </Col>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Products;
