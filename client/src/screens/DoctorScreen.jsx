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

import { getUserDetails } from '../actions/user.actions';
import { listPatients, getConsultations, approveConsultation } from '../actions/doctor.actions';

const ProfileScreen = ({ history }) => {
  const [message] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const patientList = useSelector((state) => state.patientList);
  const { loading: loadingPatients, error: errorPatients, patients } = patientList;

  const doctorConsultations = useSelector((state) => state.doctorConsultations);
  const { consultations } = doctorConsultations;

  const consultationApproval = useSelector((state) => state.consultationApproval);
  const { loading: loadingApproval } = consultationApproval;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else if (userInfo.userType === 'patient') {
      history.push('/profile');
    } else if (!user || !user.name) {
      dispatch(getUserDetails());
    }
  }, [dispatch, history, userInfo, user]);

  useEffect(() => {
    if (user && userInfo && userInfo.userType !== 'patient') {
      dispatch(listPatients());
      dispatch(getConsultations());
    }
  }, [dispatch, user, userInfo, loadingApproval, refresh]);

  const approvalHandler = (req_id, patientId, isApproved) => {
    dispatch(approveConsultation(req_id, patientId, isApproved));
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
            defaultActiveKey='patients'
            id='uncontrolled-tab'
            style={{
              margin: '0',
              borderBottom: '1px solid #dddddd',
            }}
          >
            <Tab eventKey='patients' title='My Patients'>
              {loadingPatients ? (
                <Loader />
              ) : errorPatients ? (
                <Message variant='danger'>{errorPatients}</Message>
              ) : (
                <Table striped bordered hover responsive className='table'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient, index) => (
                      <tr key={index}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>
                          <LinkContainer to={`/patients/details/${patient.id}`}>
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
              <LinkContainer to='/patients/add'>
                <Button variant='primary' className='right'>
                  Add New Patient
                </Button>
              </LinkContainer>
            </Tab>
            <Tab eventKey='consultations' title='Consultation Requests'>
              <div className='mt-4'>
                {consultations.map((consul) => (
                  <Alert variant='info' className='p-2' key={consul._id.$oid}>
                    <Row className='align-items-center'>
                      <Col md={10}>
                        <p className='m-0'>
                          <strong>{`${consul.patientName}`}</strong> has requested your
                          consultation.{' '}
                          <Link
                            to={`/consultations/details/${consul._id.$oid}`}
                            className='p-0 m-0'
                          >
                            View Details
                          </Link>
                          .
                        </p>
                      </Col>
                      <Col md={2} className='p-0 d-flex flex-column'>
                        {loadingApproval ? (
                          <Spinner animation='border' />
                        ) : (
                          <>
                            <Button
                              variant='success'
                              className='btn-sm'
                              style={{ margin: '0 0 0.5rem 0' }}
                              onClick={() =>
                                approvalHandler(consul._id.$oid, consul.patient.$oid, true)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant='danger'
                              className='btn-sm'
                              onClick={() =>
                                approvalHandler(consul._id.$oid, consul.patient.$oid, false)
                              }
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
