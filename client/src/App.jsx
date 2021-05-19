import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddRecordScreen from './screens/AddRecordScreen';
import AddPatientScreen from './screens/AddPatientScreen';
import PatientDetailsScreen from './screens/PatientDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import DoctorScreen from './screens/DoctorScreen';
import RecordDetailsScreen from './screens/RecordDetailsScreen';
import RecordScreen from './screens/RecordScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/login' exact component={LoginScreen} />
          <Route path='/register' exact component={RegisterScreen} />
          <Route path='/profile' exact component={ProfileScreen} />
          <Route path='/profile/doctor' exact component={DoctorScreen} />
          <Route path='/records/add' exact component={AddRecordScreen} />
          <Route path='/records/details/:id' exact component={RecordScreen} />
          <Route path='/patients/add' exact component={AddPatientScreen} />
          <Route path='/patients/details/:id' exact component={PatientDetailsScreen} />
          <Route path='/patients/details/:pid/records/add' exact component={AddRecordScreen} />
          <Route
            path='/patients/details/:pid/records/details/:id'
            exact
            component={RecordDetailsScreen}
          />
          <Route path='/' exact component={HomeScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
