import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
query ($userId: UUID!) {
  transactionsCollection(filter: {user_id: {eq: $userId}}) {
    edges {
      node {
        id
        amount
        created_at
        transaction_type {
          name
        }
		    transaction_set,
        transaction_details: savings{
          id,
          name,
          savings_type{
            name
          }
          created_at,
          end_date
        }
        transaction_reference
      }
    }
  }
}`;