import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';

function SigninScreen(props) {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  
  const userSigninState = useSelector(state => state.userSignin);
  const { loading: isLoading, userInfo, error: signinError } = userSigninState;

  const dispatch = useDispatch();
  const redirectPath = props.location.search ? props.location.search.split("=")[1] : '/';

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirectPath);
    }
  }, [userInfo, props.history, redirectPath]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(userEmail, userPassword));
  }

  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <h2>Sign-In</h2>
          </li>
          <li>
            {isLoading && <div>Loading...</div>}
            {signinError && <div>{signinError}</div>}
          </li>
          <li>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </li>
          <li>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </li>
          <li>
            <button type="submit" className="button primary">Signin</button>
          </li>
          <li>New to Amazona?</li>
          <li>
            <Link to={redirectPath === "/" ? "register" : "register?redirect=" + redirectPath} className="button secondary text-center">
              Create your Amazona account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default SigninScreen;
