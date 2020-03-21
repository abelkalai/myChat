import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import {useMutation } from "@apollo/react-hooks";
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
  mutation validateAccount($email: String!, $validationCode: String!) {
    validateAccount(email: $email, validationCode: $validationCode)
  }
`;

const Signup =() => {
  document.title="Signup | MyChat"
  const firstNameSign = fieldInput();
  const lastNameSign = fieldInput();
  const emailSign = fieldInput();
  const userSign = fieldInput();
  const passSign = fieldInput();
  const confirmPassSign = fieldInput();
  const confirmNumber = fieldInput();
  const [userError, setUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [validateError, setValidateError] = useState(null);
  const [passError, setPassError] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState(null);
  const [addUser] = useMutation(ADD_USER);
  const [validateAccount] = useMutation(VALIDATE_ACCOUNT);
  const [page, setPage] = useState("signUpForm");

  
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

    if (result.data.addUser.errorList == null) {
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
              <label>First Name: </label>
              <input
                value={firstNameSign.value}
                onChange={firstNameSign.onChange}
                required
              />
            </div>
            <div className="sign-up-input">
              <label>Last Name: </label>
              <input
                value={lastNameSign.value}
                onChange={lastNameSign.onChange}
                required
              />
            </div>
            <div className="sign-up-input">
              <label>Email: </label>
              <input
                value={emailSign.value}
                onChange={emailSign.onChange}
                type="email"
                required
              />
              {emailError == null ? null : (
                <span className="error">{emailError}</span>
              )}
            </div>
            <div className="sign-up-input">
              <label>Username: </label>
              <input
                value={userSign.value}
                onChange={userSign.onChange}
                required
              />
              {userError == null ? null : (
                <span className="error">{userError}</span>
              )}
              <div className="sign-up-input"></div>
              <label>Password: </label>
              <input
                value={passSign.value}
                onChange={passSign.onChange}
                type="password"
                required
              />
              {<span className="error">{passError}</span>}
            </div>

            <div className="sign-up-input">
              <label>Confirm Password: </label>
              <input
                value={confirmPassSign.value}
                onChange={confirmPassSign.onChange}
                type="password"
                required
              />
              {<span className="error">{passError}</span>}
            </div>
            <div className="submit">
              <button type="submit">Signup</button>
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
        <h1>Thanks for signing up </h1>
        <h2>{`Welcome to MyChat, ${firstNameSign.value} ${lastNameSign.value}`}</h2>
        <p>{`Please check your email at: ${emailSign.value} 
          Please don't leave this page until you have confirmed your email address.`}</p>
        <form onSubmit={confirmEmail}>
          <label>Enter your confirmation code here:</label>
          <input
            value={confirmNumber.value}
            onChange={confirmNumber.onChange}
          ></input>
          {<span className="error">{validateError}</span>}
          <button type="submit"> Confirm Confirmation Code</button>
        </form>
      </div>
    );
  };

  const confirmEmail = async event => {
    event.preventDefault();
    let validationCode = confirmNumber.value;
    let email = emailSign.value;
    let result = await validateAccount({
      variables: { email, validationCode }
    });
    if (result.data.validateAccount == "Account verified") {
      setPage("signUpConfirm");
      setConfirmMsg("Email Successfully Confirmed");
    } else {
      setValidateError("Invalid Validation Code");
    }
  };

  return (
    <div>
      {page == "signUpForm" && signUpForm()}
      {page == "signUpValidate" && signUpConfirm()}
      {page == "signUpConfirm" && <Confirmation confirmMsg={confirmMsg} />}
    </div>
  );
};

export default Signup;
