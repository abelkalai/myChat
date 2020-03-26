import React, { useState, useEffect } from "react";
import { Link, Redirect, Route } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { fieldInput } from "../hooks/customHooks";
import Confirmation from "./Confirmation";

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

const Signup = props => {
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
  const firstNameSign = fieldInput();
  const lastNameSign = fieldInput();
  const emailSign = fieldInput();
  const userSign = fieldInput();
  const passSign = fieldInput();
  const confirmPassSign = fieldInput();
  const confirmNumber = fieldInput();

  const submit = async event => {
    event.preventDefault();
    if (passSign.value !== confirmPassSign.value) {
      setPassError("Passwords don't match");
      return;
    }
    let firstName = firstNameSign.value;
    let lastName = lastNameSign.value;
    let email = emailSign.value;
    let username = userSign.value;
    let password = passSign.value;

    let result = await addUser({
      variables: {
        firstName,
        lastName,
        email,
        username,
        password
      }
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
                value={firstNameSign.value}
                onChange={firstNameSign.onChange}
                required
              />
            </div>
            <div className="sign-up-input">
              <label> Last Name: </label>
              <input
                value={lastNameSign.value}
                onChange={lastNameSign.onChange}
                required
              />
            </div>
            <div className="sign-up-input">
              <label> Email: </label>
              <input
                value={emailSign.value}
                onChange={emailSign.onChange}
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
                value={userSign.value}
                onChange={userSign.onChange}
                required
              />
              {userError === null ? null : (
                <span className="error"> {userError} </span>
              )}
              <div className="sign-up-input"></div>
              <label> Password: </label>
              <input
                value={passSign.value}
                onChange={passSign.onChange}
                type="password"
                required
              />
              {<span className="error">{passError}</span>}
            </div>

            <div className="sign-up-input">
              <label> Confirm Password: </label>
              <input
                value={confirmPassSign.value}
                onChange={confirmPassSign.onChange}
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

  const signUpConfirm = () => {
    return (
      <div className="center">
        <h2>{`Thanks for signing up your username is ${
          verifyUser ? verifyUser : userSign.value
        }`}</h2>
        <p>{`Please check your email at: ${
          getEmail.data.getEmail != ""
            ? getEmail.data.getEmail
            : emailSign.value
        } 
          Please don't leave this page until you have confirmed your email address.`}</p>

        <form onSubmit={confirmEmail}>
          <label>Enter your confirmation code here:</label>
          <input
            value={confirmNumber.value}
            onChange={confirmNumber.onChange}
          ></input>
          {<span className="error"> {validateError} </span>}
          <button type="submit"> Confirm Confirmation Code</button>
        </form>
      </div>
    );
  };

  const confirmEmail = async event => {
    event.preventDefault();
    let validationCode = confirmNumber.value;
    let username = verifyUser != "" ? verifyUser : userSign.value;
    let result = await validateAccount({
      variables: { username, validationCode }
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
        {verifyUser === "" && props.fromLogin != true && <Redirect to="/" />}
        <Route exact path="/signup" render={() => signUpForm()} />
        {page === "signUpValidate" && <Redirect to="/signup/validate" />}
        <Route path="/signup/validate" render={() => signUpConfirm()} />
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