import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays, isBefore, startOfToday} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function BookingWidget({place}) {
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [dateErrors, setDateErrors] = useState({ checkIn: '', checkOut: '' });
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const validateDates = (date, type) => {
    const selectedDate = new Date(date);
    const today = startOfToday();
    
    if (isBefore(selectedDate, today)) {
      setDateErrors(prev => ({
        ...prev,
        [type]: 'Please select a future date'
      }));
      return false;
    }
    
    if (type === 'checkOut' && checkIn) {
      const checkInDate = new Date(checkIn);
      if (isBefore(selectedDate, checkInDate)) {
        setDateErrors(prev => ({
          ...prev,
          [type]: 'Check-out date must be after check-in date'
        }));
        return false;
      }
    }
    
    setDateErrors(prev => ({
      ...prev,
      [type]: ''
    }));
    return true;
  };

  const handleDateChange = (date, type) => {
    if (type === 'checkIn') {
      setCheckIn(date);
      validateDates(date, 'checkIn');
    } else {
      setCheckOut(date);
      validateDates(date, 'checkOut');
    }
  };

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function initiateBooking() {
    // Validate all required fields
    const requiredFields = {
      checkIn: 'Check-in date',
      checkOut: 'Check-out date',
      numberOfGuests: 'Number of guests',
      name: 'Full name',
      phone: 'Phone number'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !eval(key))
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    if (numberOfNights <= 0) {
      alert('Please select valid check-in and check-out dates');
      return;
    }

    // Validate dates before proceeding
    if (!validateDates(checkIn, 'checkIn') || !validateDates(checkOut, 'checkOut')) {
      return;
    }

    try {
      // Create payment intent
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-payment-intent`, {
        amount: numberOfNights * place.price
      });
      
      setClientSecret(response.data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      console.error('Payment intent error:', error);
      alert('Failed to initiate payment');
    }
  }

  async function handlePaymentSuccess(bookingData) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        ...bookingData,
        place: place._id,
        price: numberOfNights * place.price,
      });
      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking');
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  if (showPayment) {
    return (
      <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
        <h2 className="text-xl text-[#F4F1DE] mb-4">Complete your payment</h2>
        <Elements stripe={stripePromise} options={{clientSecret}}>
          <CheckoutForm 
            onSuccess={handlePaymentSuccess}
            bookingData={{
              checkIn,
              checkOut,
              numberOfGuests,
              name,
              phone
            }}
            clientSecret={clientSecret}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
      <div className="text-2xl text-center text-[#F4F1DE] font-semibold">
        ${place.price} <span className="text-[#F4F1DE]/60 text-lg">per night</span>
      </div>
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#F4F1DE]/60 mb-2">Check in:</label>
            <input type="date"
                   value={checkIn}
                   onChange={ev => handleDateChange(ev.target.value, 'checkIn')}
                   min={new Date().toISOString().split('T')[0]}
                   className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"/>
            {dateErrors.checkIn && (
              <p className="text-red-500 text-sm mt-1">{dateErrors.checkIn}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-[#F4F1DE]/60 mb-2">Check out:</label>
            <input type="date" 
                   value={checkOut}
                   onChange={ev => handleDateChange(ev.target.value, 'checkOut')}
                   min={checkIn || new Date().toISOString().split('T')[0]}
                   className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"/>
            {dateErrors.checkOut && (
              <p className="text-red-500 text-sm mt-1">{dateErrors.checkOut}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Number of guests:</label>
          <input type="number"
                 value={numberOfGuests}
                 onChange={ev => setNumberOfGuests(ev.target.value)}
                 min="1"
                 className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"/>
        </div>
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Your full name:</label>
          <input type="text"
                 value={name}
                 onChange={ev => setName(ev.target.value)}
                 className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"/>
        </div>
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Phone number:</label>
          <input type="tel"
                 value={phone}
                 onChange={ev => setPhone(ev.target.value)}
                 className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"/>
        </div>
      </div>
      <button 
        onClick={initiateBooking} 
        className="w-full mt-6 py-3 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors duration-200 font-semibold"
      >
        Proceed to Payment
        {numberOfNights > 0 && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
}