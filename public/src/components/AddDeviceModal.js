import React, {useState} from 'react';
import {
    Button, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Input
} from 'reactstrap';

const AddDeviceModal = props => {
    const initialState = {
        deviceNum: ''
    };
    const [state, setState] = useState(initialState);

    return (
        <Modal isOpen={props.show} toggle={props.close}>
            <ModalHeader toggle={props.close} className={props.className}>
                {props.title}
            </ModalHeader>
            <ModalBody>
                <Input
                    placeholder="Insert a Serialnumber"
                    onChange={e => setState({...state, deviceNum: e.target.value})}
                    value={state.deviceNum}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => props.addDevice(props.payload, state.deviceNum)}>
                    Add
                </Button>{' '}
                <Button color="secondary" onClick={props.close}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddDeviceModal;