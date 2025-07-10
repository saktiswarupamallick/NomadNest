import {useContext, useEffect, useState} from "react";
import {isBefore, startOfToday} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function ExperienceBookingWidget({experience}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [redirect, setRedirect] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [dateErrors, setDateErrors] = useState({ selectedDate: '' });
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const validateDate = (date) => {
    if (!date) {
      setDateErrors(prev => ({
        ...prev,
        selectedDate: 'Please select a date'
      }));
      return false;
    }

    const selectedDate = new Date(date);
    const today = startOfToday();
    
    // Debug logging
    console.log('Selected date:', date);
    console.log('Selected date object:', selectedDate);
    console.log('Today:', today);
    console.log('Experience availability:', experience.availability);
    
    if (isBefore(selectedDate, today)) {
      setDateErrors(prev => ({
        ...prev,
        selectedDate: 'Please select a future date'
      }));
      return false;
    }
    
    // Check if the selected date has available slots
    // Convert both dates to YYYY-MM-DD format for comparison
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const availableSlot = experience.availability?.find(slot => {
      // Handle both string and Date object formats from database
      const slotDate = slot.date instanceof Date 
        ? slot.date.toISOString().split('T')[0] 
        : new Date(slot.date).toISOString().split('T')[0];
      
      console.log('Comparing:', slotDate, 'with', selectedDateStr);
      console.log('Slot data:', slot);
      
      return slotDate === selectedDateStr && slot.slots >= numberOfPeople;
    });
    
    console.log('Available slot found:', availableSlot);
    
    if (!availableSlot) {
      setDateErrors(prev => ({
        ...prev,
        selectedDate: 'No available slots for this date'
      }));
      return false;
    }
    
    setDateErrors(prev => ({
      ...prev,
      selectedDate: ''
    }));
    return true;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    validateDate(date);
  };

  const handleNumberOfPeopleChange = (value) => {
    setNumberOfPeople(value);
    if (selectedDate) {
      validateDate(selectedDate);
    }
  };

  async function initiateBooking() {
    // Validate all required fields
    const requiredFields = {
      selectedDate: 'Date',
      numberOfPeople: 'Number of people',
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

    // Validate date before proceeding
    if (!validateDate(selectedDate)) {
      return;
    }

    try {
      // Create payment intent
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-payment-intent`, {
        amount: numberOfPeople * experience.price
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/experiences/${experience._id}/book`, {
        ...bookingData,
        date: selectedDate,
        numberOfPeople,
        specialRequests
      });
      const bookingId = response.data._id;
      setRedirect(`/account/experience-bookings`);
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
              selectedDate,
              numberOfPeople,
              name,
              phone,
              specialRequests
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
        ${experience.price} <span className="text-[#F4F1DE]/60 text-lg">per person</span>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Select Date:</label>
          <input 
            type="date"
            value={selectedDate}
            onChange={ev => handleDateChange(ev.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
          />
          {dateErrors.selectedDate && (
            <p className="text-red-500 text-sm mt-1">{dateErrors.selectedDate}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Number of people:</label>
          <input 
            type="number"
            value={numberOfPeople}
            onChange={ev => handleNumberOfPeopleChange(ev.target.value)}
            min="1"
            max={experience.maxGroupSize}
            className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
          />
          <p className="text-sm text-[#F4F1DE]/60 mt-1">Max group size: {experience.maxGroupSize}</p>
        </div>
        
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Your full name:</label>
          <input 
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
          />
        </div>
        
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Phone number:</label>
          <input 
            type="tel"
            value={phone}
            onChange={ev => setPhone(ev.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
          />
        </div>
        
        <div>
          <label className="block text-sm text-[#F4F1DE]/60 mb-2">Special requests (optional):</label>
          <textarea 
            value={specialRequests}
            onChange={ev => setSpecialRequests(ev.target.value)}
            placeholder="Any special requests or dietary requirements..."
            className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE] min-h-[80px]"
          />
        </div>
      </div>
      
      <button 
        onClick={initiateBooking} 
        className="w-full mt-6 py-3 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors duration-200 font-semibold"
      >
        Proceed to Payment
        {numberOfPeople > 0 && (
          <span> ${numberOfPeople * experience.price}</span>
        )}
      </button>
    </div>
  );
} 