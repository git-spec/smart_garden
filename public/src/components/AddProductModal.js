import React, {useState} from 'react';
import {
    Button, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Input
} from 'reactstrap';

const AddProductModal = props => {
    const initialState = {
        productName: '',
        productNum: ''
    };
    const [state, setState] = useState(initialState);

    return (
        <Modal isOpen={props.show} toggle={props.close}>
            <ModalHeader toggle={props.close} className={props.className}>
                {props.title}
            </ModalHeader>
            <ModalBody>
                <Input
                    placeholder="Insert a Name"
                    onChange={e => setState({...state, productName: e.target.value})}
                    value={state.productName}
                />
                <Input
                    placeholder="Insert a Serialnumber"
                    onChange={e => setState({...state, productNum: e.target.value})}
                    value={state.productNum}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => props.add(state.productName, state.productNum)}>
                    Add
                </Button>{' '}
                <Button color="secondary" onClick={props.close}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddProductModal;