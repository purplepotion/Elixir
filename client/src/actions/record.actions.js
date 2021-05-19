import axios from 'axios';
import BASE_URL from '../config';

import {
  RECORD_ADD_ATTACHMENT_FAIL,
  RECORD_ADD_ATTACHMENT_REQUEST,
  RECORD_ADD_ATTACHMENT_SUCCESS,
  RECORD_CREATE_FAIL,
  RECORD_CREATE_REQUEST,
  RECORD_CREATE_SUCCESS,
  RECORD_DETAILS_FAIL,
  RECORD_DETAILS_REQUEST,
  RECORD_DETAILS_SUCCESS,
  RECORD_LIST_FAIL,
  RECORD_LIST_REQUEST,
  RECORD_LIST_SUCCESS,
  RECORD_MY_DETAILS_FAIL,
  RECORD_MY_DETAILS_REQUEST,
  RECORD_MY_DETAILS_SUCCESS,
} from '../constants/record.constants';

export const listRecords = () => async (dispatch, getState) => {
  try {
    dispatch({ type: RECORD_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(BASE_URL + `/api/users/records`, config);

    dispatch({
      type: RECORD_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECORD_LIST_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const getRecordDetails = (pid, rid) => async (dispatch, getState) => {
  try {
    dispatch({ type: RECORD_DETAILS_REQUEST });

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
      BASE_URL + `/api/healthOfficial/patients/${pid}/records/${rid}`,
      config
    );

    dispatch({ type: RECORD_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RECORD_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const getMyRecordDetails = (recordId) => async (dispatch, getState) => {
  try {
    dispatch({ type: RECORD_MY_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(BASE_URL + `/api/users/records/${recordId}`, config);

    dispatch({ type: RECORD_MY_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RECORD_MY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const createRecord = (record) => async (dispatch, getState) => {
  try {
    dispatch({ type: RECORD_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post(BASE_URL + `/api/users/records`, record, config);

    dispatch({ type: RECORD_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RECORD_CREATE_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const addAttachment = (recordId, attachment, patientId) => async (dispatch, getState) => {
  try {
    dispatch({ type: RECORD_ADD_ATTACHMENT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    if (!patientId) {
      patientId = 0;
    }

    const { data } = await axios.put(
      BASE_URL + `/api/users/records/${recordId}/add`,
      { patientId, attachment },
      config
    );

    dispatch({ type: RECORD_ADD_ATTACHMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RECORD_ADD_ATTACHMENT_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
