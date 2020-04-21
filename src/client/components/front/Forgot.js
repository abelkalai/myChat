import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFieldInput } from "../hooks/customHooks";
import Confirmation from "./Confirmation";
import { CHECK_EMAIL } from "../../graphqlDocuments/user";
import { useLazyQuery } from "@apollo/react-hooks";

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
            <button type="submit">Submit</button>
          </form>
          <Link to="/" className="link">
            <button type="button"> Back to Login </button>
          </Link>
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
    <div className="center">
      {error != "validEmail" && forgotForm()}
      {error === "validEmail" && (
        <Confirmation
          confirmMsg={`Please check your email to find your ${props.type} `}
        />
      )}
    </div>
  );
};

export default Forgot;
