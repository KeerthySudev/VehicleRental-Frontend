import { gql } from "@apollo/client";

const authServices = {

  LOGIN_USER : gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        city
        country
        email
        id
        name
        phone
        pincode
        state
        role
      }
    }
  }
`,

VALIDATE_CUSTOMER : gql`
  mutation ValidateCustomer($customerInput: CustomerInput!) {
    validateCustomer(customerInput: $customerInput) 
  }
`,

REGISTER_CUSTOMER : gql`
  mutation RegisterCustomer($customerInput: CustomerInput!) {
    registerCustomer(customerInput: $customerInput) {
      id
      name
      email
      phone
    }
  }
`,

SEND_VERIFICATION : gql`
  mutation sendVerification($phoneNumber: String!) {
    sendVerification(phoneNumber: $phoneNumber)
  }
`,

VERIFY_CODE : gql`
  mutation verifyCode($phoneNumber: String!, $code: String!) {
    verifyCode(phoneNumber: $phoneNumber, code: $code)
  }
`,

} 

export default authServices;