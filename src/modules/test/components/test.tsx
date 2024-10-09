import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useSearchParams } from 'next/navigation';

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

const BookingForm = () => {

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

  const sessionData = sessionStorage.getItem("userData");
  const user = sessionData ? JSON.parse(sessionData) : null;
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id'); 
  const price = searchParams.get('price'); 
  const today = new Date().toISOString().split('T')[0];


  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    amount: 0,
  });

  const pickupDate = new Date(formData.pickupDate);
  const dropoffDate = new Date(formData.dropoffDate);
  const noOfDays = dropoffDate.getDate() - pickupDate.getDate() +1;
  const amount = noOfDays * Number(price);
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [updateBookingPayment] = useMutation(UPDATE_BOOKING_PAYMENT);

  const handleChange = (e) => {
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
      amount: parseFloat(2),
      vehicleId: parseInt(14),
      customerId: parseInt(user.id),
    };
console.log(input);
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
            sessionStorage.removeItem('formData');

            updateBookingPayment({
              variables: {
                id: data.createBooking.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            }).then(() => {
              alert('Payment successful and booking updated!');
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="pickupDate">Pickup Date:</label>
        <input
          type="date"
          id="pickupDate"
          name="pickupDate"
          value={formData.pickupDate}
          onChange={handleChange}
          min={today}
          required
        />
      </div>
      <div>
        <label htmlFor="pickupTime">Pickup Time:</label>
        <input
          type="time"
          id="pickupTime"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="dropoffDate">Dropoff Date:</label>
        <input
          type="date"
          id="dropoffDate"
          name="dropoffDate"
          value={formData.dropoffDate}
          onChange={handleChange}
          min={formData.pickupDate || today}
          required
        />
      </div>
      <div>
        <label htmlFor="dropoffTime">Dropoff Time:</label>
        <input
          type="time"
          id="dropoffTime"
          name="dropoffTime"
          value={formData.dropoffTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="pickupLocation">Pickup Location:</label>
        <input
          type="text"
          id="pickupLocation"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="dropoffLocation">Dropoff Location:</label>
        <input
          type="text"
          id="dropoffLocation"
          name="dropoffLocation"
          value={formData.dropoffLocation}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Booking</button>
    </form>
  );
};

export default BookingForm;
