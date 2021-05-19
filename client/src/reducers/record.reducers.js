import {
  RECORD_ADD_ATTACHMENT_FAIL,
  RECORD_ADD_ATTACHMENT_REQUEST,
  RECORD_ADD_ATTACHMENT_SUCCESS,
  RECORD_ADD_ATTACHMENT_RESET,
  RECORD_CREATE_FAIL,
  RECORD_CREATE_REQUEST,
  RECORD_CREATE_RESET,
  RECORD_CREATE_SUCCESS,
  RECORD_DETAILS_FAIL,
  RECORD_DETAILS_REQUEST,
  RECORD_DETAILS_RESET,
  RECORD_DETAILS_SUCCESS,
  RECORD_LIST_FAIL,
  RECORD_LIST_REQUEST,
  RECORD_LIST_SUCCESS,
  RECORD_MY_DETAILS_FAIL,
  RECORD_MY_DETAILS_REQUEST,
  RECORD_MY_DETAILS_RESET,
  RECORD_MY_DETAILS_SUCCESS,
} from '../constants/record.constants';

export const recordListReducer = (state = { records: [] }, action) => {
  switch (action.type) {
    case RECORD_LIST_REQUEST:
      return { loading: true, records: [] };
    case RECORD_LIST_SUCCESS:
      return {
        loading: false,
        records: action.payload,
      };
    case RECORD_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const recordCreateReducer = (state = { record: {} }, action) => {
  switch (action.type) {
    case RECORD_CREATE_REQUEST:
      return { loading: true };
    case RECORD_CREATE_SUCCESS:
      return { loading: false, success: true, record: action.payload };
    case RECORD_CREATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RECORD_CREATE_RESET:
      return { record: {} };
    default:
      return state;
  }
};

export const recordDetailsReducer = (state = { record: {} }, action) => {
  switch (action.type) {
    case RECORD_DETAILS_REQUEST:
      return { ...state, loading: true };
    case RECORD_DETAILS_SUCCESS:
      return { loading: false, success: true, record: action.payload };
    case RECORD_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RECORD_DETAILS_RESET:
      return { record: {} };
    default:
      return state;
  }
};

export const myRecordDetailsReducer = (state = { record: {} }, action) => {
  switch (action.type) {
    case RECORD_MY_DETAILS_REQUEST:
      return { ...state, loading: true };
    case RECORD_MY_DETAILS_SUCCESS:
      return { loading: false, success: true, record: action.payload };
    case RECORD_MY_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RECORD_MY_DETAILS_RESET:
      return { record: {} };
    default:
      return state;
  }
};

export const attachmentAddReducer = (state = {}, action) => {
  switch (action.type) {
    case RECORD_ADD_ATTACHMENT_REQUEST:
      return { ...state, loading: true };
    case RECORD_ADD_ATTACHMENT_SUCCESS:
      return { loading: false, success: true };
    case RECORD_ADD_ATTACHMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RECORD_ADD_ATTACHMENT_RESET:
      return {};
    default:
      return state;
  }
};
