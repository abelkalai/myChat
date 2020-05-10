import React, { useState, useEffect, Fragment } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { FORGOT_CREDENTIAL } from "GraphqlDocuments/userDocs";
import { useFieldInput } from "Hooks/customHooks";
import { Link } from "react-router-dom";
import Confirmation from "./Confirmation";

const Forgot = (props) => {
  const [queryResult, setQueryResult] = useState(null);
  const [forgotCredential] = useLazyQuery(FORGOT_CREDENTIAL, {
    onCompleted: (data) => {
      setQueryResult(data.forgotCredential);
    },
  });
  const emailField = useFieldInput("");
  useEffect(() => {
    document.title = `Forgot ${props.type} | MyChat`;
  }, []);

  const forgotForm = () => {
    return (
      <div className="center">
        <h1> Forgot {props.type}</h1>
        {queryResult ? <h2 className="error">{queryResult}</h2> : null}
        <div>
          <form className="login-page-form" onSubmit={forgotSubmit}>
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
              <Link to="/">
                <button className="login-page-back-button" type="button">
                  Back to Login
                </button>
              </Link>
              <button className="login-page-submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const forgotSubmit = (event) => {
    event.preventDefault();
    let email = emailField.value;
    let type = props.type;
    forgotCredential({ variables: { email, type } });
  };

  return (
    <Fragment>
      {queryResult != "validEmail" && forgotForm()}
      {queryResult === "validEmail" && (
        <Confirmation
          confirmMsg={`Please check your email to find your ${props.type} `}
        />
      )}
    </Fragment>
  );
};

export default Forgot;
