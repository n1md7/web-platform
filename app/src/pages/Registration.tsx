import useInputChange from "../hooks/useChange";
import React, {FormEvent, useEffect} from "react";
import {useHistory} from "react-router";
import Alert, {AlertType} from "../components/Alert";
import {Link} from "react-router-dom";
import useRegister from "../hooks/useRegister";
import logo from "../img/logo.png";

export default function Registration() {
  const [username, setUsername] = useInputChange('');
  const [password, setPassword] = useInputChange('');
  const [email, setEmail] = useInputChange('');
  const [confirmPassword, setConfirmPassword] = useInputChange('');
  const [regHandler, isOk, regError, responseModified] = useRegister();
  const history = useHistory();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    regHandler({username, password, email, confirmPassword});
  };

  useEffect(() => {
    if (isOk) {
      Alert('You have signed up successfully!');
      history.push('/sign-in');
    }
    regError && Alert(regError, AlertType.ERROR);
  }, [responseModified]);

  return (
    <div className="container">
      <div className="row mt-5 justify-content-center">
        <div className="col-md-5 text-center">
          <img className="App-logo" src={logo} alt="logo.png"/>
        </div>
        <div className="col-12">{/**/}</div>
        <div className="col-md-5">
          <h3 className="my-3 text-center">User Registration</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input minLength={5} onChange={setEmail}
                     className="form-control" placeholder="E-mail"/>
              <small className="form-text text-muted">Enter your E-mail</small>
            </div>
            <div className="form-group">
              <input minLength={5} onChange={setUsername}
                     className="form-control" placeholder="Username"/>
              <small className="form-text text-muted">Enter your username</small>
            </div>
            <div className="form-group">
              <input minLength={8} onChange={setPassword} type="password"
                     className="form-control" placeholder="Password"/>
              <small className="form-text text-muted">Enter your password</small>
            </div>
            <div className="form-group">
              <input minLength={8} onChange={setConfirmPassword} type="password"
                     className="form-control" placeholder="Confirm-password"/>
              <small className="form-text text-muted">Confirm your password</small>
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-outline-secondary form-control">Sign up</button>
            </div>
            <div className="form-group text-center">
              <Link className="create-account" to={{
                pathname: "/sign-in"
              }}>Already have an account? Sign in.</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
