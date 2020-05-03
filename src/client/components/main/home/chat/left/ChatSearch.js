import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import History from "./History";
import { useFieldInput } from "../../../../hooks/customHooks";
import { SEARCH_USER } from "GraphqlDocuments/user";
import { useLazyQuery } from "@apollo/react-hooks";
import "MainStylesheets/chat/chatSearch.css";

const ChatSearch = (props) => {
  const [searchActive, setSearchActive] = useState(false);
  const searchField = useFieldInput("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery] = useLazyQuery(SEARCH_USER, {
    onCompleted: (data) => {
      setSearchResult(data.searchUser);
    },
  });

  const selectUser = () => {
    event.preventDefault();
    searchField.clear();
    setSearchActive(false);
    if (props.windowWidth <= 768) {
      props.setMobileDisplay("chat");
    }
  };

  const chatSearchResults = () => {
    if (searchResult.length === 0 || props.getConvoQuery.loading) {
      return null;
    }
    return (
      <div className="chat-search-results">
        {searchResult.map((user) => (
          <div key={`search_${user._id}`} className="pointer-wrapper">
            <NavLink
              exact
              to={`/home/messages/${user._id}`}
              className="link"
              activeClassName="linkActive"
            >
              <div
                className="chat-search-results-container"
                onClick={() => {
                  selectUser();
                }}
              >
                <img src={`data:image/png;base64,${user.profilePicture}`} />
                <div className="chat-search-results-name">{user.fullName}</div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    );
  };

  const searchContact = (event) => {
    searchField.manualChange(event.target.value);
    setSearchActive(event.target.value ? true : false);
    searchQuery({
      variables: {
        _id: props.userInfo._id,
        search: event.target.value,
      },
    });
  };

  return props.windowWidth > 768 || props.mobileDisplay === "search" ? (
    <div className="chat-left">
      <div className="chat-search-container">
        <input
          value={searchField.value}
          className="search-contacts-input"
          placeholder="Search MyChat..."
          onChange={searchContact}
        />
      </div>
      {searchActive && chatSearchResults()}
      {!searchActive && (
        <History
          userInfo={props.userInfo}
          convoHistory={props.getConvoQuery}
          setCurrentChat={props.setCurrentChat}
          currentConvo={props.currentConvo}
          setCurrentConvo={props.setCurrentConvo}
          windowWidth={props.windowWidth}
          setMobileDisplay={props.setMobileDisplay}
        />
      )}
    </div>
  ) : null;
};

export default ChatSearch;
