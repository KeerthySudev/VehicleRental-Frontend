"use client";

import React, {useState} from "react";
import { useQuery, gql} from "@apollo/client";
import { useRouter } from "next/navigation";
import styles from "./booking.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileSaver from 'file-saver';
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

const EXPORT_BOOKING = gql`
  query ExportBooking($id: Int!) {
    exportBooking(id: $id)
  }
`;

const BookingsPage = () => {
  const sessionData = sessionStorage.getItem("userData");
  const user = sessionData ? JSON.parse(sessionData) : null;
  const userId = user.id; 
  const [bookingID, setBookingID] = useState();

  const { data, loading, error } = useQuery(GET_BOOKINGS_BY_USER, {
    variables: { customerId: userId ? parseInt(userId, 10) : null  },  
    skip: !userId,  
  });

  const { data:exportData} = useQuery(EXPORT_BOOKING, {
    variables: { id: bookingID ? parseInt(bookingID, 10) : null  }, 
    skip: !bookingID,  
  });






  const bookings = data?.getBookingsByUser;
  console.log(data);

  

  const handleExport = (id :any) => {
    const confirmToast = () => {
      try {
        console.log("data", exportData);
        console.log("exportBookingdata", exportData.exportBooking);
        const base64Data = exportData.exportBooking;
       
        // Decode the base64 string
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
    
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
    
        const fileBlob = new Blob([bytes], {
          type: 'application/pdf',
        });
  
        FileSaver.saveAs(fileBlob, `booking-${id}.pdf`);
        toast.success("Exported successfully!", { position: "top-right", autoClose: 2000 });
      } catch (error) {
        console.error("Error exporting booking details:", error);
        toast.error("Error exporting booking details!", { position: "top-right", autoClose: 2000 });
      }
    };
    setBookingID(id);

    toast.info(
      <div>
        <p>Are you sure you want to export booking details?</p>
        <button onClick={confirmToast} style={{ marginRight: "10px" }}>
          Yes
        </button>
        <button onClick={() => toast.dismiss()}>No</button>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };


  if (loading) return <p>Loading ...</p>;
  if (error) return <p>No bookings found.</p>;
  return (
    <div className={styles.bookingContainer}>
  {bookings && bookings.length > 0 ? (
    <div className={styles.bookingCardContainer}>
      {bookings.map((booking: any) => (
        <div key={booking.id} className={styles.bookingCard}>
          <div className={styles.bookingCardDetails}>
            <h6 className={styles.bookingVehicleName}>{booking.vehicle?.name}</h6>
            <div className={styles.bookingPickupDropoff}>
              <div className={styles.bookingPickup}>
                <p className={styles.bookingLabel}>Pickup Location:</p>
                <p className={styles.bookingLocation}>{booking.pickupLocation}</p>
                <p className={styles.bookingLabel}>Pickup Date:</p>
                <p className={styles.bookingDateTime}>
                  {new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}
                </p>
              </div>
              <div className={styles.bookingDropoff}>
                <p className={styles.bookingLabel}>Dropoff Location:</p>
                <p className={styles.bookingLocation}>{booking.dropoffLocation}</p>
                <p className={styles.bookingLabel}>Dropoff Date:</p>
                <p className={styles.bookingDateTime}>
                  {new Date(booking.dropoffDate).toLocaleDateString()} at {booking.dropoffTime}
                </p>
              </div>
            </div>
            <p className={styles.bookingStatus}>
              Status: {booking.status} | Payment Status: {booking.paymentStatus}
            </p>
            <p className={styles.bookingAmount}>
              Amount: Rs {booking.amount}
            </p>
            <div className={styles.exportButtons}>
              <button onClick={() => handleExport(booking.id)}>Export Details</button>
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
