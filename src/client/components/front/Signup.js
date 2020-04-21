import React, { useState } from "react";
import { Link, Redirect, Route } from "react-router-dom";
import { ADD_USER, VALIDATE_ACCOUNT } from "../../graphqlDocuments/user";
import { useMutation } from "@apollo/react-hooks";
import { useFieldInput } from "../hooks/customHooks";
import Confirmation from "./Confirmation";
import "../../assets/stylesheets/components/front/signup.css";

const Signup = (props) => {
  document.title = "Signup | MyChat";
  const [addUser] = useMutation(ADD_USER);
  const [validateAccount] = useMutation(VALIDATE_ACCOUNT);
  const [userError, setUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [validateError, setValidateError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState(null);
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
    if (passwordField.value != confirmpasswordField.value) {
      setPasswordError("Passwords don't match");
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

    if (!result.data.addUser.errorList) {
      setUserError(null);
      setEmailError(null);
      setPasswordError(null);
      setPage("signUpValidate");
    } else {
      setUserError(result.data.addUser.errorList[0]);
      setEmailError(result.data.addUser.errorList[1]);
    }
  };

  const signUpForm = () => {
    return (
      <div>
        <h1> Signup for an account!</h1>
        <div className="sign-up">
          <form className="front-page-form" onSubmit={submit}>
            <div className="front-page-form-div">
              <label className="label-front-page-form"> First Name </label>
              <input
                className="input-front-page-form"
                type="text"
                value={firstNameField.value}
                onChange={firstNameField.onChange}
                required
              />
            </div>
            <div className="front-page-form-div">
              <label className="label-front-page-form"> Last Name </label>
              <input
                className="input-front-page-form"
                type="text"
                value={lastNameSign.value}
                onChange={lastNameSign.onChange}
                required
              />
            </div>
            <div className="front-page-form-div">
              <label className="label-front-page-form"> Email </label>
              <input
                className="input-front-page-form"
                value={emailField.value}
                onChange={emailField.onChange}
                type="email"
                required
              />
              {emailError ? (
                <span className="error"> {emailError} </span>
              ) : null}
            </div>
            <div className="front-page-form-div">
              <label className="label-front-page-form"> Username </label>
              <input
                className="input-front-page-form"
                type="text"
                value={usernameField.value}
                onChange={usernameField.onChange}
                required
              />
              {userError ? <span className="error"> {userError} </span> : null}
              <div className="front-page-form-div">
                <label className="label-front-page-form"> Password </label>
                <input
                  className="input-front-page-form"
                  value={passwordField.value}
                  onChange={passwordField.onChange}
                  type="password"
                  required
                />
                {passwordError ? (
                  <span className="error">{passwordError}</span>
                ) : null}
              </div>

              <div className="front-page-form-div">
                <label className="label-front-page-form">
                  Confirm Password:
                </label>
                <input
                  className="input-front-page-form"
                  value={confirmpasswordField.value}
                  onChange={confirmpasswordField.onChange}
                  type="password"
                  required
                />
                {passwordError ? (
                  <span className="error"> {passwordError} </span>
                ) : null}
              </div>
              <div className="submit">
                <button className="general-button" type="submit">
                  Signup
                </button>
              </div>
            </div>
          </form>
          <Link to="/" className="link">
            <button type="button">Back to Login</button>
          </Link>
        </div>
      </div>
    );
  };

  const signUpValidate = () => {
    return (
      <div>
        {!props.verifyUser && !props.fromLogin && <Redirect to="/" />}
        <h2>{`Thanks for signing up your username is ${
          props.verifyUser ? props.verifyUser : usernameField.value
        }`}</h2>
        <span>
          Please check your email at:
          <span className="bold">
            {props.verifyEmail ? props.verifyEmail : emailField.value}
          </span>
            {`. Please don't leave this page until you have confirmed your email
            address.`}

        </span>

        <form className="front-page-form" onSubmit={confirmEmail}>
          <input
            className="input-front-page-form"
            placeholder="Confirmation Code"
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
    let username = props.verifyUser ? props.verifyUser : usernameField.value;
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
  );
};

export default Signup;
