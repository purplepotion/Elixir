import axios from 'axios';
import BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table, Card, Button } from 'react-bootstrap';

import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import ViewFile from '../components/ViewFile';

import { getMyRecordDetails, addAttachment } from '../actions/record.actions';
import { removeAccess } from '../actions/user.actions';

const RecordScreen = ({ history, match }) => {
  const recordId = match.params.id;
  // const [message, setMessage] = useState(null);
  // const [file, setFile] = useState('');
  const [newAttachment, setNewAttachment] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const myRecordDetails = useSelector((state) => state.myRecordDetails);
  const { loading: loadingRecord, error: errorRecord, record } = myRecordDetails;

  const attachmentAdd = useSelector((state) => state.attachmentAdd);
  const {
    loading: loadingAttachment,
    error: errorAttachment,
    success: successAttachment,
  } = attachmentAdd;

  const userRemoveAccess = useSelector((state) => state.userRemoveAccess);
  const {
    loading: loadingRemoveAccess,
    error: errorRemoveAccess,
    success: successRemoveAccess,
  } = userRemoveAccess;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(getMyRecordDetails(recordId));
    }
  }, [dispatch, history, userInfo, recordId, successRemoveAccess, successAttachment]);

  // useEffect(() => {}, [file]);

  const removeAccessHandler = (recordId, healthOfficialId) => {
    if (record) {
      dispatch(removeAccess(recordId, healthOfficialId));
    }
  };

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

      setNewAttachment(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const addAttachmentHandler = () => {
    if (newAttachment) {
      dispatch(addAttachment(record.id, newAttachment));
    }
    setNewAttachment('');
  };

  return (
    <>
      <Link to='/profile/doctor' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Row>
        <Col>
          <h2>Record Details</h2>
          {/* {message && <Message variant='danger'>{message}</Message>} */}
          {errorRecord && <Message variant='danger'>{errorRecord}</Message>}
          {/* {success && <Message variant='success'>Profile Updated!</Message>} */}
          {loadingRecord && <Loader />}
          <Card style={{ padding: '1rem' }}>
            <Table striped borderless responsive>
              <tbody>
                <tr>
                  <td>
                    <strong>ID</strong>
                  </td>
                  <td>{record.id}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Name</strong>
                  </td>
                  <td>{record.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Doctor</strong>
                  </td>
                  <td>{record.doctor}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Category</strong>
                  </td>
                  <td>{record.category}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Description</strong>
                  </td>
                  <td>{record.description}</td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        {/* <Col md={8} style={{ height: '80vh' }}> */}
      </Row>
      <Row className='mt-4'>
        <Col>
          <h2>Record Access Details</h2>
          {/* {message && <Message variant='danger'>{message}</Message>} */}
          {errorRemoveAccess && <Message variant='danger'>{errorRemoveAccess}</Message>}
          {/* {success && <Message variant='success'>Profile Updated!</Message>} */}
          {loadingRemoveAccess && <Loader />}
          <Card style={{ padding: '1rem' }}>
            <Table striped borderless responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {record &&
                  record.healthOfficials &&
                  record.healthOfficials.map((healthOfficial) => (
                    <tr key={healthOfficial.id}>
                      <td>{healthOfficial.id}</td>
                      <td>{healthOfficial.name}</td>
                      <td>{healthOfficial.email}</td>
                      <td>
                        <Button
                          variant='danger'
                          className='btn-sm'
                          onClick={() => removeAccessHandler(record.id, healthOfficial.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
      <div className='files mt-4'>
        <h2>Record Attachments</h2>
        {/* {!file && <Loader />} */}
        {record &&
          record.attachments &&
          record.attachments.map((attachment, index) => {
            const fileName = BASE_URL + `/api/files/${attachment}`;
            const fileType = attachment.split('.')[2];
            return <ViewFile key={index} file={fileName} fileType={fileType} id={attachment} />;
          })}
      </div>

      <Row style={{ marginTop: '4rem' }}>
        <FormContainer>
          <h3>Add Attachment</h3>
          <Form onSubmit={addAttachmentHandler}>
            <Form.Group controlId='image'>
              <Row>
                <Col className='p-0'>
                  <Form.Control
                    type='text'
                    placeholder='Enter Image URL'
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    disabled
                  ></Form.Control>
                </Col>
                <Col className='d-flex align-items-center'>
                  <Form.File id='image-file' onChange={uploadFileHandler}></Form.File>
                </Col>
              </Row>

              {uploading && <Loader />}
            </Form.Group>

            <Button type='submit'>Add Attachment</Button>
          </Form>
        </FormContainer>
      </Row>
    </>
  );
};

export default RecordScreen;
