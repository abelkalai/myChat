import React from "react";
import { fieldInput } from "../hooks/customHooks";

const Signup = props => {
  const firstNameSign = fieldInput();
  const lastNameSign = fieldInput();
  const emailSign = fieldInput();
  const userSign = fieldInput();
  const passSign = fieldInput();
  const confirmPassSign = fieldInput();

  const submit = async event => {
    event.preventDefault();
    let firstName = firstNameSign.value;
    let lastName = lastNameSign.value;
    let email = emailSign.value;
    let username = userSign.value;
    let password = passSign.value;
    await props.addUser({
      variables: { firstName, lastName, email, username, password }
    });
    firstNameSign.clear();
    lastNameSign.clear();
    emailSign.clear();
    userSign.clear();
    passSign.clear();
    confirmPassSign.clear();
  };

  return (
    <div>
      <h1> Signup for an account!</h1>
      <form onSubmit={submit}>
        <div>
          First Name:{""}
          <input
            value={firstNameSign.value}
            onChange={firstNameSign.onChange}
          />
        </div>
        <div>
          Last Name:{""}
          <input value={lastNameSign.value} onChange={lastNameSign.onChange} />
        </div>
        <div>
          emailSign:{""}
          <input value={emailSign.value} onChange={emailSign.onChange} />
        </div>
        <div>
          userSign:{""}
          <input value={userSign.value} onChange={userSign.onChange} />
        </div>
        <div>
          Password:{""}
          <input
            value={passSign.value}
            onChange={passSign.onChange}
            type="password"
          />
        </div>
        <div>
          Confirm Password:{""}
          <input
            value={confirmPassSign.value}
            onChange={confirmPassSign.onChange}
            type="password"
          />
        </div>
        <div>
          <button type="submit">Signup</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
