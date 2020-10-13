import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
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
    checkHubNumPost, 
    addHubPost,
    getHubsPost,
    deleteHubPost
} from '../services/productsApi';

const Hubs = props => {
    const initialState = {
        hubs: [],
        addModalShow: false,
        confirmModalShow: false,
        confirmModalContent: null,
        confirmModalPayload: null
    };
    const [state, setState] = useState(initialState);

    // run at initial render
    useEffect(() => {
        getHubsPost().then(data => {
            switch (data) {
                case 2:
                    alert('Server error');
                    break;
                case 10:
                    break;
                default:
                    setState({...state, hubs: data});
                    break;
            }
        }).catch(err => {
            alert(err);
        });
    }, []);

    const onDeleteBtnClick = (e, hubID) => {
        e.preventDefault();
        setState({
            ...state,
            confirmModalShow: true,
            confirmModalContent: (
                <p>
                    Are you sure you want to delete this hub?<br />
                    All your devices connected to this hub will also be deleted.<br />
                    Please add them to another hub first if you want to keep them.
                </p>
            ),
            confirmModalPayload: hubID
        });
    };
    const confirmDeletion = hubID => {
        deleteHubPost(hubID).then(data => {
            if (data !== 2) {
                setState({
                    ...state, 
                    hubs: data,
                    confirmModalShow: false
                });
            } else {
                alert('Server error!');
            }
        }).catch(err => {
            alert(err);
        });
    };

    const onAddHubBtnClick = e => {
        e.preventDefault();
        setState({
            ...state,
            addModalShow: true
        });
    };
    const confirmAdding = (hubName, hubNum) => {
        if (hubName.trim() && hubNum.trim()) {
            checkHubNumPost(hubNum.trim()).then(data => {
                // 1 serialnumber found
                // 2 server error
                // 3 serialnumber not found
                // 4 serialnumber already registered
                switch (data) {
                    case 1:
                        addHubPost(hubName.trim(), hubNum.trim()).then(data => {
                            if (data !== 2) {
                                setState({
                                    ...state, 
                                    hubs: data,
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

    if (state.hubs) {
        // console.log(state.hubs)
        const hubsElement = state.hubs.map((hub, idx) => {
            return (
                <div key={hub.id} className="mb-3">
                    <Link to={'/user/hub/' + hub.id}>
                        {idx + 1}. Hub | name: {hub.name} | ID: {hub.id}
                    </Link>
                    <Button
                        className="ml-2"
                        outline
                        color="danger"
                        size="sm"
                        onClick={e => onDeleteBtnClick(e, hub.id)}
                    >
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
                    close={() => setState({...state, confirmModalShow: false})}
                >
                    {state.confirmModalContent}
                </ConfirmModal>
                <AddProductModal
                    className="bg-primary"
                    title="Add Smart Garden Hub"
                    show={state.addModalShow}
                    add={confirmAdding}
                    close={() => setState({...state, addModalShow: false})}
                ></AddProductModal>
                <h3>Smart Garden Hubs</h3>
                {hubsElement}
                <Button className="mb-3" size="sm" outline color="primary" onClick={onAddHubBtnClick}>
                    Add Hub
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

export default Hubs;