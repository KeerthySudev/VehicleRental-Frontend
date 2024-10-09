"use client";

import React,{useEffect, useState} from "react";
import { useQuery, gql, useMutation} from "@apollo/client";
import { useRouter,  useSearchParams } from "next/navigation";
import styles from "./vehicle.module.css";
import vehicleServices from '../../services/vehicleServices';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      razorpayOrderId
      amount
      currency
    }
  }
`;

const UPDATE_BOOKING_PAYMENT = gql`
  mutation UpdateBookingPayment($id: Int!, $razorpayPaymentId: String!, $razorpaySignature: String!) {
    updateBookingPayment(id: $id, razorpayPaymentId: $razorpayPaymentId, razorpaySignature: $razorpaySignature) {
      id
      paymentStatus
    }
  }
`;

const VehiclePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const vehicleId = searchParams.get('id'); 
  const sessionData = sessionStorage.getItem("userData");
  const user = sessionData ? JSON.parse(sessionData) : null;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  

  const { data, loading, error } = useQuery(vehicleServices.GET_VEHICLE_BY_ID, {
    variables: { id: vehicleId ? parseInt(vehicleId, 10) : null  },  // Pass the 'id' as a variable
    skip: !vehicleId,  // Skip query execution if 'id' is not available yet
  });
  const price = data?.getVehicleById.price;
  const formDetails = sessionStorage.getItem("formData");
  const bookingData = formDetails ? JSON.parse(formDetails) : null;

  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    isDifferentDropoff: false,
  });
  useEffect(() => {
    if (bookingData) {
      setFormData(bookingData);
    }
  }, []);

  const pickupDate = new Date(formData.pickupDate);
  const dropoffDate = new Date(formData.dropoffDate);
  const noOfDays = dropoffDate.getDate() - pickupDate.getDate() +1;
  const amount = noOfDays * Number(price);
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [updateBookingPayment] = useMutation(UPDATE_BOOKING_PAYMENT);

    const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
loadRazorpayScript();
    const input = {
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      dropoffDate: formData.dropoffDate,
      dropoffTime: formData.dropoffTime,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      amount: parseFloat(amount),
      vehicleId: parseInt(vehicleId),
      customerId: parseInt(user.id),
    };

    try {
      const { data } = await createBooking({ variables: { input } });

      if (data.createBooking) {
        const { razorpayOrderId, amount, currency } = data.createBooking;

        const options = {
          key: process.env.RAZORPAY_KEY_ID,
          amount: amount * 100, // amount in paise
          currency: currency,
          name: 'Vehicle Booking',
          description: 'Complete your payment',
          order_id: razorpayOrderId,
          handler: function (response) {
            
            updateBookingPayment({
              variables: {
                id: data.createBooking.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            }).then(() => {
              sessionStorage.removeItem('formData');
              toast.success("Booked your vehicle!", {
                position: "top-right",
                autoClose: 2000,
              });
        
              setTimeout(() => {
                router.push("/booking");
              }, 2000);
            });
          },
          prefill: {
            name: 'Keerthy Sudev',
            email: 'keerthysudev33@gmail.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
        };
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error('Error creating booking or initiating payment:', error);
    }
  };

  const handleClick = (price: any) => {
    // router.push(`/booking?id=${vehicleId}&price=${encodeURIComponent(price)}`);
  };
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error fetching..: {error.message}</p>;
  return (
    
<div>
{showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Book your wheels</h2>
            <form>
{/* <div className={styles.error}> {error && <p> {error.message}</p>}</div> */}

         <label htmlFor="pickupDate">Pick up Time:</label>
        <div className={styles.inputGroup}>
       <input
          type="date"
          id="pickupDate"
          name="pickupDate"
          value={formData.pickupDate}
          onChange={handleChange}
          min={today}
          required
        />
       <input
          type="time"
          id="pickupTime"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleChange}
          required
        />
       </div>
       <input
          type="text"
          id="pickupLocation"
          name="pickupLocation"
          placeholder="Pick up Location"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        />
      
        <label htmlFor="dropoffTime">Drop off Time:</label>
       <div className={styles.inputGroup}>
       <input
          type="date"
          id="dropoffDate"
          name="dropoffDate"
          value={formData.dropoffDate}
          onChange={handleChange}
          min={formData.pickupDate || today}
          placeholder="Drop off Location"
          required
        />
          <input
          type="time"
          id="dropoffTime"
          name="dropoffTime"
          value={formData.dropoffTime}
          onChange={handleChange}
          placeholder="Drop off Location"
          required
        />
       </div>

       <div className={styles.checkbox}>
        <input
          type="checkbox"
          name="isDifferentDropoff"
          checked={formData.isDifferentDropoff}
          onChange={() => setFormData(prevData => ({ ...prevData, isDifferentDropoff: !prevData.isDifferentDropoff }))}
        />
        <p>Different drop-off location?</p>

       
      </div>
      {formData.isDifferentDropoff &&(
        <input
          type="text"
          id="dropoffLocation"
          name="dropoffLocation"
          placeholder="Drop off Location"
          value={formData.dropoffLocation}
          onChange={handleChange}
          required
        />
      )}     

<button onClick={(e) => handleSubmit(e)} className={styles.submitButton}>
                Book
              </button>
              <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
          
        
      </form>
             
          </div>
        </div>
      )}
{data?.getVehicleById && (
<div className={styles.container}>

<div className={styles.vehicle}>
<div className={styles.vehicleDetails}>
<div className={styles.name}>
<h2>{data.getVehicleById.manufacturer?.name} {data.getVehicleById.model?.name} </h2>
<h3>Rs {data.getVehicleById.price} / day</h3>
</div>
<img src={data.getVehicleById.primaryImage} alt={data.getVehicleById.name} />
</div>
<div className={styles.images}>
<img src={data.getVehicleById.secondaryImage} alt={data.getVehicleById.name} />
</div>
</div>

<div className={styles.specification}>
<div className={styles.description}>
  <p>{data.getVehicleById.description}</p>
</div>
{/* <div className={styles.technical}>
  <h3>Technical Specification</h3>
</div> */}
<div className={styles.button}>
<button onClick={() => setShowModal(true)}>Rent now</button>
</div>
</div>

</div>
)}
</div>

  );
};

export default VehiclePage;
