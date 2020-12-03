import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class PopUpModal extends React.Component {

    toggle = () => {
        this.props.close();
    };

    render() {
        return (
            <Modal isOpen={this.props.show} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle} className={this.props.className}>
                    {this.props.title}
                </ModalHeader>
                <ModalBody className="text-dark">
                    {this.props.children}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default PopUpModal;