import { gql } from "@apollo/client";

const userServices = {
  GET_CUSTOMER_BY_ID : gql`
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
UPDATE_CUSTOMER : gql`
mutation UpdateCustomer($id: Int!, $data: CustomerInput, $imageFile: Upload) {
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
  }`
} 

export default userServices;


