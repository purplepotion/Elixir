// import axios from 'axios';
// import BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createConsultation } from '../actions/user.actions';
// import { RECORD_CREATE_RESET } from '../constants/record.constants';
// import { PATIENT_CREATE_RECORD_RESET } from '../constants/doctor.constants';
// import { createPatientRecord } from '../actions/doctor.actions';

const AddConsultationScreen = ({ history, match }) => {
  const doctorId = match.params.hid;

  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const userConsultation = useSelector((state) => state.userConsultation);
  const {
    loading: loadingConsultation,
    error: errorConsultation,
    success: successConsultation,
  } = userConsultation;

  // const patientCreateRecord = useSelector((state) => state.patientCreateRecord);
  // const {
  //   loading: loadingPatientRecord,
  //   error: errorPatientRecord,
  //   success: successPatientRecord,
  // } = patientCreateRecord;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
    if (successConsultation) {
      history.push('/profile');
    }
  }, [dispatch, history, successConsultation, doctorId, userInfo]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(createConsultation(doctorId, [...symptoms, otherSymptoms], age, gender, description));
  };

  const symptomsHandler = (e) => {
    setSymptoms((state) => {
      if (state.includes(e.target.value)) {
        return state.filter((s) => s !== e.target.value);
      }
      return [...state, e.target.value];
    });
  };

  return (
    <Container>
      <Link to='/profile' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Request Consultation</h1>
        {loadingConsultation && <Loader />}
        {errorConsultation && <Message variant='danger'>{errorConsultation}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='age'>
              <Form.Label>Age</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Age'
                value={age}
                onChange={(e) => setAge(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='gender'>
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as='select'
                placeholder='Select Gender'
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option>Select Gender</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Symptoms</Form.Label>
              <Form.Group>
                <Form.Check
                  inline
                  label='Fever'
                  type='checkbox'
                  value='fever'
                  id='fever'
                  checked={symptoms.includes('fever')}
                  onChange={symptomsHandler}
                />
                <Form.Check
                  inline
                  label='Cough'
                  value='cough'
                  type='checkbox'
                  id='cough'
                  checked={symptoms.includes('cough')}
                  onChange={symptomsHandler}
                />
                <Form.Check
                  inline
                  label='Dry throat'
                  value='dry throat'
                  type='checkbox'
                  id='dry-throat'
                  checked={symptoms.includes('dry throat')}
                  onChange={symptomsHandler}
                />
              </Form.Group>
              <Form.Control
                type='text'
                placeholder='Any other symptoms'
                value={otherSymptoms}
                onChange={(e) => setOtherSymptoms(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type='submit' variant='primary'>
              Request Consultation
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default AddConsultationScreen;
