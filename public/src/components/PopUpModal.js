/* ********************************************************* IMPORT ********************************************************* */
import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

/* ********************************************************* COMPONENT ********************************************************* */
// Used to give the user hints in the form of a modal. For example, if a required field has not been filled in.
class PopUpModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.show} toggle={this.props.close} className="modal-dialog-centered">
                <ModalHeader toggle={this.props.close} className={this.props.className}>
                    {this.props.title}
                </ModalHeader>
                <ModalBody className="text-dark">
                    {this.props.children}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.close}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

/* ********************************************************* EXPORT ********************************************************* */
export default PopUpModal;