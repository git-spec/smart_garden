/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState, useEffect} from 'react';
// router dom
import {Link} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
// reactstrap
import {Container, Row, Col, Button, Table, ButtonGroup, Breadcrumb, BreadcrumbItem} from 'reactstrap';
// components
import ConfirmModal from './ConfirmModal';
// services
import {getAllUsersPost, changeVerificationPost, deleteUserPost, changeUserRolePost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const Admin = props => {

    const initialState = {
        users: [],
        confirmModalShow: false,
        confirmModalContent: null,
        confirmModalDelete: null
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* USE EFFECT ********************************************************* */
    // gets all users from the database on first rendering
    useEffect(() => {
        getAllUsersPost().then(data => {
            switch (data) {
                case 2:
                    alert('Server error!');
                    break;
                case 3:
                    alert('No users found!');
                    break;
                default:
                    setState({...state, users: data});
                    break;
            }
        }).catch(err => {
            console.log(err);
        });
    // eslint-disable-next-line
    }, []);

/* ********************************************************* CHANGE USER VERIFICATION ********************************************************* */
    // changes the verification of a user by clicking the verified button
    const onVerifiedBtnClick = (e, userID, email, verified) => {
        e.preventDefault();
        // changes the verification of a user in the database
        changeVerificationPost(userID, email, verified).then(data => {
            switch (data) {
                case 1:
                    // changes the user array in the state after it has been changed in the database
                    let newUsers = state.users.map(user => {
                        if (user.id === userID) {
                            user.verified = !user.verified;
                        }
                        return user;
                    });
                    setState({...state, users: newUsers});
                    break;
                case 2:
                    alert('Server error!');
                    break;
                case 3:
                    alert('Email has not been sent!');
                    break;
                default:
                    break;
            }
        }).catch(err => {
            console.log(err);
        });
    };

/* ********************************************************* DELETE USER ********************************************************* */
    // deletes a user by clicking the delete button
    const onDeleteBtnClick = (e, userID, idx) => {
        e.preventDefault();
        const deleteUser = userID => {
            // deletes a user in the database
            deleteUserPost(userID).then(data => {
                if (data === 1) {
                    state.users.splice(idx, 1);
                    // changes the user array in the state after it has been changed in the database
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
                alert('Server error!');
            });
        };
        // a modal asks one more time before the user is finally deleted
        setState({
            ...state,
            confirmModalShow: true,
            confirmModalContent: (
                <p>
                    Are you sure you want to delete this user?
                    <br />
                    You can't undo it after deletion.
                </p>
            ),
            confirmModalDelete: () => deleteUser(userID)
        });
    };

/* ********************************************************* CHANGE USER ROLE ********************************************************* */
    // changes the role of the user by pressing the button from user to admin or vice versa
    const changeUserRole = (e, role, userID) => {
        e.preventDefault();
        // changes the user role in the database
        changeUserRolePost(userID, role).then(data => {
            if (data === 1) {
                // changes the user array in the state after it has been changed in the database
                let newUsers = state.users.map(user => {
                    if (user.id === userID) {
                        user.role = role;
                    }
                    return user;
                });
                setState({...state, users: newUsers});
            } else {
                alert('Server error!');
            }
        }).catch(err => {
            console.log(err);
        });
    };

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Fragment>
{/* ********************************************************* MODAL ********************************************************* */}
            <ConfirmModal
                className="bg-danger"
                title="Confirm Deletion"
                show={state.confirmModalShow}
                delete={state.confirmModalDelete}
                close={() => setState({...state, confirmModalShow: false})}
            >
                {state.confirmModalContent}
            </ConfirmModal>
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
                            AdminPanel
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
                                <th>Role</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.users.map((user, idx) => {
                                let userRole = null;
                                if (state.users[idx].role === 'admin') {
                                    userRole = (
                                        <Button outline color="warning" disabled>
                                            {"' "}Administrator{" '"}
                                        </Button>
                                    );
                                } else {
                                    userRole = (
                                        <ButtonGroup>
                                            <Button
                                                outline={state.users[idx].role === 'user' ? false : true}
                                                color={state.users[idx].role === 'user' ? 'info' : 'secondary'}
                                                onClick={e => changeUserRole(e, 'user', user.id, idx)}
                                                active={state.users[idx].role === 'user' ? true : false}
                                            >
                                                User
                                            </Button>
                                            <Button
                                                outline={state.users[idx].role === 'subadmin' ? false : true}
                                                color={state.users[idx].role === 'subadmin' ? 'info' : 'secondary'}
                                                onClick={e => changeUserRole(e, 'subadmin', user.id, idx)}
                                                active={state.users[idx].role === 'subadmin' ? true : false}
                                            >
                                                SAdmin
                                            </Button>
                                        </ButtonGroup>
                                    );
                                }
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
                                        <td>{userRole}</td>
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
                            })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </Fragment>
    );
};

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {user: state.user};
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps)(Admin);
