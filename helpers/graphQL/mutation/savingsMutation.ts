import { gql } from "@apollo/client";

export const ADD_SAVINGS = gql`
mutation savings($input: [savingsInsertInput!]!) {
  insertIntosavingsCollection(objects: $input) {
    __typename,
    affectedCount,
    records{
      id
    }
  }
}`;

export const UPDATE_THRIFTSAVINGS = gql`
mutation updateThriftSavings($id: BigInt!, $input: savingsUpdateInput!) {
  updatesavingsCollection(filter: {id: {eq: $id}}, set: $input) {
    __typename,
    affectedCount,
    records{
      id
    }
  }
}`;
