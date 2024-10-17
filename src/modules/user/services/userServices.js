import { gql } from "@apollo/client";

const userServices = {
  GET_CUSTOMER_BY_ID: gql`
    query Customer($id: Int!) {
      customer(id: $id) {
        id
        name
        email
        phone
        city
        state
        country
        pincode
        role
        image
      }
    }
  `,
  UPDATE_CUSTOMER: gql`
    mutation UpdateCustomer(
      $id: Int!
      $data: UpdateCustomerInput
      $imageFile: Upload
    ) {
      updateCustomer(id: $id, data: $data, imageFile: $imageFile) {
        id
        name
        email
        phone
        city
        state
        country
        pincode
        role
        image
      }
    }
  `,

  CHANGE_PASSWORD: gql`
    mutation ChangePassword(
      $id: Int!
      $password: String!
      $newPassword: String!
      $confirmPassword: String!
    ) {
      changePassword(
        id: $id
        password: $password
        newPassword: $newPassword
        confirmPassword: $confirmPassword
      ) {
        name
      }
    }
  `,
};

export default userServices;
