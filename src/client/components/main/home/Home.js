import React from "react";
import { Switch, Route } from "react-router-dom";
import InvalidLink from "../../utilities/InvalidLink";
import HomeContainer from "./HomeContainer";
import "../../../assets/stylesheets/components/main/home.css";

const Home = props => {
  return (
    <div className="main-container">
      <Switch>
        <Route
          exact
          path={[
            "/home",
            "/home/profile",
            "/home/settings/general",
            "/home/settings/security"
          ]}
          render={() => (
            <HomeContainer
              ignoreCookie={props.ignoreCookie}
              setIgnoreCookie={props.setIgnoreCookie}
              loggedIn={props.loggedIn}
              activeUser={props.activeUser}
              setActiveUser={props.setActiveUser}
            />
          )}
        />
        <Route path="*" render={() => <InvalidLink type="MyChat" />} />
      </Switch>
    </div>
  );
};

export default Home;
