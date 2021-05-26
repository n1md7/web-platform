import {AxiosResponse} from 'axios';
import {useState} from "react";
import {httpClient} from '../services/HttpClient';
import {JoyError, UserRole} from "../types";

type Register = {
    role: UserRole | string;
    password: string;
    email: string;
    confirmPassword: string;
};
export default function useRegister(): [(payload: Register) => void, boolean, JoyError | null, number, Function] {
    const [isOk, setIsOk] = useState<boolean>(false);
    const [error, setError] = useState<null | JoyError>(null);
    const [counter, setCounter] = useState<number>(0);

    const resetError = () => setError(null);

    const registrationHandler = (payload: Register) => {
        httpClient
          .post<AxiosResponse, AxiosResponse<string | JoyError>>('v1/user/new', payload)
          .then((response) => {
              if (response.status === 201) {
                  setIsOk(true);
              } else {
                  setError(response.data as JoyError);
              }
          })
          .catch(({message}) => {
              setIsOk(false);
              setError(message);
          })
          .finally(() => {
              setCounter(counter + 1);
          });
    }

    return [registrationHandler, isOk, error, counter, resetError];
};