import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
    InputGroup, 
    Button, 
    Input, 
    Container
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
        hubName: '',
        hubNum: '',
        devices: [],
        deviceName: '',
        deviceNum: '',
        confirmModalShow: false,
        confirmModalContent: null,
        confirmModalDelete: null
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

    // console.log(state.hubs);
    // console.log(state.devices);

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
        const hubsElement = state.hubs.map((hub, idx) => {
            const devicesElement = state.devices.filter(device => device.hub_id === hub.id).map((device, idx) => {
                return (
                    <div key={device.id} className="mb-3">
                        {idx +1}. Device | name: {device.name} | type: {device.device_name} | ID: {device.id} | hubID: {device.hub_id}
                        <Button className="ml-2" outline color="danger" size="sm" onClick={e => onDeleteDeviceBtnClick(e, device.id)}>
                            Delete
                        </Button>{' '}
                    </div>
                );
            });
            return (
                <div key={hub.id} className="mb-3">
                    <Link to={'/user/hub/' + hub.id}>
                        {idx + 1}. Hub | name: {hub.name} | ID: {hub.id}
                    </Link>
                    <Button
                        className="ml-2"
                        outline
                        color="danger"
                        size="sm"
                        onClick={e => onDeleteHubBtnClick(e, hub.id)}
                    >
                        Delete
                    </Button>{' '}
                    {devicesElement}
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
                </div>
            );
        });
        return (
            <Container>
                <ConfirmModal
                    className="bg-danger"
                    title="Confirm Deletion"
                    show={state.confirmModalShow}
                    delete={state.confirmModalDelete}
                    close={() => setState({...state, confirmModalShow: false})}
                >{state.confirmModalContent}
                </ConfirmModal>
                <h3>Smart Garden</h3>
                {hubsElement}
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
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Hubs;