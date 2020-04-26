import React, { Fragment, useState } from "react";
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
    } else {
      setPasswordError(null);
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
      setPage("signUpValidate");
    } else {
      setUserError(result.data.addUser.errorList[0]);
      setEmailError(result.data.addUser.errorList[1]);
    }
  };

  const signUpForm = () => {
    return (
      <Fragment>
        <h1> Signup </h1>
        {emailError ? <h2 className="error"> {emailError} </h2> : null}
        {userError ? <h2 className="error"> {userError} </h2> : null}
        {passwordError ? <h2 className="error">{passwordError}</h2> : null}
        <div className="sign-up">
          <form className="front-page-form" onSubmit={submit}>
            <div className="front-page-form-div">
              <input
                className="input-front-page-form"
                placeholder="First Name"
                type="text"
                value={firstNameField.value}
                onChange={firstNameField.onChange}
                required
              />
            </div>
            <div className="front-page-form-div">
              <input
                className="input-front-page-form"
                placeholder="Last Name"
                type="text"
                value={lastNameSign.value}
                onChange={lastNameSign.onChange}
                required
              />
            </div>
            <div className="front-page-form-div">
              <input
                className="input-front-page-form"
                placeholder="Email"
                value={emailField.value}
                onChange={emailField.onChange}
                type="email"
                required
              />
            </div>
            <div className="front-page-form-div">
              <input
                className="input-front-page-form"
                placeholder="Username"
                type="text"
                value={usernameField.value}
                onChange={usernameField.onChange}
                required
              />
              <div className="front-page-form-div">
                <input
                  className="input-front-page-form"
                  placeholder="Password"
                  value={passwordField.value}
                  onChange={passwordField.onChange}
                  type="password"
                  required
                />
              </div>

              <div className="front-page-form-div">
                <input
                  className="input-front-page-form"
                  placeholder="Confirm Password"
                  value={confirmpasswordField.value}
                  onChange={confirmpasswordField.onChange}
                  type="password"
                  required
                />
              </div>
              <div>
                <Link to="/" className="link">
                  <button className="front-page-back-button" type="button">
                    Back to Login
                  </button>
                </Link>
                <button className="front-page-submit-button" type="submit">
                  Signup
                </button>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  };

  const signUpValidate = () => {
    return (
      <Fragment>
        {!props.verifyUser && !props.fromLogin && <Redirect to="/" />}
        <h2>{`Thanks for signing up your username is: ${
          props.verifyUser ? props.verifyUser : usernameField.value
        }`}</h2>
        <div className="validate-info-container">
          <p>
            {"Please check your email at "}
            <span className="bold">
              {props.verifyEmail ? props.verifyEmail : emailField.value}
            </span>
          </p>
          <p>
            {`Please don't leave this page until you have confirmed your email
            address.`}
          </p>
        </div>
        <form className="front-page-form" onSubmit={confirmEmail}>
          {<h2 className="error"> {validateError} </h2>}
          <input
            className="input-front-page-form"
            placeholder="Confirmation Code"
            type="text"
            value={validationCodeField.value}
            onChange={validationCodeField.onChange}
          ></input>
          <div>
            <button className="confirm-code-button" type="submit">
              Confirm
            </button>
          </div>
        </form>
      </Fragment>
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
      setConfirmMsg("Email Confirmed");
    } else {
      setValidateError("Invalid Code");
    }
  };

  return (
    <div className="sign-up-content">
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
