/* ********************************************************* IMPORT ********************************************************* */
import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

/* ********************************************************* COMPONENT ********************************************************* */
// Is used to let the user confirm an action once again in the form of a modal. 
// For example, if something is to be irrevocably deleted, the user must press the delete button again. 
// At this point, the user can also cancel the action.
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

/* ********************************************************* EXPORT ********************************************************* */
export default ConfirmModal;
