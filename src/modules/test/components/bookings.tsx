"use client";

import React from "react";
import { useQuery, gql} from "@apollo/client";
import { useRouter,  useSearchParams } from "next/navigation";
import styles from "./vehicles.module.css";
// import vehicleServices from '../../services/vehicleServices';

const GET_BOOKINGS_BY_USER = gql`
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
`;

const BookingsPage = () => {
  const router = useRouter();
  const sessionData = sessionStorage.getItem("userData");
  const user = sessionData ? JSON.parse(sessionData) : null;
  const userId = user.id; 

  const { data, loading, error } = useQuery(GET_BOOKINGS_BY_USER, {
    variables: { customerId: userId ? parseInt(userId, 10) : null  },  // Pass the 'id' as a variable
    skip: !userId,  // Skip query execution if 'id' is not available yet
  });

  const bookings = data?.getBookingsByUser;
  console.log(data);
  // const handleClick = (price: any) => {
  //   router.push(`/booking?id=${vehicleId}&price=${encodeURIComponent(price)}`);
  // };
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>No bookings found.</p>;
  return (
    <div className={styles.bookingContainer}>
      {bookings && bookings.length > 0 ? (
        <div className={styles.bookingCardContainer}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingCardDetails}>
                <div className={styles.bookingInfo}>
                  <h6 className={styles.bookingVehicleName}>{booking.vehicle?.name}</h6>
                  <p className={styles.bookingLocation}>
                    Pickup Location: {booking.pickupLocation}
                  </p>
                  <p className={styles.bookingLocation}>
                    Dropoff Location: {booking.dropoffLocation}
                  </p>
                  <p className={styles.bookingDateTime}>
                    Pickup Date: {new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}
                  </p>
                  <p className={styles.bookingDateTime}>
                    Dropoff Date: {new Date(booking.dropoffDate).toLocaleDateString()} at {booking.dropoffTime}
                  </p>
                  <p className={styles.bookingStatus}>
                    Status: {booking.status} | Payment Status: {booking.paymentStatus}
                  </p>
                  <p className={styles.bookingAmount}>
                    Amount: Rs {booking.amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingsPage;
