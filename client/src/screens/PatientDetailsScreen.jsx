import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Row, Col, Table, Container, Card, Spinner } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { getPatientDetails, createPatientNotification } from '../actions/doctor.actions';
import { PATIENT_CONSENT_RESET } from '../constants/doctor.constants';

const PatientDetailsScreen = ({ history, match }) => {
  const patientId = match.params.id;
  const [message, setMessage] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const patientDetails = useSelector((state) => state.patientDetails);
  const { loading: loadingPatient, error: errorPatient, patient } = patientDetails;

  const patientConsent = useSelector((state) => state.patientConsent);
  const { loading: loadingConsent, error: errorConsent, success: successConsent } = patientConsent;

  useEffect(() => {
    dispatch({ type: PATIENT_CONSENT_RESET });
    if (!userInfo) {
      history.push('/login');
    } else if (userInfo.userType === 'patient') {
      history.push('/profile');
    } else {
      dispatch(getPatientDetails(patientId));
    }
  }, [dispatch, history, userInfo, patientId, refresh]);

  const consentRequestHandler = (patientId, recordId) => {
    // console.log(patientId, recordId);
    if (patientId) {
      dispatch(createPatientNotification(patientId, recordId));
    }
  };

  const refreshHandler = () => {
    setRefresh(!refresh);
  };

  return (
    <Container>
      <Link to='/profile/doctor' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Row>
        <Col md={4}>
          <h2>Patient Details</h2>
          {message && <Message variant='danger'>{message}</Message>}
          {errorPatient && <Message variant='danger'>{errorPatient}</Message>}
          {loadingPatient && <Loader />}
          <Card style={{ padding: '1rem' }}>
            <Table striped borderless responsive>
              <tbody>
                <tr>
                  <td>
                    <strong>ID</strong>
                  </td>
                  <td>{patientId}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Name</strong>
                  </td>
                  <td>{patient.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Email</strong>
                  </td>
                  <td>{patient.email}</td>
                </tr>
              </tbody>
            </Table>
            <Button variant='secondary' onClick={refreshHandler}>
              Refresh
            </Button>
          </Card>
        </Col>
        <Col md={8}>
          <h2>Patient Records</h2>

          {loadingPatient ? (
            <Loader />
          ) : errorPatient ? (
            <Message variant='danger'>{errorPatient}</Message>
          ) : (
            <>
              {errorConsent && <Message variant='danger'>Consent Request Failed!</Message>}
              {successConsent && <Message variant='success'>Consent Request Sent!</Message>}
              <Table striped bordered hover responsive className='table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>RECORD</th>
                    <th>CATEGORY</th>
                    <th>DESCRIPTION</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {patient.records &&
                    patient.records.map((record, index) => (
                      <tr key={index}>
                        <td>{record.id}</td>
                        <td>{record.name}</td>
                        <td>{record.category}</td>
                        <td>{record.description}</td>
                        <td>
                          {record.isApproved ? (
                            <LinkContainer
                              to={`/patients/details/${patientId}/records/details/${record.id}`}
                            >
                              <Button variant='light' className='btn-sm'>
                                Details
                              </Button>
                            </LinkContainer>
                          ) : (
                            <Button
                              variant='light'
                              className='btn-sm'
                              onClick={() => consentRequestHandler(patientId, record.id)}
                            >
                              Request Consent
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          )}
          <LinkContainer to={`/patients/details/${patientId}/records/add`}>
            <Button variant='primary' className='right'>
              Add New Record
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default PatientDetailsScreen;
