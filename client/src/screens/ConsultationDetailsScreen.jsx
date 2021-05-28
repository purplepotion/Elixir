import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Card, Button, Spinner } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { getConsultationDetails, approveConsultation } from '../actions/doctor.actions';
import {
  CONSULTATION_APPROVAL_RESET,
  CONSULTATION_DETAILS_RESET,
} from '../constants/doctor.constants';

const ConsultationDetailsScreen = ({ history, match }) => {
  const consultationId = match.params.id;
  // const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const consultationDetails = useSelector((state) => state.consultationDetails);
  const {
    loading: loadingConsultation,
    error: errorConsultation,
    consultation,
  } = consultationDetails;

  const consultationApproval = useSelector((state) => state.consultationApproval);
  const { loading: loadingApproval, success: successApproval } = consultationApproval;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
    if (consultationId) {
      dispatch({ type: CONSULTATION_DETAILS_RESET });
      dispatch(getConsultationDetails(consultationId));
    }
  }, [dispatch, history, userInfo, consultationId]);

  useEffect(() => {
    if (successApproval) {
      dispatch({ type: CONSULTATION_APPROVAL_RESET });
      history.push(`/profile/doctor`);
    }
  }, [history, successApproval, dispatch]);

  const approvalHandler = (req_id, patientId, isApproved) => {
    dispatch(approveConsultation(req_id, patientId, isApproved));
  };

  return (
    <>
      <Link to={`/profile/doctor`} className='btn btn-light my-3'>
        Go Back
      </Link>
      <Row className='justify-content-md-center'>
        <Col md={8}>
          <h2>Record Details</h2>
          {/* {message && <Message variant='danger'>{message}</Message>} */}
          {errorConsultation && <Message variant='danger'>{errorConsultation}</Message>}
          {/* {success && <Message variant='success'>Profile Updated!</Message>} */}
          {loadingConsultation && <Loader />}
          {consultation && (
            <Card style={{ padding: '1rem' }}>
              <Table striped borderless responsive>
                <tbody>
                  <tr key='id'>
                    <td>
                      <strong>ID</strong>
                    </td>
                    <td>{consultation._id.$oid}</td>
                  </tr>
                  <tr key='patient'>
                    <td>
                      <strong>Patient Name</strong>
                    </td>
                    <td>{consultation.patientName}</td>
                  </tr>
                  <tr key='patient-id'>
                    <td>
                      <strong>Patient ID</strong>
                    </td>
                    <td>{consultation.patient.$oid}</td>
                  </tr>
                  <tr key='age'>
                    <td>
                      <strong>Age</strong>
                    </td>
                    <td>{consultation.consultationData.age}</td>
                  </tr>
                  <tr key='gender'>
                    <td>
                      <strong>Gender</strong>
                    </td>
                    <td>{consultation.consultationData.sex}</td>
                  </tr>
                  <tr key='symptoms'>
                    <td>
                      <strong>Symptoms</strong>
                    </td>
                    <td>{consultation.consultationData.symptoms.join(', ')}</td>
                  </tr>
                  <tr key='desc'>
                    <td>
                      <strong>Description</strong>
                    </td>
                    <td>{consultation.consultationData.description}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          )}
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        {loadingApproval ? (
          <Spinner animation='border' />
        ) : (
          <>
            <Button
              variant='success'
              type='submit'
              className='m-3'
              onClick={() =>
                approvalHandler(consultation._id.$oid, consultation.patient.$oid, true)
              }
            >
              Approve
            </Button>
            <Button
              variant='danger'
              type='submit'
              className='m-3'
              onClick={() =>
                approvalHandler(consultation._id.$oid, consultation.patient.$oid, false)
              }
            >
              Decline
            </Button>
          </>
        )}
      </Row>
    </>
  );
};

export default ConsultationDetailsScreen;
