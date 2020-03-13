import React, { useState } from "react";
import { fieldInput } from "../../hooks/customHooks";
import Confirmation from "../Confirmation";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const CHECK_EMAIL = gql`
  query checkEmail($email: String) {
    checkEmail(email: $email)
  }
`;

const Forgot = props => {
  const [validate, setValidate] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const emailForm = fieldInput();
  const validationCode = fieldInput();
  const [error, setError] = useState(null);
  const [emailCheck] = useLazyQuery(
    CHECK_EMAIL  , {onCompleted: data=>{setError(data.checkEmail)}})
  
  const forgotForm = () => {
    return (
      <div>
        <h1> Forgot {props.type}</h1>
        <div>
          <form onSubmit={emailCall}>
            Enter Email Address:
            <input
              value={emailForm.value}
              onChange={emailForm.onChange}
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
    emailCheck({ variables: { email } });
    console.log(error)
  };

  const validateForm = () => {
    return (
      <div className="center">
        <h1>
          {`Please check your email for a validation code to change your ${props.type}`}
        </h1>
        <form
          onSubmit={() => {
            setConfirm(true), setValidate(false);
          }}
        >
          <div>
            Enter the validation code sent to your email
            <input
              value={validationCode.value}
              onChange={validationCode.onChange}
              required
            ></input>
            <button type="submit"> Verify Code </button>
          </div>
        </form>
        <button type="button"> Re-Send Validtion Code</button>
      </div>
    );
  };

  return (
    <div className="center">
      {error!="validEmail" && !confirm && forgotForm()}
      {error=="validEmail" && validateForm()}
      {confirm && <Confirmation confirmMsg={`${props.type} Change`} />}
    </div>
  );
};

export default Forgot;
