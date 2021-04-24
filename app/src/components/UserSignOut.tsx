import React, {useEffect} from "react";
import {useHistory} from "react-router";
import {Token} from "../types";

export default function UserSignOut() {
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem(Token.jwt);
    localStorage.removeItem(Token.refresh);
    // TODO: send request to backend to disable token immediately
    history.push('/sign-in');
  }, []);

  return (
    <div>Logging out...</div>
  );
};
