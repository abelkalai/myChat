import React from "react"

const General = props =>{
    return (
        <div className="main-right">
          <h1>General Settings</h1>
          <div>
            Name: {`${props.userInfo.firstName} ${props.userInfo.lastName}`}
          </div>
          <div>Username: {`${props.userInfo.username}`}</div>
          <div>Email: {`${props.userInfo.email}`}</div>
        </div>
      );
}

export default General