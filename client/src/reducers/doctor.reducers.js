import {
  CONSULTATIONS_FAIL,
  CONSULTATIONS_REQUEST,
  CONSULTATIONS_SUCCESS,
  CONSULTATION_APPROVAL_FAIL,
  CONSULTATION_APPROVAL_REQUEST,
  CONSULTATION_APPROVAL_RESET,
  CONSULTATION_APPROVAL_SUCCESS,
  CONSULTATION_DETAILS_FAIL,
  CONSULTATION_DETAILS_REQUEST,
  CONSULTATION_DETAILS_RESET,
  CONSULTATION_DETAILS_SUCCESS,
  PATIENT_ADD_FAIL,
  PATIENT_ADD_REQUEST,
  PATIENT_ADD_RESET,
  PATIENT_ADD_SUCCESS,
  PATIENT_CONSENT_FAIL,
  PATIENT_CONSENT_REQUEST,
  PATIENT_CONSENT_RESET,
  PATIENT_CONSENT_SUCCESS,
  PATIENT_CREATE_RECORD_FAIL,
  PATIENT_CREATE_RECORD_REQUEST,
  PATIENT_CREATE_RECORD_RESET,
  PATIENT_CREATE_RECORD_SUCCESS,
  PATIENT_DETAILS_FAIL,
  PATIENT_DETAILS_REQUEST,
  PATIENT_DETAILS_SUCCESS,
  PATIENT_LIST_FAIL,
  PATIENT_LIST_REQUEST,
  PATIENT_LIST_SUCCESS,
} from '../constants/doctor.constants';

export const patientAddReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENT_ADD_REQUEST:
      return { loading: true };
    case PATIENT_ADD_SUCCESS:
      return { loading: false, success: true };
    case PATIENT_ADD_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PATIENT_ADD_RESET:
      return { record: {} };
    default:
      return state;
  }
};

export const patientCreateRecordReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENT_CREATE_RECORD_REQUEST:
      return { loading: true };
    case PATIENT_CREATE_RECORD_SUCCESS:
      return { loading: false, success: true };
    case PATIENT_CREATE_RECORD_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PATIENT_CREATE_RECORD_RESET:
      return { record: {} };
    default:
      return state;
  }
};

export const patientListReducer = (state = { patients: [] }, action) => {
  switch (action.type) {
    case PATIENT_LIST_REQUEST:
      return { loading: true, patients: [] };
    case PATIENT_LIST_SUCCESS:
      return {
        loading: false,
        patients: action.payload,
      };
    case PATIENT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const patientDetailsReducer = (state = { patient: { records: [] } }, action) => {
  switch (action.type) {
    case PATIENT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case PATIENT_DETAILS_SUCCESS:
      return { loading: false, patient: action.payload };
    case PATIENT_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const patientConsentReducer = (state = { patient: {} }, action) => {
  switch (action.type) {
    case PATIENT_CONSENT_REQUEST:
      return { loading: true };
    case PATIENT_CONSENT_SUCCESS:
      return { loading: false, success: true };
    case PATIENT_CONSENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PATIENT_CONSENT_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorConsultationsReducer = (
  state = { consultations: [], loading: false },
  action
) => {
  switch (action.type) {
    case CONSULTATIONS_REQUEST:
      return { ...state, loading: true };
    case CONSULTATIONS_SUCCESS:
      return { ...state, loading: false, consultations: action.payload };
    case CONSULTATIONS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const consultationDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case CONSULTATION_DETAILS_REQUEST:
      return { ...state, loading: true };
    case CONSULTATION_DETAILS_SUCCESS:
      return { ...state, loading: false, consultation: action.payload };
    case CONSULTATION_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CONSULTATION_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const consultationApprovalReducer = (state = {}, action) => {
  switch (action.type) {
    case CONSULTATION_APPROVAL_REQUEST:
      return { loading: true };
    case CONSULTATION_APPROVAL_SUCCESS:
      return { loading: false, success: true };
    case CONSULTATION_APPROVAL_FAIL:
      return { loading: false, error: action.payload };
    case CONSULTATION_APPROVAL_RESET:
      return { loading: false, success: false };
    default:
      return state;
  }
};
