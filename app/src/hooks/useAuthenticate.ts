import {useState} from "react";
import store, {actionUpdate} from "../services/TokenStore";
import {httpClient} from '../services/HttpClient';
import {AxiosResponse} from 'axios';
import {Token} from '../types';

type Auth = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type AuthResponseType = {
  refreshToken: string,
  jwt: string
}
export default function useAuthenticate(): [(payload: Auth) => void, boolean, string, number] {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);

  const authenticationHandler = (payload: Auth) => {
    httpClient
      .post<AxiosResponse, AxiosResponse<string | AuthResponseType>>('v1/user/auth', payload)
      .then((response) => {
        if (response.status === 200) {
          setIsAuth(true);
          response.data = response.data as AuthResponseType;
          // Dispatch to redux-store to update headers of httpClient
          store.dispatch(actionUpdate({token: response.data.jwt}));
          // Save tokens in localStorage
          localStorage.setItem(Token.jwt, response.data.jwt);
          localStorage.setItem(Token.refresh, response.data.refreshToken);
          setError("");
        } else if (response.status === 400) {
          setError(response.data as string);
        } else {
          setError("Incorrect username or password");
        }
      })
      .catch(({message}) => {
        setIsAuth(false);
        setError(message);
      })
      .finally(() => {
        setCounter(counter + 1);
      });
  }

  return [authenticationHandler, isAuth, error, counter];
};
