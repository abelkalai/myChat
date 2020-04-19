import React, { useState} from "react";
import { Link, Redirect, Route } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useFieldInput } from "../hooks/customHooks";
import Confirmation from "./Confirmation";
import "../../assets/stylesheets/components/front/signup.css"

const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $username: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
    ) {
      User {
        firstName
        lastName
        email
      }
      errorList
    }
  }
`;

const VALIDATE_ACCOUNT = gql`
  mutation validateAccount($username: String!, $validationCode: String!) {
    validateAccount(username: $username, validationCode: $validationCode)
  }
`;

const GET_EMAIL = gql`
  query getEmail($username: String) {
    getEmail(username: $username)
  }
`;

const Signup = (props) => {
  document.title = "Signup | MyChat";
  const [addUser] = useMutation(ADD_USER);
  const [validateAccount] = useMutation(VALIDATE_ACCOUNT);
  const [userError, setUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [validateError, setValidateError] = useState(null);
  const [passError, setPassError] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState(null);
  const verifyUser = props.verifyUsername ? props.verifyUsername : "";
  const getEmail = useQuery(GET_EMAIL, { variables: { username: verifyUser } });
  const [page, setPage] = useState("signUpForm");
  const firstNameField = useFieldInput("");
  const lastNameSign = useFieldInput("");
  const emailField = useFieldInput("");
  const usernameField = useFieldInput("");
  const passwordField = useFieldInput("");
  const confirmpasswordField = useFieldInput("");
  const validationCodeField = useFieldInput("");

  const submit = async (event) => {
    event.preventDefault();
    if (passwordField.value !== confirmpasswordField.value) {
      setPassError("Passwords don't match");
      return;
    }
    let firstName = firstNameField.value;
    let lastName = lastNameSign.value;
    let email = emailField.value;
    let username = usernameField.value;
    let password = passwordField.value;

    let result = await addUser({
      variables: {
        firstName,
        lastName,
        email,
        username,
        password,
      },
    });

    if (result.data.addUser.errorList === null) {
      setUserError(null);
      setEmailError(null);
      setPassError(null);
      setPage("signUpValidate");
    } else {
      setUserError(result.data.addUser.errorList[0]);
      setEmailError(result.data.addUser.errorList[1]);
    }
  };

  const signUpForm = () => {
    return (
      <div className="center">
        <h1> Signup for an account!</h1>
        <div className="sign-up">
          <form onSubmit={submit}>
            <div className="sign-up-input">
              <label> First Name: </label>
              <input
                type="text"
                value={firstNameField.value}
                onChange={firstNameField.onChange}
                required
              />
            </div>
            <div className="sign-up-input">
              <label> Last Name: </label>
              <input
                type="text"
                value={lastNameSign.value}
                onChange={lastNameSign.onChange}
                required
              />
            </div>
            <div className="sign-up-input">
              <label> Email: </label>
              <input
                value={emailField.value}
                onChange={emailField.onChange}
                type="email"
                required
              />
              {emailError === null ? null : (
                <span className="error"> {emailError} </span>
              )}
            </div>
            <div className="sign-up-input">
              <label>Username: </label>
              <input
                type="text"
                value={usernameField.value}
                onChange={usernameField.onChange}
                required
              />
              {userError === null ? null : (
                <span className="error"> {userError} </span>
              )}
              <div className="sign-up-input"></div>
              <label> Password: </label>
              <input
                value={passwordField.value}
                onChange={passwordField.onChange}
                type="password"
                required
              />
              {<span className="error">{passError}</span>}
            </div>

            <div className="sign-up-input">
              <label> Confirm Password: </label>
              <input
                value={confirmpasswordField.value}
                onChange={confirmpasswordField.onChange}
                type="password"
                required
              />
              {<span className="error"> {passError} </span>}
            </div>
            <div className="submit">
              <button type="submit"> Signup</button>
            </div>
          </form>
          <Link to="/" className="link">
            <button type="button"> Back to Login </button>
          </Link>
        </div>
      </div>
    );
  };

  const signUpValidate = () => {
    return (
      <div className="center">
        {verifyUser === "" && props.fromLogin != true && <Redirect to="/" />}
        <h2>{`Thanks for signing up your username is ${
          verifyUser ? verifyUser : usernameField.value
        }`}</h2>
        <p > Please check your email at: <span className="bold">{
          getEmail.data.getEmail != ""
            ? getEmail.data.getEmail
            : emailField.value
        } </span>
          Please don't leave this page until you have confirmed your email address.</p>

        <form onSubmit={confirmEmail}>
          <label>Enter your confirmation code here:</label>
          <input
            type="text"
            value={validationCodeField.value}
            onChange={validationCodeField.onChange}
          ></input>
          {<span className="error"> {validateError} </span>}
          <button type="submit"> Confirm Confirmation Code</button>
        </form>
      </div>
    );
  };

  const confirmEmail = async (event) => {
    event.preventDefault();
    let validationCode = validationCodeField.value;
    let username = verifyUser != "" ? verifyUser : usernameField.value;
    let result = await validateAccount({
      variables: { username, validationCode },
    });
    if (result.data.validateAccount === "Account verified") {
      setPage("signUpConfirm");
      setConfirmMsg("Email Successfully Confirmed");
    } else {
      setValidateError("Invalid Validation Code");
    }
  };

  return (
    !getEmail.loading && (
      <div>
        <Route exact path="/signup" render={() => signUpForm()} />
        {page === "signUpValidate" && <Redirect to="/signup/validate" />}
        <Route path="/signup/validate" render={() => signUpValidate()} />
        {page === "signUpConfirm" && <Redirect to="/signup/confirm" />}
        <Route
          exact
          path="/signup/confirm"
          render={() => <Confirmation confirmMsg={confirmMsg} />}
        />
      </div>
    )
  );
};

export default Signup;
