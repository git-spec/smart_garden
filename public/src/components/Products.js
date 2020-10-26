import React, {useState, useEffect} from 'react';
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
    Card,
    CardHeader
} from 'reactstrap';
// components
import ConfirmModal from './ConfirmModal';
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

const Products = props => {

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
    };
    const [state, setState] = useState(initialState);

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

    // toggles
    const toggleHubs = e => {
        setState({
            ...state,
            collapseHubs: !state.collapseHubs
        });
    }
    const toggleHub = e => {
        let event = e.target.dataset.event;
        // console.log(event);
        setState({
            ...state,
            collapseHub: state.collapseHub === Number(event) ? null : Number(event)
        });
    }
    const toggleAddHub = e => {
        setState({
            ...state,
            collapseAddHub: !state.collapseAddHub
        });
    }
    const toggleAddDevice = e => {
        let event = e.target.dataset.event;
        // console.log(event);
        setState({
            ...state,
            collapseAddDevice: state.collapseAddDevice === Number(event) ? null : Number(event)
        });
    }

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
                    Are you sure you want to delete this hub?<br />
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
            })
            .catch(err => {
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
                        })
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
                        })
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
                <h3 className="text-trans mb-4">Hello User</h3>
                <Row>
                    <Col md="3">
                        <div>
                            {/* hubs */}
                            <Button className="accordion text-uppercase p-0" onClick={toggleHubs}>
                                hubs
                            </Button>
                            <Collapse isOpen={state.collapseHubs}>
                                {/* hub-loop */}
                                {state.hubs.map((hub, idx) => {
                                    return (
                                        <Card key={hub.id}>
                                            <CardHeader className="p-0 pl-1">
                                                <Button
                                                    className="accordion p-0"
                                                    onClick={toggleHub}
                                                    data-event={hub.id}
                                                >
                                                    {idx + 1}. Hub {hub.name}
                                                </Button>
                                                <Button
                                                    className="minus badge-pill btn-outline-light bg-transparent ml-3 p-1"
                                                    onClick={e => onDeleteHubBtnClick(e, hub.id)}
                                                >
                                                    <svg
                                                        version="1.1" className="minus" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" 
                                                        width="67px" height="67px" viewBox="0 -28.334 67 67" enableBackground="new 0 -28.334 67 67"
                                                    >
                                                        <path d="M61.667,10H5c-2.762,0-5-2.239-5-5s2.238-5,5-5h56.667c2.762,0,5,2.239,5,5S64.429,10,61.667,10z" />
                                                    </svg>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={state.collapseHub === hub.id}>
                                                {/* device-loop */}
                                                {state.devices.filter(device => device.hub_id === hub.id).map((device, idx) => {
                                                    return (
                                                        <CardBody key={device.id} className="p-0 pl-1">
                                                            {idx + 1}. Device {device.name} | {device.device_name}
                                                            <Button
                                                                className="minus badge-pill btn-outline-light bg-transparent ml-3 p-1"
                                                                onClick={e => onDeleteDeviceBtnClick(e, device.id)}
                                                            >
                                                                <svg
                                                                    version="1.1" className="minus" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                                    width="67px" height="67px" viewBox="0 -28.334 67 67" enableBackground="new 0 -28.334 67 67"
                                                                >
                                                                    <path d="M61.667,10H5c-2.762,0-5-2.239-5-5s2.238-5,5-5h56.667c2.762,0,5,2.239,5,5S64.429,10,61.667,10z" />
                                                                </svg>
                                                            </Button>
                                                        </CardBody>
                                                    );
                                                })}
                                                {/* add device */}
                                                <CardBody className="p-0 pl-1">
                                                    <div onClick={toggleAddDevice} data-event={hub.id}>
                                                        Add Device
                                                    </div>
                                                    <Collapse isOpen={state.collapseAddDevice === hub.id}>
                                                        <Row>
                                                            <Col>
                                                                <Input
                                                                    className="badge-pill bg-transparent py-0"
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
                                                            </Col>
                                                            <Col>
                                                                <Button
                                                                    className="plus badge-pill btn-outline-light bg-transparent ml-3 p-1"
                                                                    onClick={e => onAddDeviceBtnClick(e, hub.id)}
                                                                >
                                                                    <svg
                                                                        version="1.1" className="plus" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                                        width="67px" height="67px" viewBox="0 0 67 67" enableBackground="new 0 0 67 67"
                                                                    >
                                                                        <path
                                                                            d="M61.667,28.334H38.333V5c0-2.761-2.238-5-5-5s-5,2.239-5,5v23.334H5c-2.762,0-5,2.239-5,5s2.238,5,5,5h23.333v23.333
                                                                            c0,2.762,2.238,5,5,5s5-2.238,5-5V38.334h23.334c2.762,0,5-2.239,5-5S64.429,28.334,61.667,28.334z"
                                                                        />
                                                                    </svg>
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Collapse>
                                                </CardBody>
                                            </Collapse>
                                        </Card>
                                    );
                                })}
                                {/* add hub */}
                                <Card>
                                    <CardHeader className="p-0 pl-1">
                                        <Button
                                            className="accordion p-0"
                                            onClick={toggleAddHub}
                                        >
                                            Add Hub
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
                                                    className="plus badge-pill btn-outline-light bg-transparent ml-3 p-1"
                                                    onClick={onAddHubBtnClick}
                                                >
                                                    <svg
                                                        version="1.1" className="plus" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                        width="67px" height="67px" viewBox="0 0 67 67" enableBackground="new 0 0 67 67"
                                                    >
                                                        <path
                                                            d="M61.667,28.334H38.333V5c0-2.761-2.238-5-5-5s-5,2.239-5,5v23.334H5c-2.762,0-5,2.239-5,5s2.238,5,5,5h23.333v23.333
                                                            c0,2.762,2.238,5,5,5s5-2.238,5-5V38.334h23.334c2.762,0,5-2.239,5-5S64.429,28.334,61.667,28.334z"
                                                        />
                                                    </svg>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Collapse>
                                    {/* </CardBody> */}
                                </Card>
                            </Collapse>
                        </div>
                    </Col>
                    <Col md="9"></Col>
                </Row>
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Products;