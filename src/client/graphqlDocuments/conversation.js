import gql from "graphql-tag";

export const GET_CONVERSATIONS = gql`
  query getConversations($_id: String!) {
    getConversations(_id: $_id) {
      _id
      members {
        _id
        fullName
        profilePicture
      }
      lastSender
      lastMessage
      lastMessageTime
      unread
      sender {
        fullName
      }
    }
  }
`;

export const UPDATED_CONVO = gql`
  subscription {
    updatedConvo {
      _id
      members {
        _id
        fullName
        profilePicture
      }
      lastSender
      lastMessage
      lastMessageTime
      unread
      sender {
        fullName
      }
    }
  }
`;