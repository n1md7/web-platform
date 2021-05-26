import {
  Alert as ChakraAlert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Checkbox,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import React, {FormEvent, useEffect, useState} from "react";
import {MdClose} from 'react-icons/md';
import {useHistory} from "react-router";
import {Link} from "react-router-dom";
import Alert from "../components/Alert";
import useAuthenticate from "../hooks/useAuthenticate";
import useInputChange from "../hooks/useChange";
import {JoyError} from "../types";

export default function Authentication() {
  const [email, setEmail] = useInputChange('');
  const [password, setPassword] = useInputChange('');
  const [rememberMe, setRememberMe] = useState(false);
  const [authHandler, isOk, authError, responseModified, resetError] = useAuthenticate();
  const [error, setError] = useState<JoyError | null>(null);
  const history = useHistory();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authHandler({email, password, rememberMe});
  };

  const rememberMeHandler = (event: FormEvent<HTMLInputElement>) => {
    setRememberMe(event.currentTarget.checked);
  }

  useEffect(() => {
    setError(null);
    if (isOk) {
      Alert('You have logged in successfully!');
      history.push('/');
    }
    if (authError) {
      setError(authError);
      resetError();
    }
  }, [responseModified]);

  return (
    <>
      {
        error && (
          <ChakraAlert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="left"
            height="auto"
          >
            <AlertIcon boxSize="40px" mr={0}/>
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {error.message}
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              <List spacing={3}>
                {
                  error?.details?.map(({message}, key) => (
                    <ListItem key={key}>
                      <ListIcon as={MdClose} color="red.500"/>
                      {message}
                    </ListItem>
                  ))
                }
              </List>
            </AlertDescription>
          </ChakraAlert>
        )
      }
      <div className="container">
        <div className="row mt-5 justify-content-center">
          <div className="col-md-5">
            <h3 className="my-3 text-center">User Authentication</h3>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input minLength={5} onChange={setEmail} className="form-control"
                       placeholder="E-mail"/>
                <small className="form-text text-muted">Enter your email address</small>
              </div>
              <div className="form-group">
                <input minLength={8} onChange={setPassword} type="password"
                       className="form-control" placeholder="Password"/>
                <small className="form-text text-muted">Enter your password</small>
              </div>
              <div className="form-group">
                <Checkbox size="md" colorScheme="blue" onChange={rememberMeHandler}>
                  Remember me
                </Checkbox>
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
    </>
  );
}
