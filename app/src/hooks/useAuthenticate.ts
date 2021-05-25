import {AxiosResponse} from 'axios';
import {useState} from "react";
import {httpClient} from '../services/HttpClient';
import store, {actionUpdate} from "../services/TokenStore";
import {JoyError, Token} from '../types';

type Auth = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type AuthResponseType = {
  refreshToken: string,
  jwt: string
}
export default function useAuthenticate(): [(payload: Auth) => void, boolean, JoyError | null, number, Function] {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [error, setError] = useState<JoyError | null>(null);
  const [counter, setCounter] = useState<number>(0);

  const resetError = () => setError(null);

  const authenticationHandler = (payload: Auth) => {
    httpClient
      .post<AxiosResponse, AxiosResponse<JoyError | AuthResponseType>>('v1/user/auth', payload)
      .then((response) => {
        if (response.status === 200) {
          setIsAuth(true);
          response.data = response.data as AuthResponseType;
          // Dispatch to redux-store to update headers of httpClient
          store.dispatch(actionUpdate({token: response.data.jwt}));
          // Save tokens in localStorage
          localStorage.setItem(Token.jwt, response.data.jwt);
          localStorage.setItem(Token.refresh, response.data.refreshToken);
          setError(null);
        } else {
          setError(response.data as JoyError);
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

  return [authenticationHandler, isAuth, error, counter, resetError];
};
