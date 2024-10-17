import { gql } from "@apollo/client";

const bookingServices = {

CREATE_BOOKING : gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      razorpayOrderId
      amount
      currency
    }
  }
`,

UPDATE_BOOKING_PAYMENT : gql`
  mutation UpdateBookingPayment(
    $id: Int!
    $razorpayPaymentId: String!
    $razorpaySignature: String!
  ) {
    updateBookingPayment(
      id: $id
      razorpayPaymentId: $razorpayPaymentId
      razorpaySignature: $razorpaySignature
    ) {
      id
      paymentStatus
    }
  }
`,

DELETE_BOOKING : gql`
  mutation DeleteBooking($id: Int!) {
    deleteBooking(id: $id) {
      id
    }
  }
`,

GET_BOOKINGS_BY_USER : gql`
query GetBookingsByUser($customerId: Int!) {
  getBookingsByUser(customerId: $customerId) {
    id
    pickupDate
    pickupTime
    dropoffDate
    dropoffTime
    status
    pickupLocation
    dropoffLocation
    paymentStatus
    amount
    razorpayPaymentId
    razorpaySignature
    vehicle {
      id
      name
    }
    customerId
    createdAt
  }
}
`,

EXPORT_BOOKING : gql`
  query ExportBooking($id: Int!) {
    exportBooking(id: $id)
  }
`,

} 

export default bookingServices;