import axios from 'axios';
import BASE_URL from '../config';
import {
  PATIENT_ADD_FAIL,
  PATIENT_ADD_REQUEST,
  PATIENT_ADD_SUCCESS,
  PATIENT_CONSENT_FAIL,
  PATIENT_CONSENT_REQUEST,
  PATIENT_CONSENT_SUCCESS,
  PATIENT_CREATE_RECORD_FAIL,
  PATIENT_CREATE_RECORD_REQUEST,
  PATIENT_CREATE_RECORD_SUCCESS,
  PATIENT_DETAILS_FAIL,
  PATIENT_DETAILS_REQUEST,
  PATIENT_DETAILS_SUCCESS,
  PATIENT_LIST_FAIL,
  PATIENT_LIST_REQUEST,
  PATIENT_LIST_SUCCESS,
} from '../constants/doctor.constants';

export const listPatients = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(BASE_URL + `/api/healthOfficial/patients`, config);

    dispatch({
      type: PATIENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PATIENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const getPatientDetails = (patientId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(
      BASE_URL + `/api/healthOfficial/patients/${patientId}`,
      config
    );

    dispatch({ type: PATIENT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PATIENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const addPatient = (patientEmail) => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post(
      BASE_URL + `/api/healthOfficial/patients`,
      { email: patientEmail },
      config
    );

    dispatch({ type: PATIENT_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PATIENT_ADD_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const createPatientRecord = (patientId, record) => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_CREATE_RECORD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post(
      BASE_URL + `/api/healthOfficial/patients/${patientId}/records`,
      record,
      config
    );

    dispatch({ type: PATIENT_CREATE_RECORD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PATIENT_CREATE_RECORD_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const createPatientNotification = (patientId, recordId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_CONSENT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post(
      BASE_URL + `/api/notifications`,
      { patientId, recordId },
      config
    );

    dispatch({ type: PATIENT_CONSENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PATIENT_CONSENT_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
