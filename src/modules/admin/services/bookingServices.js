import { gql } from "@apollo/client";

const bookingServices = {

GET_ALL_BOOKINGS : gql`
query GetAllBookings  {
  getAllBookings  {
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
    customer{
      id 
      name
    }
    createdAt
  }
}
`,
RENT_OUT_VEHICLE : gql`
  mutation RentOutVehicle($id: Int!) {
    rentOutVehicle(id: $id) {
      id
      status
    }
  }
`,

EXPORT_ALL_BOOKINGS : gql`
  query ExportAllBookings {
    exportAllBookings
  }
`,

} 

export default bookingServices;