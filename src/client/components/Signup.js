import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";

const Signup = props => {
  const firstNameSign = fieldInput();
  const lastNameSign = fieldInput();
  const emailSign = fieldInput();
  const userSign = fieldInput();
  const passSign = fieldInput();
  const confirmPassSign = fieldInput();
  const [userError, setUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const submit = async event => {
    event.preventDefault();
    let firstName = firstNameSign.value;
    let lastName = lastNameSign.value;
    let email = emailSign.value;
    let username = userSign.value;
    let password = passSign.value;

    let result = await props.addUser({
      variables: { firstName, lastName, email, username, password }
    });

    if (result.data.addUser.errorList == null) {
      setUserError(null)
      setEmailError(null)
      firstNameSign.clear();
      lastNameSign.clear();
      emailSign.clear();
      userSign.clear();
      passSign.clear();
      confirmPassSign.clear();
    }
    else{
      setUserError(result.data.addUser.errorList[0])
      setEmailError(result.data.addUser.errorList[1])
    }
  };

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
          </div>

          <div className="sign-up-input">
            <label>Confirm Password: </label>
            <input
              value={confirmPassSign.value}
              onChange={confirmPassSign.onChange}
              type="password"
              required
            />
          </div>
          <div className="submit">
            <button type="submit">Signup</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
