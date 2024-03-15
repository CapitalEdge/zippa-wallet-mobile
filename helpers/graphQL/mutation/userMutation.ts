import { gql } from "@apollo/client";


export const UPDATE_USER = gql`
mutation updateUser($id: UUID!, $input: usersUpdateInput!){
  updateusersCollection(filter: {id: {eq: $id}}, set: $input){
    __typename
    affectedCount
     records{
      id
    }
  }
}`;