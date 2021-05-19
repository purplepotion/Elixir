import axios from 'axios';
import BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table, Button, Card } from 'react-bootstrap';

import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import ViewFile from '../components/ViewFile';

import { getRecordDetails, addAttachment } from '../actions/record.actions';

const RecordDetailsScreen = ({ history, match }) => {
  const patientId = match.params.pid;
  const recordId = match.params.id;
  // const [message, setMessage] = useState(null);
  const [newAttachment, setNewAttachment] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const recordDetails = useSelector((state) => state.recordDetails);
  const { loading: loadingRecord, error: errorRecord, record } = recordDetails;

  const attachmentAdd = useSelector((state) => state.attachmentAdd);
  const {
    loading: loadingAttachment,
    error: errorAttachment,
    success: successAttachment,
  } = attachmentAdd;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(getRecordDetails(patientId, recordId));
    }
  }, [dispatch, history, userInfo, patientId, recordId, successAttachment]);

  useEffect(() => {
    if (record && !record.isApproved) {
      history.push(`/patients/details/${patientId}`);
    }
  }, [history, record, patientId]);

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
      dispatch(addAttachment(record.id, newAttachment, patientId));
    }
    setNewAttachment('');
  };

  return (
    <>
      <Link to={`/patients/details/${patientId}`} className='btn btn-light my-3'>
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
                <tr key='id'>
                  <td>
                    <strong>ID</strong>
                  </td>
                  <td>{record.id}</td>
                </tr>
                <tr key='name'>
                  <td>
                    <strong>Name</strong>
                  </td>
                  <td>{record.name}</td>
                </tr>
                <tr key='doctor'>
                  <td>
                    <strong>Doctor</strong>
                  </td>
                  <td>{record.doctor}</td>
                </tr>
                <tr key='category'>
                  <td>
                    <strong>Category</strong>
                  </td>
                  <td>{record.category}</td>
                </tr>
                <tr key='desc'>
                  <td>
                    <strong>Description</strong>
                  </td>
                  <td>{record.description}</td>
                </tr>
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
          record.attachments.map((attachment) => {
            const fileName = BASE_URL + `/api/files/${attachment}`;
            const fileType = attachment.split('.')[2];
            return <ViewFile file={fileName} fileType={fileType} id={attachment} />;
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

export default RecordDetailsScreen;
