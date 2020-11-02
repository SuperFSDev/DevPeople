import axios from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS } from '../actions/types';
import { setAlert } from './alert';

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ name, email, password });
    const res = await axios.post('api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log('res' + err);
    const errors = err.response.data.errors;
    console.log('res' + err);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    console.log('IN catch' + err);
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
