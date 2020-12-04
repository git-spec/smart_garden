/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState, useEffect} from 'react';
// router dom
import {Link} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
// reactstrap
import {Container, Row, Col, Button, Table, Breadcrumb, BreadcrumbItem} from 'reactstrap';
// components
import PopUpModal from './PopUpModal';
import ConfirmModal from './ConfirmModal';
// services
import {getAllUsers, changeVerificationPost, deleteUserPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const SubAdmin = props => {

    const initialState = {
        users: [],
        confirmModalShow: false,
        confirmModalContent: null,
        confirmModalDelete: null,
        errorComponent: null,
        showErrorModal: false,
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        getAllUsers().then(data => {
            setState({
                ...state,
                users: data
            });
        }).catch(err => {
            console.log(err);
        });
    // eslint-disable-next-line
    }, []);

/* ********************************************************* CHANGE USER VERIFICATION ********************************************************* */
    const onVerifiedBtnClick = (e, userID, email, verified) => {
        e.preventDefault();
        changeVerificationPost(userID, email, verified).then(() => {
            // change the user array in the state after it has been changed in the database
            let newUsers = state.users.map(user => {
                if (user.id === userID) {
                    user.verified = !user.verified;
                }
                return user;
            });
            setState({
                ...state,
                users: newUsers
            });
        }).catch(err => {
            console.log(err);
        });
    };

/* ********************************************************* DELETE USER ********************************************************* */
    const onDeleteBtnClick = (e, userID, idx) => {
        e.preventDefault();
        const deleteUser = userID => {
            deleteUserPost(userID).then(data => {
                if (data === 1) {
                    state.users.splice(idx, 1);
                    // change the user array in the state after it has been changed in the database
                    setState({
                        ...state,
                        users: state.users,
                        confirmModalShow: false
                    });
                } else {
                    alert('Server error!');
                }
            }).catch(err => {
                console.log(err);
            });
        };
        setState({
            ...state,
            confirmModalShow: true,
            confirmModalContent: (
                <p>
                    Are you sure you want to delete this Users?
                    <br />
                    You can't undo it after deletion.
                </p>
            ),
            confirmModalDelete: () => deleteUser(userID)
        });
    };

/* ********************************************************* CLOSE MODAL ********************************************************* */
    const closeModal = () => {
        setState({
            ...state,
            showErrorModal: false
        });
    };

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Fragment>
{/* ********************************************************* MODALS ********************************************************* */}
            <ConfirmModal
                className="bg-danger"
                title="Confirm Deletion"
                show={state.confirmModalShow}
                delete={state.confirmModalDelete}
                close={() => setState({...state, confirmModalShow: false})}
            >
                {state.confirmModalContent}
            </ConfirmModal>
            <PopUpModal 
                show={state.showErrorModal} 
                close={closeModal} 
                className="bg-danger" 
                title="Entries Error"
            >
                {state.errorComponent}
            </PopUpModal>
{/* ********************************************************* BREADCRUMB ********************************************************* */}
            <Container className="pt-4 mt-5">
                <Col className="p-0 mb-3">
                    <Breadcrumb className="bg-transparent">
                        <BreadcrumbItem className="bg-transparent">
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem className="bg-transparent">
                            <Link to="/user/profile">UserProfile</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem className="bg-transparent" active>
                            SubAdminPanel
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
{/* ********************************************************* HEADLINE ********************************************************* */}
                <Row>
                    <Col xs={6} md={9}>
                        <h3 className="text-trans mb-4">Hello admin,</h3>
                        <p className="text-trans mb-4">here you have access to the user settings:</p>
                    </Col>
                </Row>
{/* ********************************************************* TABLE ********************************************************* */}
                <Row>
                    <Table hover dark responsive>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Verified</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.users.map((user, idx) => {
                                if (user.role === 'admin' || user.role === 'subadmin') {
                                    return null;
                                } else {
                                    return (
                                        <tr key={user.id}>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Button
                                                    outline={user.verified ? false : true}
                                                    color={user.verified ? 'info' : 'secondary'}
                                                    disabled={user.role === 'admin' ? true : false}
                                                    onClick={e => onVerifiedBtnClick(e, user.id, user.email, user.verified)}
                                                >
                                                    {user.verified ? 'Yes' : 'No'}
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={e => onDeleteBtnClick(e, user.id, idx)}
                                                    outline
                                                    color="danger"
                                                    disabled={user.role === 'admin' ? true : false}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </Fragment>
    );
};

const mapStateToProps = state => {
    return {user: state.user};
};
export default connect(mapStateToProps)(SubAdmin);
