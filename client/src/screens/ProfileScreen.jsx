import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import {
  Card,
  Button,
  Row,
  Col,
  Table,
  Container,
  Tabs,
  Tab,
  Alert,
  Spinner,
} from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { getUserDetails, getNotifications, consentRequest } from '../actions/user.actions';
import { listRecords } from '../actions/record.actions';
// import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ history }) => {
  const [message, setMessage] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userConsent = useSelector((state) => state.userConsent);
  const { loading: loadingConsent, error: errorConsent, success: successConsent } = userConsent;

  const recordList = useSelector((state) => state.recordList);
  const { loading: loadingRecords, error: errorRecords, records } = recordList;

  const userNotifications = useSelector((state) => state.userNotifications);
  const {
    loading: loadingNotification,
    error: errorNotification,
    notifications,
  } = userNotifications;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else if (userInfo.userType !== 'patient') {
      history.push('/profile/doctor');
    } else if (!user || !user.name) {
      dispatch(getUserDetails());
    }
  }, [dispatch, history, userInfo, user]);

  useEffect(() => {
    if (user && userInfo && userInfo.userType === 'patient') {
      dispatch(listRecords());
      dispatch(getNotifications());
    }
  }, [dispatch, user, userInfo, loadingConsent, refresh]);

  const consentRequestHandler = (notifId, isApproved) => {
    dispatch(consentRequest(notifId, isApproved));
  };

  const refreshHandler = () => {
    setRefresh(!refresh);
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <h2>User Profile</h2>
          {message && <Message variant='danger'>{message}</Message>}
          {error && <Message variant='danger'>{error}</Message>}
          {/* {success && <Message variant='success'>Profile Updated!</Message>} */}
          {loading && <Loader />}

          <Card style={{ padding: '1rem' }}>
            {userInfo && (
              <Table striped borderless responsive>
                <tbody>
                  <tr>
                    <td>
                      <strong>ID</strong>
                    </td>
                    <td>{userInfo.id}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Name</strong>
                    </td>
                    <td>{userInfo.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email</strong>
                    </td>
                    <td>{userInfo.email}</td>
                  </tr>
                </tbody>
              </Table>
            )}
            <Button variant='secondary' onClick={refreshHandler}>
              Refresh
            </Button>
          </Card>
        </Col>
        <Col md={8}>
          <Tabs
            fill
            variant='tabs'
            defaultActiveKey='records'
            id='uncontrolled-tab'
            style={{
              margin: '0',
              borderBottom: '1px solid #dddddd',
            }}
          >
            <Tab eventKey='records' title='Records'>
              {loadingRecords ? (
                <Loader />
              ) : errorRecords ? (
                <Message variant='danger'>{errorRecords}</Message>
              ) : (
                <Table striped bordered hover responsive className='table mt-4'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      {/* <th>DOCTOR NAME</th> */}
                      <th>CATEGORY</th>
                      <th>DESCRIPTION</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        <td>{record.id}</td>
                        <td>{record.name}</td>
                        {/* <td>{record.doctorName}</td> */}
                        <td>{record.category}</td>
                        <td>{record.description}</td>
                        <td>
                          <LinkContainer to={`/records/details/${record.id}`}>
                            <Button variant='light' className='btn-sm'>
                              Details
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <LinkContainer to='/records/add'>
                <Button variant='primary'>Add New Record</Button>
              </LinkContainer>
            </Tab>
            <Tab eventKey='notifications' title='Notifications'>
              <div className='mt-4'>
                {notifications.map((notif) => (
                  <Alert variant='info' className='p-2' key={notif.id}>
                    <Row className='align-items-center'>
                      <Col md={10}>
                        <p className='m-0'>
                          <strong>{`Dr. ${notif.healthOfficial.name}`}</strong> has requested access
                          to your record{' '}
                          <Link to={`/records/details/${notif.record.id}`} className='p-0 m-0'>
                            {`${notif.record.name}`}
                          </Link>
                          .
                        </p>
                      </Col>
                      <Col md={2} className='p-0 d-flex flex-column'>
                        {loadingConsent ? (
                          <Spinner animation='border' />
                        ) : (
                          <>
                            <Button
                              variant='success'
                              className='btn-sm'
                              style={{ margin: '0 0 0.5rem 0' }}
                              onClick={() => consentRequestHandler(notif.id, true)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant='danger'
                              className='btn-sm'
                              onClick={() => consentRequestHandler(notif.id, false)}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Alert>
                ))}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default ProfileScreen;
