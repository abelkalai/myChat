import React, { useState } from "react";
import History from "./History";
import { fieldInput } from "../../../hooks/customHooks";
import {useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SEARCH_USER = gql`
  query searchUser($_id: String!, $type: String!, $search: String!) {
    searchUser(_id: $_id, type: $type, search: $search) {
      _id
      fullName
      profilePicture
    }
  }
`;

const ChatSearch = props => {
  const [searchActive, setSearchActive] = useState(false);
  const searchField = fieldInput();
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery] = useLazyQuery(SEARCH_USER, {
    onCompleted: data => {
      setSearchResult(data.searchUser);
    }
  });

  const selectUser = id => {
    event.preventDefault();
    searchField.clear();
    setSearchActive(false);
    props.setCurrentChat(id);
  };

  const userDropdown = () => {
    if (searchResult.length === 0) {
      return null;
    }
    return (
      <div className="chat-dropdown">
        {searchResult.map(user => (
          <div
            key={user._id}
            onClick={() => {
              selectUser(user._id);
            }}
          >
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
    setSearchActive(event.target.value === "" ? false : true);
    searchQuery({
      variables: {
        _id: props.userInfo._id,
        type: "contact",
        search: event.target.value
      }
    });
  };

  return (
    <div>
      <div className="chat-left">
        <div className="chat-search">
          <input
            value={searchField.value}
            className="searchContacts"
            placeholder="Search MyChat..."
            onChange={search}
          />
        </div>
        {searchActive && userDropdown()}
        {!searchActive && (
          <History
            userInfo={props.userInfo}
            convoHistory={props.getConvoQuery}
            setCurrentChat={props.setCurrentChat}
            setFromSearch={props.setFromSearch}
            currentConvo= {props.currentConvo}
            setCurrentConvo={props.setCurrentConvo}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSearch;
