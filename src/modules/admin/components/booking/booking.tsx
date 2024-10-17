"use client";

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import styles from "./booking.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileSaver from "file-saver";
import bookingServices from "../../services/bookingServices";
import { Booking } from "../../../../app/types/bookingType";

const BookingsPage = () => {
  const { data, loading, error } = useQuery(bookingServices.GET_ALL_BOOKINGS);

  const { data: exportData } = useQuery(bookingServices.EXPORT_ALL_BOOKINGS);

  const [rentOutVehicle] = useMutation(bookingServices.RENT_OUT_VEHICLE);

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
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        FileSaver.saveAs(fileBlob, `bookings.xlsx`);
        toast.success("Exported successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error exporting booking details:", error);
        toast.error("Error exporting booking details!", {
          position: "top-right",
          autoClose: 2000,
        });
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
  const handleRent = async (id: any) => {
    await rentOutVehicle({
      variables: { id: parseInt(id, 10) },
    });
    toast.success("Status updated!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.exportButton}>
        <button onClick={() => handleExport()}>Export Booking Details</button>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className={styles.bookingCardContainer}>
          {bookings.map((booking: Booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingCardDetails}>
                <h6 className={styles.bookingVehicleName}>
                  {booking.vehicle?.name}
                </h6>
                <div className={styles.bookingPickupDropoff}>
                  <div className={styles.bookingPickup}>
                    <p className={styles.bookingLabel}>Customer:</p>
                    <p className={styles.bookingLocation}>
                      {booking.customer.name}
                    </p>
                  </div>

                  <div className={styles.bookingPickup}>
                    <p className={styles.bookingLabel}>Pickup Location:</p>
                    <p className={styles.bookingLocation}>
                      {booking.pickupLocation}
                    </p>
                    <p className={styles.bookingLabel}>Pickup Date:</p>
                    <p className={styles.bookingDateTime}>
                      {new Date(booking.pickupDate).toLocaleDateString()} at{" "}
                      {booking.pickupTime}
                    </p>
                  </div>
                  <div className={styles.bookingDropoff}>
                    <p className={styles.bookingLabel}>Dropoff Location:</p>
                    <p className={styles.bookingLocation}>
                      {booking.dropoffLocation}
                    </p>
                    <p className={styles.bookingLabel}>Dropoff Date:</p>
                    <p className={styles.bookingDateTime}>
                      {new Date(booking.dropoffDate).toLocaleDateString()} at{" "}
                      {booking.dropoffTime}
                    </p>
                  </div>
                </div>
                <p className={styles.bookingStatus}>
                  Status: {booking.status}
                  {/* | Payment Status: {booking.paymentStatus} */}
                </p>
                <div className={styles.bookingAmountRow}>
                  <p className={styles.bookingAmount}>
                    Amount: Rs {booking.amount}
                  </p>
                  {booking.status === "Booked" ? (
                    <button
                      onClick={() => handleRent(booking.id)}
                      className={styles.rentButton}
                    >
                      Rent Out
                    </button>
                  ) : booking.status === "Rented" ? (
                    <button
                      onClick={() => handleRent(booking.id)}
                      className={styles.rentButton}
                    >
                      Returned
                    </button>
                  ) : (
                    ""
                  )}
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
