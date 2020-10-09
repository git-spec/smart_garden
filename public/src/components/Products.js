import React, {useState} from 'react';
import {
    InputGroup, 
    InputGroupAddon, 
    Button, 
    Input, 
    Label, 
    // Col, 
    // Row, 
    Container
} from 'reactstrap';
import {checkHubNumPost} from '../services/api';

const Products = props => {
    const initialState = {
        hubID: '',
        deviceID: '',
        hubListContent: null,
        deviceListContent: null,
    };
    const [state, setState] = useState(initialState);

    // console.log(state);

    const onAddHubBtnClick = e => {
        e.preventDefault();
        checkHubNumPost(state.hubID.trim()).then(data => {
            // console.log('Products.js: ', data);
            // 1 serialnumber found
            // 2 serialnumber not found
            // 3 server error
            switch (data) {
                case 1:
                    alert('serialnumber found');
                    break;
                case 2:
                    alert('serialnumber not found');
                    break;
                case 3:
                    alert('server error');
                    break;
                default:
                    break;
            }
        }).catch(err => {
            console.log(err);
        });

        const hubList = (
            <React.Fragment>
                {state.hubListContent}
                <li className="mb-3">
                    Smart Garden Hub {state.hubID}
                    <Button className="ml-2" outline color="danger" size="sm">
                        Delete
                    </Button>{' '}
                    {/* <ul>{state.deviceListContent}</ul> */}
                </li>
            </React.Fragment>
        );
        setState({
            ...state,
            hubListContent: hubList,
        });
    };

    // const onAddDeviceBtnClick = e => {
    //     e.preventDefault();
    //     const deviceList = (
    //         <React.Fragment>
    //             {state.hubListContent}
    //             <li className="mb-3">
    //                 Smart Garden Device {state.deviceID}
    //                 <Button className="ml-2" outline color="danger" size="sm">
    //                     Delete
    //                 </Button>{' '}
    //             </li>
    //         </React.Fragment>
    //     );
    //     setState({
    //         ...state,
    //         hubListContent: deviceList,
    //     });
    // };

    return (
        <Container>
            <h1>My Smart Garden</h1>
            {/* <Row>
            <Col> */}
            <InputGroup className="mb-3">
                <Label for="hubInp" className="mr-1">
                    Add a Smart Hub
                </Label>
                <Input
                    id="hubInp"
                    placeholder="Insert a Product ID"
                    onChange={e => setState({
                        ...state,
                        hubID: e.target.value
                    })}
                    value={state.hubID}
                />
                <InputGroupAddon addonType="append">
                    <Button color="secondary" onClick={onAddHubBtnClick}>
                        Add
                    </Button>{' '}
                </InputGroupAddon>
            </InputGroup>
            {/* </Col>
            </Row> */}
            {/* <InputGroup className="mb-3">
                <Label for="deviceInp" className="mr-1">
                    Add a Smart Device
                </Label>
                <Input
                    id="deviceInp"
                    placeholder="Insert a Product ID"
                    onChange={e => setState({
                        ...state,
                        deviceID: e.target.value,
                    })}
                    value={state.deviceID}
                />
                <InputGroupAddon addonType="append">
                    <Button color="secondary" onClick={onAddDeviceBtnClick}>
                        Add
                    </Button>{' '}
                </InputGroupAddon>
            </InputGroup> */}
            <ul>{state.hubListContent}</ul>
        </Container>
    );
};

export default Products;
