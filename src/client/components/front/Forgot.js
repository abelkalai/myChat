import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useFieldInput } from "Hooks/customHooks";
import Confirmation from "./Confirmation";
import { FORGOT_CREDENTIAL } from "GraphqlDocuments/userDocs";
import { useLazyQuery } from "@apollo/react-hooks";

const Forgot = (props) => {
  useEffect(() => {
    document.title = `Forgot ${props.type} | MyChat`;
  },[]);
  const emailForm = useFieldInput("");
  const [error, setError] = useState(null);
  const [forgotCredential] = useLazyQuery(FORGOT_CREDENTIAL, {
    onCompleted: (data) => {
      setError(data.forgotCredential);
    },
  });

  const forgotForm = () => {
    return (
      <div className="center">
        <h1> Forgot {props.type}</h1>
        {error ? <h2 className="error">{error}</h2> : null}
        <div>
          <form className="front-page-form" onSubmit={emailCall}>
            <div className="front-page-form-div">
              <input
                className="input-front-page-form"
                placeholder="Email"
                value={emailForm.value}
                onChange={emailForm.onChange}
                type="email"
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const emailCall = (event) => {
    event.preventDefault();
    let email = emailForm.value;
    let type = props.type;
    forgotCredential({ variables: { email, type } });
  };

  return (
    <Fragment>
      {error != "validEmail" && forgotForm()}
      {error === "validEmail" && (
        <Confirmation
          confirmMsg={`Please check your email to find your ${props.type} `}
        />
      )}
    </Fragment>
  );
};

export default Forgot;
