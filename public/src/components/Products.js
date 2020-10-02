import React, {useState} from 'react';
import {
    InputGroup,
    InputGroupAddon,
    Button,
    Input,
    Label,
    Col,
    Row,
    Container,
} from 'reactstrap';

const Products = (props) => {
    const initialState = {
        gardenID: '',
        plantID: ''
    };
    const [state, setState] = useState(initialState);

    console.log(state);

    return (
        // <React.Fragment>
        <Container>
            <h1>Your Smart Garden Products</h1>
            <Row>
                <Col>
                    <InputGroup>
                        <Label for="gardenInp" className="mr-1">
                            Smart Garden
                        </Label>
                        <Input
                            id="gardenInp"
                            placeholder="Insert a Product ID"
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    gardenID: e.target.value,
                                })
                            }
                            value={state.gardenID}
                        />
                        <InputGroupAddon addonType="append">
                            <Button color="secondary">Add</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
                <Col>
                    <InputGroup>
                        <Label for="plantInp" className="mr-1">
                            Smart Plant
                        </Label>
                        <Input
                            id="plantInp"
                            placeholder="Insert a Product ID"
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    plantID: e.target.value,
                                })
                            }
                            value={state.plantID}
                        />
                        <InputGroupAddon addonType="append">
                            <Button color="secondary">Add</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
            </Row>
        </Container>
        // </React.Fragment>
    );
};

export default Products;
