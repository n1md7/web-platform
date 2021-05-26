import {
  Alert as ChakraAlert,
  AlertDescription,
  AlertIcon,
  AlertTitle, Input,
  List,
  ListIcon,
  ListItem, Select,
} from "@chakra-ui/react";
import React, {FormEvent, useEffect, useState} from "react";
import {MdClose} from "react-icons/md";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";
import Alert from "../components/Alert";
import useInputChange from "../hooks/useChange";
import useRegister from "../hooks/useRegister";
import {JoyError, UserRole} from "../types";

export default function Registration() {
  const [role, setRole] = useInputChange<string, HTMLSelectElement>('');
  const [password, setPassword] = useInputChange('');
  const [email, setEmail] = useInputChange('');
  const [confirmPassword, setConfirmPassword] = useInputChange('');
  const [regHandler, isOk, regError, responseModified, resetRegError] = useRegister();
  const [error, setError] = useState<JoyError | null>(null);
  const history = useHistory();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    regHandler({role, password, email, confirmPassword});
  };

  useEffect(() => {
    setError(null);
    if (isOk) {
      Alert('You have signed up successfully!');
      history.push('/sign-in');
    }
    if (regError) {
      setError(regError);
      resetRegError();
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
            <h3 className="my-3 text-center">User Registration</h3>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <Input minLength={5} onChange={setEmail} size="md" placeholder="E-mail"/>
                <small className="form-text text-muted">Enter your E-mail</small>
              </div>
              <div className="form-group">
                <Select placeholder="Select option" color="gray" onChange={setRole}>
                  <option value={UserRole.user}>User</option>
                  <option value={UserRole.supplier}>Supplier</option>
                </Select>
                <small className="form-text text-muted">Select your role</small>
              </div>
              <div className="form-group">
                <Input type="password" minLength={8} onChange={setPassword} size="md" placeholder="Password"/>
                <small className="form-text text-muted">Enter your password</small>
              </div>
              <div className="form-group">
                <Input type="password" minLength={8} onChange={setConfirmPassword} size="md" placeholder="Confirm-password"/>
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
    </>
  );
}
