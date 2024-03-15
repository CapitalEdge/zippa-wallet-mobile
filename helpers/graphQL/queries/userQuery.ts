import { gql } from "@apollo/client";

export const USERDATA = gql`
query getUserName($id: UUID!) {
  usersCollection(filter: {id: {eq: $id}}) {
    edges {
      node {
        id
        firstname,
        lastname,
        username,
        email,
        phone,
        avatar,
        gender,
        dob,
        account_number,
        bank_details,
        wallet_balance,
        address,
        verified,
        user_identity_type,
        user_identity_number,
        user_details,
        created_at
      }
    }
  }
}
`;