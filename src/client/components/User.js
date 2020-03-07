import React from "react";
import "../styles/all.css";

const User = ({ result }) => {
  if (result.loading) {
    return null;
  }

  return (
    <div className="center">
      <h2>Users</h2>
      {result.data.allUsers.map(a => (
        <p key={a._id}>
          {a.firstName} {a.lastName} {a.email} {a.username} {a.password}
        </p>
      ))}
    </div>
  );
};

export default User;
