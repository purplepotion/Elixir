import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { register } from '../actions/user.actions';
import { USER_LOGIN_RESET, USER_REGISTER_RESET } from '../constants/user.constants';

const RegisterScreen = ({ history, location }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { loading: loadingRegister, error: errorRegister } = userRegister;

  const redirect = '/profile';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    } else {
      dispatch({ type: USER_REGISTER_RESET });
    }
  }, [history, dispatch, userInfo, redirect]);

  const submitHandler = (event) => {
    event.preventDefault();

    console.log('SIGNUP');

    if (name && email && password && confirmPassword && userType) {
      if (password !== confirmPassword) {
        setMessage('Passwords do not match!');
      } else {
        dispatch(register(name, email, password, userType));
      }
    } else {
      setMessage('Please fill all the details!');
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {errorRegister && <Message variant='danger'>{errorRegister}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          {/* <Form.Label>Name</Form.Label> */}
          <Form.Control
            type='name'
            placeholder='Enter Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email' required>
          {/* <Form.Label>Email Address</Form.Label> */}
          <Form.Control
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          {/* <Form.Label>Confirm Password</Form.Label> */}
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group
          controlId='userType'
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <div className='userType__input'>
            <Form.Label>User Type:</Form.Label>
            <Form.Check
              type='radio'
              label='Patient'
              name='userTypeRadios'
              id='patientRadio'
              value='patient'
            />
            <Form.Check
              type='radio'
              label='Health Official'
              name='userTypeRadios'
              id='healthOfficialRadio'
              value='healthOfficial'
              className='ml-2'
            />
          </div>
        </Form.Group>

        <Button type='submit' variant='primary'>
          {loadingRegister ? <Spinner animation='border' size='sm' /> : 'Register'}
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
