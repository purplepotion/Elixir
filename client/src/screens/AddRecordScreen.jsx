import axios from 'axios';
import BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createRecord } from '../actions/record.actions';
import { RECORD_CREATE_RESET } from '../constants/record.constants';
import { PATIENT_CREATE_RECORD_RESET } from '../constants/doctor.constants';
import { createPatientRecord } from '../actions/doctor.actions';

const AddRecordScreen = ({ history, match }) => {
  const patientId = match.params.pid;

  const [name, setName] = useState('');
  const [doctor, setDoctor] = useState('');
  const [file, setFile] = useState('');
  const [category, setCategory] = useState('Discharge Report');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const recordCreate = useSelector((state) => state.recordCreate);
  const { loading: loadingRecord, error: errorRecord, success: successRecord } = recordCreate;

  const patientCreateRecord = useSelector((state) => state.patientCreateRecord);
  const {
    loading: loadingPatientRecord,
    error: errorPatientRecord,
    success: successPatientRecord,
  } = patientCreateRecord;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
    if (successRecord) {
      dispatch({ type: RECORD_CREATE_RESET });
      history.push('/profile');
    }
    if (successPatientRecord) {
      dispatch({ type: PATIENT_CREATE_RECORD_RESET });
      history.push(`/patients/details/${patientId}`);
    }
  }, [dispatch, history, successRecord, successPatientRecord, patientId, userInfo]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const files = new FormData();
    files.append('file', file);
    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userInfo.token,
        },
      };

      const { data } = await axios.post(BASE_URL + '/api/upload', files, config);

      setFile(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log('Add a record!');
    if (userInfo && userInfo.userType === 'patient') {
      dispatch(
        createRecord({
          name,
          doctor,
          file,
          category,
          description,
        })
      );
    } else if (userInfo && patientId) {
      dispatch(createPatientRecord(patientId, { name, doctor, file, category, description }));
    }
  };

  return (
    <Container>
      <Link
        to={
          userInfo && userInfo.userType === 'patient'
            ? `/profile`
            : `/patients/details/${patientId}`
        }
        className='btn btn-light my-3'
      >
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Record</h1>
        {(loadingRecord || loadingPatientRecord) && <Loader />}
        {(errorRecord || errorPatientRecord) && (
          <Message variant='danger'>{errorRecord || errorPatientRecord}</Message>
        )}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              {/* <Form.Label>Name</Form.Label> */}
              <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='price'>
              {/* <Form.Label>Doctor Name</Form.Label> */}
              <Form.Control
                type='text'
                placeholder='Doctor Name'
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='image'>
              <Form.Label>Upload File</Form.Label>
              <Row>
                <Col className='p-0'>
                  <Form.Control
                    type='text'
                    placeholder='Enter Image URL'
                    value={file}
                    onChange={(e) => setFile(e.target.value)}
                    disabled
                  ></Form.Control>
                </Col>
                <Col className='d-flex align-items-center'>
                  <Form.File id='image-file' onChange={uploadFileHandler}></Form.File>
                </Col>
              </Row>

              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                placeholder='Enter Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option key='discharge' value='Discharge Report'>
                  Discharge Report
                </option>
                <option key='outdoor' value='Outdoor Report'>
                  Outdoor Report
                </option>
                <option key='prescription' value='Prescription'>
                  Prescription
                </option>
                <option key='diagnostic' value='Diagnostic Report'>
                  Diagnostic Report
                </option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='description'>
              {/* <Form.Label>Description</Form.Label> */}
              <Form.Control
                type='text'
                placeholder='Enter Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Add Record
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default AddRecordScreen;
