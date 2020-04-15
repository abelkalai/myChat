import React, {Fragment} from "react";
import { Switch, Route } from "react-router-dom";
import InvalidLink from "../../utilities/InvalidLink";
import Home from "./Home";
import "../../../assets/stylesheets/components/main/home.css";

const HomeContainer = props => {
  return (
    <Fragment>
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
            <Home
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
    </Fragment>
  );
};

export default HomeContainer;
