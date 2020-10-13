import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
    // InputGroup, 
    // InputGroupAddon, 
    Button, 
    // Input, 
    // Label,
    Container
} from 'reactstrap';
// components
import AddProductModal from './AddProductModal';
import ConfirmModal from './ConfirmModal';
// services
import {
    checkDeviceNumPost, 
    addDevicePost,
    getDevicesPost,
    deleteDevicePost
} from '../services/productsApi';

const Devices = props => {

    const params = useParams()

    const initialState = {
        devices: [],
        addModalShow: false,
        confirmModalShow: false,
        confirmModalContent: null,
        confirmModalPayload: null
    };
    const [state, setState] = useState(initialState);

    // run at initial render
    useEffect(() => {
        getDevicesPost(params.id).then(data => {
            switch (data) {
                case 2:
                    alert('Server error');
                    break;
                case 10:
                    break;
                default:
                    setState({...state, devices: data});
                    break;
            }
        }).catch(err => {
            alert(err);
        });
    }, []);

    const onDeleteBtnClick = (e, deviceID) => {
        e.preventDefault();
        setState({
            ...state,
            confirmModalShow: true,
            confirmModalContent: <p>Are you sure you want to delete this device?</p>,
            confirmModalPayload: deviceID
        });
    };
    const confirmDeletion = deviceID => {
        deleteDevicePost(deviceID, params.id).then(data => {
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

    const onAddDeviceBtnClick = e => {
        e.preventDefault();
        setState({
            ...state,
            addModalShow: true
        });
    };
    const confirmAdding = (deviceName, deviceNum) => {
        if (deviceName.trim() && deviceNum.trim()) {
            checkDeviceNumPost(deviceNum.trim()).then(data => {
                // 1 serialnumber found
                // 2 server error
                // 3 serialnumber not found
                // 4 serialnumber already registered
                switch (data) {
                    case 1:
                        addDevicePost(deviceName.trim(), deviceNum.trim(), params.id).then(data => {
                            if (data !== 2) {
                                setState({
                                    ...state, 
                                    devices: data, 
                                    addModalShow: false
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
            alert('Please fill in all inputs!');
        }
    };

    if (state.devices) {
        // console.log(state.devices)
        const devicesElement = state.devices.map((device, idx) => {
            return (
                <div key={device.id} className="mb-3">
                    {idx +1}. Device | name: {device.name} | type: {device.device_name} | ID: {device.id} | hubID: {device.hub_id}
                    {/* <Button className="ml-2" outline color="primary" size="sm">
                        Edit
                    </Button>{' '} */}
                    <Button className="ml-2" outline color="danger" size="sm" onClick={e => onDeleteBtnClick(e, device.id)}>
                        Delete
                    </Button>{' '}
                </div>
            );
        });
        return (
            <Container>
                <ConfirmModal
                    className="bg-danger"
                    title="Confirm Deletion"
                    payload={state.confirmModalPayload}
                    show={state.confirmModalShow}
                    delete={confirmDeletion}
                    close={() => setState({ ...state, confirmModalShow: false })}
                >{state.confirmModalContent}
                </ConfirmModal>
                <AddProductModal
                    className="bg-primary"
                    title="Add Smart Garden Device"
                    show={state.addModalShow}
                    add={confirmAdding}
                    close={() => setState({ ...state, addModalShow: false })}
                >
                </AddProductModal>
                <h3>Smart Garden Devices for HubID {params.id}</h3>
                {devicesElement}
                <Button className="mb-3" size="sm" outline color="primary" onClick={onAddDeviceBtnClick}>
                    Add Device
                </Button>{' '}
                {/* <InputGroup className="mb-3">
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
                </InputGroup> */}
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Devices;