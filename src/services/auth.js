import axios from 'axios';
import config from './config';

const login = (email, password) =>
  axios.post(config.LOGIN_URL, {
    email,
    password,
  });

const googleSignin = token =>
  axios.post(config.GOOGLE_LOGIN_URL, {
    token,
  });

const signup = (loginEmail, firstName, lastName, loginPassword) =>
  axios.post(config.SIGNUP_URL, {
    loginEmail,
    firstName,
    lastName,
    loginPassword,
  });

export default {
  login,
  googleSignin,
  signup,
};
