import gql from "graphql-tag";

export const GET_MESSAGES = gql`
  query getMessages($senderID: String!, $receiverID: String!) {
    getMessages(senderID: $senderID, receiverID: $receiverID) {
      _id
      conversationID
      senderID
      receiverID
      content
      time
    }
  }
`;

export const READ_MESSAGE = gql`
  mutation readMessage($_id: String!) {
    readMessage(_id: $_id)
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage(
    $senderID: String!
    $receiverID: String!
    $content: String!
  ) {
    sendMessage(senderID: $senderID, receiverID: $receiverID, content: $content)
  }
`;

export const NEW_MESSAGE = gql`
  subscription {
    newMessage {
      _id
      conversationID
      senderID
      receiverID
      content
      time
    }
  }
`;