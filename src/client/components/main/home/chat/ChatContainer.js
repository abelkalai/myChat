import React, { useState } from "react";
import { fieldInput } from "../../../hooks/customHooks";
import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../../../assets/stylesheets/components/main/chat.css";

const SEARCH_USER = gql`
  query searchUser($_id: String!, $type: String!, $search: String!) {
    searchUser(_id: $_id, type: $type, search: $search) {
      _id
      fullName
      profilePicture
    }
  }
`;

const ChatContainer = props => {
  const searchField = fieldInput();
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery] = useLazyQuery(SEARCH_USER, {
    onCompleted: data => {
      setSearchResult(data.searchUser);
    }
  });

  const userDropdown = () => {
    if (searchResult.length === 0) {
      return null;
    }
    return (
      <div className="chat-dropdown">
        {searchResult.map(user => (
          <div key={user._id}>
            <span>
              <img src={`data:image/png;base64,${user.profilePicture}`} />
            </span>
            {user.fullName}
          </div>
        ))}
      </div>
    );
  };

  const search = event => {
    searchField.manualChange(event.target.value);
    searchQuery({
      variables: {
        _id: props.userInfo._id,
        type: "contact",
        search: event.target.value
      }
    });
  };

  const leftPanel = () => {
    return (
      <div className="chat-main">
        <div>
          <input
            className="searchContacts"
            placeholder="Search MyChat..."
            onChange={search}
          />
        </div>
        {userDropdown()}
      </div>
    );
  };
  return <div>{leftPanel()}</div>;
};

export default ChatContainer;
