import {
  USER_CONSENT_FAIL,
  USER_CONSENT_REQUEST,
  USER_CONSENT_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESET,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_NOTIFICATIONS_FAIL,
  USER_NOTIFICATIONS_REQUEST,
  USER_NOTIFICATIONS_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_RESET,
  USER_REGISTER_SUCCESS,
  USER_REMOVE_ACCESS_FAIL,
  USER_REMOVE_ACCESS_REQUEST,
  USER_REMOVE_ACCESS_SUCCESS,
} from '../constants/user.constants';

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT || USER_LOGIN_RESET:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case USER_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case USER_DETAILS_RESET:
      return { user: {} };
    default:
      return state;
  }
};

export const userNotificationsReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case USER_NOTIFICATIONS_REQUEST:
      return { loading: true, notifications: [] };
    case USER_NOTIFICATIONS_SUCCESS:
      return { loading: false, notifications: [...action.payload] };
    case USER_NOTIFICATIONS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userConsentReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CONSENT_REQUEST:
      return { ...state, loading: true };
    case USER_CONSENT_SUCCESS:
      return { loading: false, success: true };
    case USER_CONSENT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userRemoveAccessReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REMOVE_ACCESS_REQUEST:
      return { ...state, loading: true };
    case USER_REMOVE_ACCESS_SUCCESS:
      return { loading: false, success: true };
    case USER_REMOVE_ACCESS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
