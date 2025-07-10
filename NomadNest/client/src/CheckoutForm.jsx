import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm({ onSuccess, bookingData, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Address fields
  const [name, setName] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    // Validate address fields
    if (!name || !line1 || !city || !postalCode || !country) {
      setError('Please fill in all required address fields.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Update PaymentIntent with shipping info before confirming
      const updateResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSecret,
          name,
          address: {
            line1,
            city,
            postal_code: postalCode,
            country: country.toUpperCase() // Ensure country code is uppercase
          }
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update payment intent with shipping information');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {}, // Remove shipping info from here since it's already updated via backend
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(bookingData);
      } else {
        setError('Payment was not successful.');
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-black/30 rounded-lg space-y-2">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
        />
        <input
          type="text"
          placeholder="Address Line 1"
          value={line1}
          onChange={e => setLine1(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={e => setPostalCode(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
        />
        <input
          type="text"
          placeholder="Country (e.g. IN)"
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
        />
        <PaymentElement />
      </div>
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
          !stripe || processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#F4F1DE] text-black hover:bg-[#E5E2D1]'
        }`}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
} 