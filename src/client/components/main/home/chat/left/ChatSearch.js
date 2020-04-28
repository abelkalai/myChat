import React, { Fragment, useState } from "react";
import History from "./History";
import { useFieldInput } from "../../../../hooks/customHooks";
import { SEARCH_USER } from "GraphqlDocuments/user";
import { useLazyQuery } from "@apollo/react-hooks";

const ChatSearch = (props) => {
  const [searchActive, setSearchActive] = useState(false);
  const searchField = useFieldInput("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery] = useLazyQuery(SEARCH_USER, {
    onCompleted: (data) => {
      setSearchResult(data.searchUser);
    },
  });

  const selectUser = (id) => {
    event.preventDefault();
    searchField.clear();
    setSearchActive(false);
    let userInConvoHistory = props.getConvoQuery.data.getConversations.filter(
      (convo) => convo.members.filter((member) => member._id === id).length > 0
    );
    props.setCurrentConvo(
      userInConvoHistory.length > 0 ? userInConvoHistory[0]._id : null
    );
    props.setCurrentChat(id);
  };

  const userDropdown = () => {
    if (searchResult.length === 0 || props.getConvoQuery.loading) {
      return null;
    }
    return (
      <div className="chat-search">
        {searchResult.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              selectUser(user._id);
            }}
          >
            <img src={`data:image/png;base64,${user.profilePicture}`} />
            <span className="chat-search-name">{user.fullName}</span>
          </div>
        ))}
      </div>
    );
  };

  const search = (event) => {
    searchField.manualChange(event.target.value);
    setSearchActive(event.target.value ? true : false);
    searchQuery({
      variables: {
        _id: props.userInfo._id,
        type: "contact",
        search: event.target.value,
      },
    });
  };

  return (
    <Fragment>
      <div className="chat-left">
        <div className="chat-search-container">
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
            currentConvo={props.currentConvo}
            setCurrentConvo={props.setCurrentConvo}
          />
        )}
      </div>
    </Fragment>
  );
};

export default ChatSearch;
