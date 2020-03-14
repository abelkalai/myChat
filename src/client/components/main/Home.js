import React, { useEffect } from "react";

const Home = props => {
  const userInfo = props.activeUser ? props.activeUser : props.loggedIn;

  useEffect(() => {
    props.setShowWelcome(false);
  });
  useEffect(() => {
    props.setShowLogin(false);
  });
  
  const homePage = () => {
    return (
      <div className="center">
        <h1>Hi {`${userInfo.firstName} ${userInfo.lastName}`} </h1>
        <button onClick={logOut}> Log Out</button>
      </div>
    );
  };

  const logOut = async event => {
    event.preventDefault();
    document.cookie = "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setActiveUser(null);
    props.setPage("login");
    props.setShowWelcome(true);
    props.setShowLogin(true);
  };

  return <div>{homePage()}</div>;
};

export default Home;
