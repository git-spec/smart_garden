import React, {useState, useEffect} from 'react';
// import {Link} from 'react-router-dom';
import {
    InputGroup, 
    Button, 
    Input, 
    Container,
    Collapse, 
    // CardBody, 
    // Card,
    // CardHeader
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

const Hubs = props => {

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
                >{state.confirmModalContent}
                </ConfirmModal>
                {/* hubs */}
                <div onClick={toggleHubs}>
                    Hubs
                </div>
                <Collapse isOpen={state.collapseHubs}>
                    {/* hub-loop */}
                    {state.hubs.map((hub, idx) => {
                        return (
                            <div key={hub.id} className="mb-3">
                                <div onClick={toggleHub} data-event={hub.id}>
                                    {idx + 1}. Hub {hub.name}
                                    {/* {idx + 1}. Hub | name: {hub.name} | ID: {hub.id} */}
                                </div>
                                <Button
                                    className="ml-2"
                                    outline
                                    color="danger"
                                    size="sm"
                                    onClick={e => onDeleteHubBtnClick(e, hub.id)}
                                >
                                    Delete
                                </Button>{' '}
                                <Collapse isOpen={state.collapseHub === hub.id}>
                                    {/* device-loop */}
                                    {state.devices.filter(device => device.hub_id === hub.id).map((device, idx) => {
                                        return (
                                            <ul key={device.id} className="mb-3">
                                                {idx +1}. Device {device.name} | {device.device_name}
                                                {/* {idx +1}. Device | name: {device.name} | type: {device.device_name} | ID: {device.id} | hubID: {device.hub_id} */}
                                                <Button className="ml-2" outline color="danger" size="sm" onClick={e => onDeleteDeviceBtnClick(e, device.id)}>
                                                    Delete
                                                </Button>{' '}
                                            </ul>
                                        );
                                    })}
                                    {/* add device */}
                                    <ul onClick={toggleAddDevice} data-event={hub.id}>
                                        Add Device
                                    </ul>
                                    <Collapse isOpen={state.collapseAddDevice === hub.id}>
                                        <InputGroup className="mb-3">
                                            <Input
                                                placeholder="Insert a Name"
                                                onChange={e => setState({...state, deviceName: e.target.value})}
                                                value={state.deviceName}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <Input
                                                placeholder="Insert a Serialnumber"
                                                onChange={e => setState({...state, deviceNum: e.target.value})}
                                                value={state.deviceNum}
                                            />
                                        </InputGroup>
                                        <Button className="mb-3" size="sm" outline color="primary" onClick={e => onAddDeviceBtnClick(e, hub.id)}>
                                            Add Device
                                        </Button>{' '}  
                                    </Collapse>              
                                </Collapse>              
                            </div>
                        );
                    })}
                    {/* add hub */}
                    <div onClick={toggleAddHub}>
                        Add Hub
                    </div>
                    <Collapse isOpen={state.collapseAddHub}>
                        <InputGroup className="mb-3">
                            <Input
                                placeholder="Insert a Name"
                                onChange={e => setState({...state, hubName: e.target.value})}
                                value={state.hubName}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <Input
                                placeholder="Insert a Serialnumber"
                                onChange={e => setState({...state, hubNum: e.target.value})}
                                value={state.hubNum}
                            />
                        </InputGroup>
                        <Button className="mb-3" size="sm" outline color="primary" onClick={onAddHubBtnClick}>
                            Add Hub
                        </Button>{' '}
                    </Collapse>              
                </Collapse>
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Hubs;