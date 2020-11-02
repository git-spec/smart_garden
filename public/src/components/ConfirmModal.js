import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

const ConfirmModal = props => {
    return (
        <Modal isOpen={props.show} toggle={props.close}>
            <ModalHeader toggle={props.close} className={props.className}>
                {props.title}
            </ModalHeader>
            <ModalBody className="text-dark">{props.children}</ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={props.delete}>
                    Delete
                </Button>{' '}
                <Button color="secondary" onClick={props.close}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ConfirmModal;
