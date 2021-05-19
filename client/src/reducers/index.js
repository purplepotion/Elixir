import { combineReducers } from 'redux';
import {
  patientAddReducer,
  patientConsentReducer,
  patientCreateRecordReducer,
  patientDetailsReducer,
  patientListReducer,
} from './doctor.reducers';
import {
  attachmentAddReducer,
  myRecordDetailsReducer,
  recordCreateReducer,
  recordDetailsReducer,
  recordListReducer,
} from './record.reducers';

import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userNotificationsReducer,
  userConsentReducer,
  userRemoveAccessReducer,
} from './user.reducers';

export default combineReducers({
  patientAdd: patientAddReducer,
  patientList: patientListReducer,
  patientDetails: patientDetailsReducer,
  patientCreateRecord: patientCreateRecordReducer,
  patientConsent: patientConsentReducer,
  recordList: recordListReducer,
  recordCreate: recordCreateReducer,
  recordDetails: recordDetailsReducer,
  myRecordDetails: myRecordDetailsReducer,
  attachmentAdd: attachmentAddReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userNotifications: userNotificationsReducer,
  userConsent: userConsentReducer,
  userRemoveAccess: userRemoveAccessReducer,
});
