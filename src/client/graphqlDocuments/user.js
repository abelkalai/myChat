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
    $passwordConfirm: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
      passwordConfirm: $passwordConfirm
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

export const FORGOT_CREDENTIAL = gql`
  query forgotCredetial($email: String, $type: String) {
    forgotCredential(email: $email, type: $type)
  }
`;

export const GET_PROFILE_PICTURE = gql`
  query getProfilePicture($_id: String!) {
    getProfilePicture(_id: $_id)
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
    $newPasswordConfirm: String!
  ) {
    changePassword(
      _id: $_id
      currentPassword: $currentPassword
      newPassword: $newPassword
      newPasswordConfirm: $newPasswordConfirm
    )
  }
`;

export const SEARCH_USER = gql`
  query searchUser($_id: String!, $search: String!) {
    searchUser(_id: $_id, search: $search) {
      _id
      fullName
      profilePicture
    }
  }
`;

export const GET_USER = gql`
query getUser($_id: String!) {
  getUser(_id: $_id) {
    _id
    fullName
    profilePicture
    about
  }
}
`;
