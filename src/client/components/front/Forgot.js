import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";
import Confirmation from "./Confirmation";
import { useLazyQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";

const CHECK_EMAIL = gql`
  query checkEmail($email: String, $type: String) {
    checkEmail(email: $email, type: $type)
  }
`;

const Forgot = props => {
  const emailForm = fieldInput();
  const [error, setError] = useState(null);
  const [emailCheck] = useLazyQuery(
    CHECK_EMAIL  , {onCompleted: data=>{setError(data.checkEmail)}})
  
  const forgotForm = () => {
    return (
      <div className="center">
        <h1> Forgot {props.type}</h1>
        <div>
          <form onSubmit={emailCall}>
            Enter Email Address:
            <input
              value={emailForm.value}
              onChange={emailForm.onChange}
              type="email"
              required
            />
            <span className="error">{error}</span>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  };

  const emailCall = event => {
    event.preventDefault();
    let email=emailForm.value
    let type= props.type
    emailCheck({ variables: { email, type } });
  };

  return (
    <div className="center">
      {error!="validEmail" && forgotForm()}
      {error=="validEmail" && <Confirmation confirmMsg={`Please check your email to find your ${props.type} `} />}
    </div>
  );
};

export default Forgot;