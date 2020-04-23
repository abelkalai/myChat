import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useFieldInput } from "../hooks/customHooks";
import Confirmation from "./Confirmation";
import { CHECK_EMAIL } from "../../graphqlDocuments/user";
import { useLazyQuery } from "@apollo/react-hooks";
import "../../assets/stylesheets/components/front/forgotPage.css";

const Forgot = (props) => {
  document.title = `Forgot ${props.type} | MyChat`;
  const emailForm = useFieldInput("");
  const [error, setError] = useState(null);
  const [emailCheck] = useLazyQuery(CHECK_EMAIL, {
    onCompleted: (data) => {
      setError(data.checkEmail);
    },
  });

  const forgotForm = () => {
    return (
      <div className="center">
        <h1> Forgot {props.type}</h1>
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
              {error ? <span className="error">{error}</span> : null}
            </div>
            <div>
              <Link to="/" className="link">
                <button className="forgot-page-back-button" type="button">
                  Back to Login
                </button>
              </Link>
              <button className="forgot-page-submit-button" type="submit">
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
    emailCheck({ variables: { email, type } });
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
