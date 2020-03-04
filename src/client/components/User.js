import React from "react";

const User = ({ result }) => {
  if (result.loading) {
    return null;
  }

  return (
    <div>
      <h2>Users</h2>
  {result.data.allUsers.map(a=> <p key={a.username}>{a.firstName} {a.lastName} {a.username}</p>)}
    </div>
  );
};


export default User