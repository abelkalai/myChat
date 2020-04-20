import gql from "graphql-tag";

export const LOGGED_IN = gql`
  {
    loggedIn {
      _id
      firstName
      lastName
      fullName
      email
      username
      confirmed
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      User {
        _id
        firstName
        lastName
        fullName
        email
        username
        confirmed
      }
      Token
      errorList
      email
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $username: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
    ) {
      User {
        firstName
        lastName
        email
      }
      errorList
    }
  }
`;

export const VALIDATE_ACCOUNT = gql`
  mutation validateAccount($username: String!, $validationCode: String!) {
    validateAccount(username: $username, validationCode: $validationCode)
  }
`;

export const CHECK_EMAIL = gql`
  query checkEmail($email: String, $type: String) {
    checkEmail(email: $email, type: $type)
  }
`;

export const GET_IMAGE = gql`
  query getImage($_id: String!) {
    getImage(_id: $_id)
  }
`;

export const EDIT_IMAGE = gql`
  mutation editImage($_id: String!, $image: String!) {
    editImage(_id: $_id, image: $image)
  }
`;

export const GET_ABOUT = gql`
  query getAbout($_id: String!) {
    getAbout(_id: $_id)
  }
`;

export const EDIT_ABOUT = gql`
  mutation editAbout($_id: String!, $about: String!) {
    editAbout(_id: $_id, about: $about)
  }
`;

export const CHANGE_NAME = gql`
  mutation changeName($_id: String!, $firstName: String!, $lastName: String!) {
    changeName(_id: $_id, firstName: $firstName, lastName: $lastName)
  }
`;

export const CHANGE_USERNAME = gql`
  mutation changeUserName($_id: String!, $username: String!) {
    changeUserName(_id: $_id, username: $username)
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $_id: String!
    $currentPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      _id: $_id
      currentPassword: $currentPassword
      newPassword: $newPassword
    )
  }
`;

export const SEARCH_USER = gql`
  query searchUser($_id: String!, $type: String!, $search: String!) {
    searchUser(_id: $_id, type: $type, search: $search) {
      _id
      fullName
      profilePicture
    }
  }
`;

export const GET_SINGLE_USER = gql`
query getSingleUser($_id: String!) {
  getSingleUser(_id: $_id) {
    _id
    fullName
    profilePicture
    about
  }
}
`;
