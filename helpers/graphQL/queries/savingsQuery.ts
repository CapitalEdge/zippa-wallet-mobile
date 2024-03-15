import { gql } from "@apollo/client";

//get savings type from the DB
export const SAVINGSTYPE = gql`
query($type: String!){
  savings_typeCollection(filter: {name: {eq: $type}}){
    edges{
      node{
        id,
        name,
      }
    }
  }
}`;

//get interest rate 
export const INTERESTRATE = gql`
query($name: String!){
  savings_interestCollection(filter: {name: {eq: $name}}){
    edges{
      node{
        id,
        name,
        rate
      }
    }
  }
}`;
export const INTERESTRATEBYID = gql`
query($id: String!){
  savings_interestCollection(filter: {id: {eq: $id}}){
    edges{
      node{
        id,
        name,
        rate
      }
    }
  }
}`;

//get individual fixed deposit and filter by user_id and savings type
export const GET_FIXEDDEPOSIT = gql`
query getSavings($id: UUID, $savings_type_id: BigInt!) {
  savingsCollection(filter: {user_id: {eq: $id}, savings_type: {eq: $savings_type_id}}) {
    edges {
      node {
        id
        user_id
        name
        amount
        total_amount
        term
        interest_rate
        created_at
        end_date
      }
    }
  }
}`;

//get individual thrift deposit and filter by user_id and savings type
export const GET_THRIFT_SAVINGS = gql`
query ($id: UUID, $savings_type_id: BigInt!) {
  savingsCollection(filter: {user_id: {eq: $id}, savings_type: {eq: $savings_type_id}}) {
    edges {
      node {
        id
        user_id
        name
        amount
        total_amount
        interest_rate: savings_interest{
          id,
          name,
          rate
        }
        frequency: savings_frequency{
          id,
          name,
          value
        }
        term
      }
    }
  }
}`;

export const GET_TARGET_SAVINGS = gql`
query ($id: UUID, $savings_type_id: BigInt!) {
  savingsCollection(filter: {user_id: {eq: $id}, savings_type: {eq: $savings_type_id}}) {
    edges {
      node {
        id
        user_id
        name
        amount
        total_amount
        term
        frequency: savings_frequency{
          id,
          name,
          value
        }
        savings_mode: savings_mode{
          id,
          key,
          name
        }
        interest_rate: savings_interest{
          id,
          name,
          rate
        }
        created_at
        end_date
      }
    }
  }
}`;

//get benefits classes
export const GET_BENEFITCLASSBYID = gql`
query($savings_type: BigInt!) {
  savings_benefitsCollection(filter: {savings_type: {eq: $savings_type}}) {
    edges {
      node {
        id
        name
        benefits
        amount
      }
    }
  }
}
`;

// get savings frequency
export const GET_SAVINGS_FREQUENCY = gql`
query{
  savings_frequencyCollection{
    edges{
      node{
        id,
        name,
        value
      }
    }
  }
}`;

// get savings mode
export const GET_SAVINGS_MODE = gql`
query{
  savings_modeCollection {
    edges {
      node {
        id
        name
        key
      }
    }
  }
}`;


export const GET_THRIFT_TOPUP = gql`
query($transaction_details: BigInt){
  transactionsCollection(filter:{transaction_details: {eq: $transaction_details}}){
    edges{
      node{
        id,
        amount
        created_at
        transaction_details: savings{
          id,
          name,
          amount,
          total_amount,
          end_date
        }
        transaction_reference
      }
    }
  }
}
`;


export const GET_BENEFITS_AND_SMARTKIDDIES_SAVINGS = gql`
query ($id: UUID, $saving_type_id: BigInt!) {
  savingsCollection(
    filter: {user_id: {eq: $id}, savings_type: {eq: $saving_type_id}}
  ) {
    edges {
      node {
        id
        name
        amount
        term
        savings_type {
          name
        }
        savings_benefits {
          name
          benefits
          amount
        }
        created_at
        end_date
      }
    }
  }
}`;

export const GET_ALL_SAVINGS = gql`
query($user_Id: UUID!){savingsCollection(filter: { user_id: { eq: $user_Id}
  }){
    edges{
      node{
        id,
        savings_type{
          name
        }
      }
    }
  }
}`;