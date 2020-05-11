import React, { useState, useEffect, Fragment } from "react";
import { useMutation } from "@apollo/react-hooks";
import { ADD_USER, VERIFY_EMAIL } from "GraphqlDocuments/userDocs";
import { useFieldInput } from "Utilities/customHooks";
import { Link, Redirect, Route } from "react-router-dom";
import Confirmation from "./Confirmation";
import "LoginPageStylesheets/signup.css";

const Signup = (props) => {
  const [errors, setErrors] = useState([]);
  const [page, setPage] = useState("signUpForm");
  const [addUser] = useMutation(ADD_USER);
  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const firstNameField = useFieldInput("");
  const lastNameField = useFieldInput("");
  const emailField = useFieldInput("");
  const usernameField = useFieldInput("");
  const passwordField = useFieldInput("");
  const passwordConfirmField = useFieldInput("");
  const verificationCodeField = useFieldInput("");

  useEffect(() => {
    document.title = "Signup | MyChat";
  }, []);

  const signup = async (event) => {
    event.preventDefault();
    const firstName = firstNameField.value;
    const lastName = lastNameField.value;
    const email = emailField.value.trim();
    const username = usernameField.value.trim();
    const password = passwordField.value;
    const passwordConfirm = passwordConfirmField.value;

    let addUserResult = await addUser({
      variables: {
        firstName,
        lastName,
        email,
        username,
        password,
        passwordConfirm,
      },
    });
    setErrors(addUserResult.data.addUser.errorList);
    if (addUserResult.data.addUser.errorList.length === 0) {
      setErrors([]);
      setPage("signUpVerify");
    }
  };

  const signUpForm = () => {
    return (
      <Fragment>
        <h1> Signup </h1>
        {errors.length > 0
          ? errors.map((error) => (
              <h2 key={error} className="error">
                {error}
              </h2>
            ))
          : null}
        <form className="login-page-form" onSubmit={signup} autoComplete="off">
          <div>
            <input
              className="login-page-input"
              placeholder="First Name"
              type="text"
              value={firstNameField.value}
              onChange={firstNameField.onChange}
              required
            />
          </div>
          <div>
            <input
              className="login-page-input"
              placeholder="Last Name"
              type="text"
              value={lastNameField.value}
              onChange={lastNameField.onChange}
              required
            />
          </div>
          <div>
            <input
              className="login-page-input"
              placeholder="Email"
              value={emailField.value}
              onChange={emailField.onChange}
              type="email"
              required
            />
          </div>
          <div>
            <input
              className="login-page-input"
              placeholder="Username"
              type="text"
              value={usernameField.value}
              onChange={usernameField.onChange}
              required
            />
            <div>
              <input
                className="login-page-input"
                placeholder="Password"
                value={passwordField.value}
                onChange={passwordField.onChange}
                type="password"
                required
              />
            </div>

            <div>
              <input
                className="login-page-input"
                placeholder="Confirm Password"
                value={passwordConfirmField.value}
                onChange={passwordConfirmField.onChange}
                type="password"
                required
              />
            </div>
            <div>
              <Link to="/">
                <button className="login-page-back-button" type="button">
                  Back to Login
                </button>
              </Link>
              <button className="login-page-submit-button" type="submit">
                Signup
              </button>
            </div>
          </div>
        </form>
      </Fragment>
    );
  };

  const verifyEmailEvent = async (event) => {
    event.preventDefault();
    const verificationCode = verificationCodeField.value;
    const email = props.emailToVerify ? props.emailToVerify : emailField.value;
    const addUserResult = await verifyEmail({
      variables: { email, verificationCode },
    });
    if (addUserResult.data.verifyEmail.length === 0) {
      setPage("signUpConfirm");
    } else {
      setErrors(addUserResult.data.verifyEmail);
    }
  };

  const signUpVerify = () => {
    return (
      <Fragment>
        {!props.userToVerify && !usernameField.value && <Redirect to="/" />}
        <h2>{`Thanks for signing up your username is: ${
          props.userToVerifyUser ? props.userToVerify : usernameField.value
        }`}</h2>
        <div id="verify-info-container">
          <p>
            {"Please check your email at "}
            <span className="bold-text">
              {props.emailToVerify ? props.emailToVerify : emailField.value}
            </span>
          </p>
          <p>
            {`If you leave this page, you can verify your email upon logging in.`}
          </p>
        </div>
        <form
          className="login-page-form"
          autoComplete="off"
          onSubmit={verifyEmailEvent}
        >
          {errors.length > 0
            ? errors.map((error) => (
                <h2 key={error} className="error">
                  {error}
                </h2>
              ))
            : null}
          <input
            className="login-page-input"
            placeholder="Confirmation Code"
            type="text"
            value={verificationCodeField.value}
            onChange={verificationCodeField.onChange}
          ></input>
          <div>
            <button id="verify-code-button" type="submit">
              Confirm
            </button>
          </div>
        </form>
      </Fragment>
    );
  };

  return (
    <div id="sign-up-content">
      <Route exact path="/signup" render={() => signUpForm()} />
      {page === "signUpVerify" && <Redirect to="/signup/verify" />}
      <Route path="/signup/verify" render={() => signUpVerify()} />
      {page === "signUpConfirm" && <Redirect to="/signup/confirm" />}
      <Route
        exact
        path="/signup/confirm"
        render={() => <Confirmation confirmMsg={"Email Confirmed!"} />}
      />
    </div>
  );
};

export default Signup;
