import { gql } from "@apollo/client";

export const AirtimeAndDataMutation = gql`
mutation airtime_and_data($input: [airtime_and_dataInsertInput!]!) {
  insertIntoairtime_and_dataCollection(objects: $input) {
    __typename
    affectedCount
    records {
      id
    }
  }
}`;