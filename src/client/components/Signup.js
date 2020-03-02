import React  from "react";
import { fieldInput } from "../hooks/customHooks";

const Signup = () => {
  const firstNameSign = fieldInput("string");
  const lastNameSign = fieldInput("string");
  const emailSign = fieldInput("string");
  const userSign = fieldInput("string");
  const passSign = fieldInput("String");
  const confirmPassSign = fieldInput("string");

  return (
    <div>
      <h1> Signup for an account!</h1>
      <form>
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
          Email:{""}
          <input value={emailSign.value} onChange={emailSign.onChange} />
        </div>
        <div>
          Username:{""}
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
