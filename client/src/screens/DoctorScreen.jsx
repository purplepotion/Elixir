import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Button, Row, Col, Table, Container } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { getUserDetails } from '../actions/user.actions';
import { listPatients } from '../actions/doctor.actions';

const ProfileScreen = ({ history }) => {
  const [message, setMessage] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const patientList = useSelector((state) => state.patientList);
  const { loading: loadingPatients, error: errorPatients, patients } = patientList;

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
    }
  }, [dispatch, user, userInfo, refresh]);

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
          <h2>My Patients</h2>

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
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default ProfileScreen;
