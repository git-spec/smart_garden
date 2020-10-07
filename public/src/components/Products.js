import React, {useState, useEffect} from 'react';
import {
    InputGroup, 
    InputGroupAddon, 
    Button, 
    Input, 
    Label,
    Container
} from 'reactstrap';
// components
import AddDeviceModal from './AddDeviceModal'
// services
import {
    checkHubNumPost, 
    checkDeviceNumPost, 
    addHubPost,
    addDevicePost,
    getHubsPost,
    getDevicesPost
} from '../services/devicesApi';

const Products = props => {
    const initialState = {
        hubNum: '',
        hubs: [],
        devices: [],
        modalShow: false,
        modalPayload: null
    };
    const [state, setState] = useState(initialState);

    // run at initial render
    useEffect(() => {
        getHubsPost().then(hubs => {
            // console.log(data)
            if (hubs !== 2) {
                getDevicesPost().then(devices => {
                    if (devices !== 2) {
                        setState({...state, hubs, devices});
                    } else {
                        alert('Server error!');
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                alert('Server error!');
            }
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const onAddHubBtnClick = e => {
        e.preventDefault();
        checkHubNumPost(state.hubNum.trim()).then(data => {
            // 1 serialnumber found
            // 2 serialnumber not found or already registered
            // 3 server error
            switch (data) {
                case 1:
                    addHubPost(state.hubNum.trim()).then(data => {
                        // console.log('Products.js: ', data);
                        if (data !== 2) {
                            setState({...state, hubs: data});
                        } else {
                            alert('Server error!');
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                    break;
                case 2:
                    alert('Serialnumber not found or already registered!');
                    break;
                case 3:
                    alert('Server error!');
                    break;
                default:
                    break;
            }
        }).catch(err => {
            console.log(err);
        });
    };

    const onAddDeviceBtnClick = (e, hubID) => {
        e.preventDefault();
        setState({
            ...state,
            modalShow: true,
            modalPayload: hubID
        });
    };

    const confirmAdding = (hubID, deviceNum) => {
        checkDeviceNumPost(deviceNum.trim()).then(data => {
            // 1 serialnumber found
            // 2 serialnumber not found or already registered
            // 3 server error
            switch (data) {
                case 1:
                    addDevicePost(hubID, deviceNum.trim()).then(data => {
                        console.log('Products.js: ', data);
                        if (data !== 2) {
                            setState({
                                ...state, 
                                devices: data, 
                                modalShow: false
                            });
                        } else {
                            alert('Server error!');
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                    break;
                case 2:
                    alert('Serialnumber not found or already registered!');
                    break;
                case 3:
                    alert('Server error!');
                    break;
                default:
                    break;
            }
        }).catch(err => {
            console.log(err);
        });
    };

    const hubsElement = state.hubs.map(hub => {
        return (
            <div key={hub.id} className="mb-3">
                hub: {hub.id} 
                <Button className="ml-2" outline color="danger" size="sm">
                    Delete
                </Button>{' '}
                <Button
                    className="ml-2" outline color="primary" size="sm"
                    onClick={e => onAddDeviceBtnClick(e, hub.id)}
                >Add Device
                </Button>{' '}
            </div>
        );
    });

    const devicesElement = state.devices.map(device => {
        return (
            <div key={device.id} className="mb-3">
                device: {device.id} | type: {device.type_id} | connected to hub: {device.hub_id}
                <Button className="ml-2" outline color="danger" size="sm">
                    Delete
                </Button>{' '}
                <Button
                    className="ml-2" outline color="primary" size="sm"
                    // onClick={e => onAddDeviceBtnClick(e, hub.id)}
                >Edit
                </Button>{' '}
            </div>
        );
    });

    return (
        <Container>
            <AddDeviceModal
                className="bg-primary"
                title="Add Smart Garden Device"
                show={state.modalShow}
                payload={state.modalPayload}
                addDevice={confirmAdding}
                close={() => setState({ ...state, modalShow: false })}
            >
            </AddDeviceModal>
            <h1>My Smart Garden</h1>
            <InputGroup className="mb-3">
                <Label for="hubInp" className="mr-1">Add a Smart Hub</Label>
                <Input
                    id="hubInp"
                    placeholder="Insert a Serialnumber"
                    onChange={e => setState({
                        ...state,
                        hubNum: e.target.value
                    })}
                    value={state.hubNum}
                />
                <InputGroupAddon addonType="append">
                    <Button color="secondary" onClick={onAddHubBtnClick}>Add</Button>{' '}
                </InputGroupAddon>
            </InputGroup>
            {hubsElement}
            {devicesElement}
        </Container>
    );
};

export default Products;