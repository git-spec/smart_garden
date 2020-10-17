import React, {useState} from 'react';
import {Form, FormGroup, Label, Input, Button} from 'reactstrap';

function PlusInput() {
    const initialState = {

    };
    const [state, setState] = useState();

    return(
        <Form>
            <FormGroup className="badge-pill plus-input col-sm-6 px-0">
                <Label className="px-2">
                    <svg version="1.1" className="plus"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px" y="0px" width="67px" height="67px" viewBox="0 0 67 67" enableBackground="new 0 0 67 67">
                        <path d="M61.667,28.334H38.333V5c0-2.761-2.238-5-5-5s-5,2.239-5,5v23.334H5c-2.762,0-5,2.239-5,5s2.238,5,5,5h23.333v23.333
                            c0,2.762,2.238,5,5,5s5-2.238,5-5V38.334h23.334c2.762,0,5-2.239,5-5S64.429,28.334,61.667,28.334z"/>
                    </svg>
                    <svg version="1.1" className="minus"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px" y="0px" width="67px" height="67px" viewBox="0 -28.334 67 67" enableBackground="new 0 -28.334 67 67">
                        <path d="M61.667,10H5c-2.762,0-5-2.239-5-5s2.238-5,5-5h56.667c2.762,0,5,2.239,5,5S64.429,10,61.667,10z"/>
                    </svg>
                </Label>
                <Input className="badge-pill bg-transparent py-0" placeholder="Enter your Hub" />
                <Button className="plus badge-pill btn-outline-light bg-transparent py-0 my-0">
                    <svg version="1.1" className="plus"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px" y="0px" width="67px" height="67px" viewBox="0 0 67 67" enableBackground="new 0 0 67 67">
                        <path d="M61.667,28.334H38.333V5c0-2.761-2.238-5-5-5s-5,2.239-5,5v23.334H5c-2.762,0-5,2.239-5,5s2.238,5,5,5h23.333v23.333
                            c0,2.762,2.238,5,5,5s5-2.238,5-5V38.334h23.334c2.762,0,5-2.239,5-5S64.429,28.334,61.667,28.334z"/>
                    </svg>
                </Button>
            </FormGroup>
        </Form>
    );
}

export default PlusInput;