import useInputChange from "../hooks/useChange";
import React, {FormEvent, useEffect, useState} from "react";
import useAuthenticate from "../hooks/useAuthenticate";
import {useHistory} from "react-router";
import Alert, {AlertType} from "../components/Alert";
import {Link} from "react-router-dom";
import logo from "../img/logo.png";

export default function Authentication() {
  const [username, setUsername] = useInputChange('');
  const [password, setPassword] = useInputChange('');
  const [rememberMe, setRememberMe] = useState(false);
  const [authHandler, isOk, authError, responseModified] = useAuthenticate();
  const history = useHistory();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authHandler({username, password, rememberMe});
  };

  const rememberMeHandler = (event: FormEvent<HTMLInputElement>) => {
    setRememberMe(event.currentTarget.checked);
  }

  useEffect(() => {
    if (isOk) {
      Alert('You have logged in successfully!');
      history.push('/');
    }
    authError && Alert(authError, AlertType.ERROR);
  }, [responseModified]);

  return (
    <div className="container">
      <div className="row mt-5 justify-content-center">
        <div className="col-md-5 text-center">
          <img className="App-logo" src={logo} alt="logo.png"/>
        </div>
        <div className="col-12">{/**/}</div>
        <div className="col-md-5">
          <h3 className="my-3 text-center">User Authentication</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input minLength={5} onChange={setUsername} className="form-control"
                     placeholder="Username"/>
              <small className="form-text text-muted">Enter your username</small>
            </div>
            <div className="form-group">
              <input minLength={8} onChange={setPassword} type="password"
                     className="form-control" placeholder="Password"/>
              <small className="form-text text-muted">Enter your password</small>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input className="form-check-input" onChange={rememberMeHandler} type="checkbox"
                       id="remember-me"/>
                <label className="form-check-label text-muted" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary form-control">Authenticate</button>
            </div>
            <div className="form-group text-center">
              <Link className="create-account" to={{
                pathname: "/sign-up"
              }}>No account? Create one.</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
