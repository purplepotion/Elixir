import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { addPatient } from '../actions/doctor.actions';
import { PATIENT_ADD_RESET } from '../constants/doctor.constants';

const AddPatientScreen = ({ history, match }) => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const patientAdd = useSelector((state) => state.patientAdd);
  const { loading: loadingPatient, error: errorPatient, success: successPatient } = patientAdd;

  useEffect(() => {
    if (!userInfo || userInfo.userType === 'patient') {
      history.push('/login');
    }
    if (successPatient) {
      dispatch({ type: PATIENT_ADD_RESET });
      history.push('/profile');
    }
  }, [dispatch, history, successPatient, userInfo]);

  useEffect(() => {
    if (!userInfo) {
    }
  });

  const submitHandler = (event) => {
    event.preventDefault();
    console.log('Add a Patient!');
    dispatch(addPatient(email));
  };

  return (
    <Container>
      <Link to='/profile/doctor' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Patient</h1>
        {loadingPatient && <Loader />}
        {errorPatient && <Message variant='danger'>{errorPatient}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Patient Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Add Patient
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default AddPatientScreen;
