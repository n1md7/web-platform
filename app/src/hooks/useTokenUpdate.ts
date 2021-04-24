import {useEffect, useState} from "react";
import store, {actionUpdate} from "../services/TokenStore";
import {httpClient} from '../services/HttpClient';
import {AxiosResponse} from 'axios';
import {useHistory} from 'react-router';
import {Token} from '../types';
import {AuthResponseType} from "./useAuthenticate";

export default function useTokenUpdate(): [boolean, boolean, string] {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tokenExpireInSec, setTokenExpiration] = useState<number>(-1);
  const history = useHistory();

  const updateToken = (): void => {
    httpClient
      .get<AxiosResponse, AxiosResponse<string>>('v1/user/token/refresh')
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Couldn\'t restore the session');
        }
        store.dispatch(actionUpdate({token: response.data}));
        localStorage.setItem(Token.jwt, response.data);
        setIsAuth(true);
        // Currently new session is valid for 20 minutes
        setTokenExpiration(20 * 60);
      });
  };

  const restoreToken = async (key: string): Promise<AuthResponseType> => {
    return httpClient
      .get<AxiosResponse, AxiosResponse<AuthResponseType>>(`v1/user/token/restore/${key}`)
      .then((response) => {
        store.dispatch(actionUpdate({token: response.data.jwt}));
        setIsAuth(true);
        // Save tokens in localStorage
        localStorage.setItem(Token.jwt, response.data.jwt);
        localStorage.setItem(Token.refresh, response.data.refreshToken);
        // Currently new session is valid for 20 minutes
        setTokenExpiration(20 * 60);

        return response.data;
      });
  };

  const checkExpiration = (): void => {
    httpClient
      .get<AxiosResponse>('v1/user/status')
      .then((response) => {
        setIsAuth(Boolean(response.status === 200));
        setTokenExpiration(Number(response.data));
      })
      .catch(({message}) => setError(message));
  };

  useEffect(() => {
    (async () => {
      let token = localStorage.getItem(Token.jwt);
      let refreshToken = localStorage.getItem(Token.refresh);
      // No token = no authenticated
      if (!token) {
        if (refreshToken) {
          try {
            const response = await restoreToken(refreshToken);
            token = response.jwt;
            refreshToken = response.refreshToken;
          } catch (e) {
            console.info(e.message);
            return history.push('/sign-in');
          }
        } else {
          return history.push('/sign-in');
        }
      }
      // Update httpClient header with Token
      store.dispatch(actionUpdate({token}));
      // Send request and check whether or not the token is still valid
      httpClient
        .get<AxiosResponse, AxiosResponse<string>>('v1/user/status')
        .then((response) => {
          if (response.status !== 200) {
            // Not valid
            throw new Error(response.data);
          }
          setIsAuth(true);
          setTokenExpiration(Number(response.data));
        })
        .catch(async ({message}) => {
          if (refreshToken) {
            try {
              return await restoreToken(refreshToken);
            } catch (e) {
              console.info(e.message);
              return history.push('/sign-in');
            }
          } else {
            setError(message)
          }
        })
        .finally(() => setLoading(false));
    })();

  }, []);

  useEffect(() => {
    // Check expiration every minute
    const timer = setInterval(checkExpiration, 60 * 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Expires in less then 2 minutes
    // Sending request to get new token
    if (tokenExpireInSec <= 120 && tokenExpireInSec >= 0) {
      updateToken();
    }
  }, [tokenExpireInSec]);

  return [isAuth, loading, error];
};
