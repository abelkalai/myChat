import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect, Route } from "react-router-dom";
import { ADD_USER, VERIFY_EMAIL } from "GraphqlDocuments/user";
import { useMutation } from "@apollo/react-hooks";
import { useFieldInput } from "Hooks/customHooks";
import Confirmation from "./Confirmation";
import "FrontStylesheets/signup.css";

const Signup = (props) => {
  useEffect(() => {
    document.title = "Signup | MyChat";
  }, []);
  const [addUser] = useMutation(ADD_USER);
  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const [errors, setErrors] = useState([]);
  const [page, setPage] = useState("signUpForm");
  const firstNameField = useFieldInput("");
  const lastNameField = useFieldInput("");
  const emailField = useFieldInput("");
  const usernameField = useFieldInput("");
  const passwordField = useFieldInput("");
  const passwordConfirmField = useFieldInput("");
  const verificationCodeField = useFieldInput("");

  const signup = async (event) => {
    event.preventDefault();
    let firstName = firstNameField.value;
    let lastName = lastNameField.value;
    let email = emailField.value.trim();
    let username = usernameField.value.trim();
    let password = passwordField.value;
    let passwordConfirm = passwordConfirmField.value;

    let result = await addUser({
      variables: {
        firstName,
        lastName,
        email,
        username,
        password,
        passwordConfirm,
      },
    });
    setErrors(result.data.addUser.errorList);
    if (result.data.addUser.errorList.length === 0) {
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
        <div className="sign-up">
          <form className="front-page-form" onSubmit={signup}>
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
                value={lastNameField.value}
                onChange={lastNameField.onChange}
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
                  value={passwordConfirmField.value}
                  onChange={passwordConfirmField.onChange}
                  type="password"
                  required
                />
              </div>
              <div>
                <Link to="/" className="frontpage-link">
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

  const signUpVerify = () => {
    return (
      <Fragment>
        {!props.verifyUser && !usernameField.value && <Redirect to="/" />}
        <h2>{`Thanks for signing up your username is: ${
          props.verifyUser ? props.verifyUser : usernameField.value
        }`}</h2>
        <div className="verify-info-container">
          <p>
            {"Please check your email at "}
            <span className="bold">
              {props.verifyEmail ? props.verifyEmail : emailField.value}
            </span>
          </p>
          <p>
            {`If you leave this page, you can verify your email upon logging in.`}
          </p>
        </div>
        <form className="front-page-form" onSubmit={verifyEmailEvent}>
          {errors.length > 0
            ? errors.map((error) => (
                <h2 key={error} className="error">
                  {error}
                </h2>
              ))
            : null}
          <input
            className="input-front-page-form"
            placeholder="Confirmation Code"
            type="text"
            value={verificationCodeField.value}
            onChange={verificationCodeField.onChange}
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

  const verifyEmailEvent = async (event) => {
    event.preventDefault();
    let verificationCode = verificationCodeField.value;
    let email = props.verifyEmail ? props.verifyEmail : emailField.value;
    let result = await verifyEmail({
      variables: { email, verificationCode },
    });
    if (result.data.verifyEmail.length === 0) {
      setPage("signUpConfirm");
    } else {
      setErrors(result.data.verifyEmail);
    }
  };

  return (
    <div className="sign-up-content">
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
