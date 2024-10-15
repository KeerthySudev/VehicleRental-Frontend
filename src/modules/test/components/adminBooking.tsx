"use client";

import React, {useState} from "react";
import { useQuery, gql} from "@apollo/client";
import styles from "./vehicles.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileSaver from 'file-saver';

const GET_ALL_BOOKINGS = gql`
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
    customerId
    createdAt
  }
}
`;

const EXPORT_ALL_BOOKINGS = gql`
  query ExportAllBookings {
    exportAllBookings
  }
`;

const BookingsPage = () => {

  const { data, loading, error } = useQuery(GET_ALL_BOOKINGS);

  const { data:exportData} = useQuery(EXPORT_ALL_BOOKINGS);






  const bookings = data?.getAllBookings;
  console.log(data);
  console.log("data", exportData);

  const handleExport = () => {
    const confirmToast = () => {
      try {

        const base64Data = exportData.exportAllBookings;
  
        // Decode the base64 string
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
    
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
    
        const fileBlob = new Blob([bytes], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
  
        FileSaver.saveAs(fileBlob, `bookings.xlsx`);
        toast.success("Exported successfully!", { position: "top-right", autoClose: 2000 });
      } catch (error) {
        console.error("Error exporting booking details:", error);
        toast.error("Error exporting booking details!", { position: "top-right", autoClose: 2000 });
      }
    };
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
      <div className={styles.exportButton}>
      <button onClick={() => handleExport()}>Export Booking Details</button>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className={styles.bookingCardContainer}>
          {bookings.map((booking : any) => (
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
