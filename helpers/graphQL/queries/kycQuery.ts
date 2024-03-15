import { gql } from "@apollo/client";

export const IDENTITY_TYPE = gql`
{
  identity_typeCollection {
    edges {
      node {
        id
        name
        short_name
      }
    }
  }
}
`;