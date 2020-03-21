import React, { useState } from "react";
import { fieldInput } from "../../../hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import "../../../../assets/stylesheets/components/main/settings.css";

const CHANGE_NAME = gql`
  mutation changeName($_id: String!, $firstName: String!, $lastName: String!) {
    changeName(_id: $_id, firstName: $firstName, lastName: $lastName)
  }
`;

const CHANGE_USERNAME = gql`
  mutation changeUserName($_id: String!, $username: String!) {
    changeUserName(_id: $_id, username: $username)
  }
`;

const General = props => {
  const [changeName] = useMutation(CHANGE_NAME);
  const [changeUserName] = useMutation(CHANGE_USERNAME)
  const firstNamefield = fieldInput();
  const lastNameField = fieldInput();
  const [showNameForm, setShowNameForm] = useState(false);
  const userField = fieldInput();
  const [showUserForm, setShowUserForm] = useState(false);
  const [userError, setUserError] = useState(null);

  const nameSection = () => {
    return (
      <div>
        Name: {`${props.userInfo.firstName} ${props.userInfo.lastName}`}
        <button
          type="button"
          className="button"
          onClick={() => {
            setShowNameForm(!showNameForm);
          }}
        >
          {!showNameForm ? "Edit" : "Close"}
        </button>
      </div>
    );
  };

  const nameForm = () => {
    return (
      <form className="form" onSubmit={changeNameCallBack}>
        <div>
          <label> First Name</label>
          <input
            required
            value={firstNamefield.value}
            onChange={firstNamefield.onChange}
          />
        </div>
        <div>
          <label> Last Name</label>
          <input
            required
            value={lastNameField.value}
            onChange={lastNameField.onChange}
          />
        </div>
        <div>
          <button type="submit"> Save Changes </button>
        </div>
      </form>
    );
  };

  const changeNameCallBack = async event => {
    event.preventDefault();
    let _id = props.userInfo._id;
    let firstName = firstNamefield.value;
    let lastName = lastNameField.value;
    await changeName({
      variables: { _id, firstName, lastName }
    });
    props.setUserInfo({
      ...props.userInfo,
      firstName,
      lastName
    });
    firstNamefield.clear();
    lastNameField.clear();
  };

  const usernameSection = () => {
    return (
      <div>
        Username: {`${props.userInfo.username}`}
        <button
          type="button"
          className="button"
          onClick={() => {
            setShowUserForm(!showUserForm);
          }}
        >
          {!showUserForm ? "Edit" : "Close"}
        </button>
      </div>
    );
  };


  const userNameForm = () => {
    return (
      <form className="form" onSubmit={changeUserCallBack}>
        <div>
          <label> Username</label>
          <input
            required
            value={userField.value}
            onChange={userField.onChange}
          />
          {<span className="error">{userError}</span>}
        </div>
        <div>
          <button type="submit"> Save Changes </button>
        </div>
      </form>
    );
  };

  const changeUserCallBack = async event => {
    event.preventDefault();
    if(userField.value==props.userInfo.username){
      setUserError("You're currently using this username")
      return
    }
    let _id = props.userInfo._id;
    let username = userField.value
    let result=await changeUserName({
      variables: { _id, username }
    });
    if(result.data.changeUserName!="Success"){
      setUserError(result.data.changeUserName)
      return
    }
    setUserError(null)
    props.setUserInfo({
      ...props.userInfo,
      username
    });
    userField.clear();
  };

  return (
    <div className="main-right">
      <h1>General Settings</h1>
      {nameSection()}
      {showNameForm && nameForm()}
      {usernameSection()}
      {showUserForm && userNameForm()}
      <div>Email: {`${props.userInfo.email}`}</div>
    </div>
  );
};

export default General;
