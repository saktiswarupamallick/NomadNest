import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import PlaceImg from "../PlaceImg";
import BookingDates from "../BookingDates";
import RatingModal from "../components/RatingModal";

export default function BookingsPage() {
  const [bookings,setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratedPlaces, setRatedPlaces] = useState({});

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`).then(response => {
      setBookings(response.data);
      // Check rating status for each booking
      response.data.forEach(booking => {
        checkRatingStatus(booking.place._id);
      });
    });
  }, []);

  const checkRatingStatus = async (placeId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/places/${placeId}/has-rated`);
      setRatedPlaces(prev => ({
        ...prev,
        [placeId]: response.data.hasRated
      }));
    } catch (error) {
      console.error('Failed to check rating status:', error);
    }
  };

  const handleRatingSubmitted = () => {
    // Refresh bookings to show updated ratings
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`).then(response => {
      setBookings(response.data);
      // Update rating status for the rated place
      if (selectedBooking?.place?._id) {
        setRatedPlaces(prev => ({
          ...prev,
          [selectedBooking.place._id]: true
        }));
      }
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <AccountNav />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="text-3xl text-[#F4F1DE] font-semibold mb-8">My Bookings</h1>
        <div className="grid gap-6">
          {bookings?.length > 0 && bookings.map(booking => (
            <div 
              key={booking._id}
              className="flex gap-6 bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20"
            >
              <div className="w-48 h-48 flex-shrink-0">
                <PlaceImg place={booking.place} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="grow">
                <h2 className="text-2xl text-[#F4F1DE] font-semibold mb-2">{booking.place.title}</h2>
                <div className="flex items-center gap-1 text-[#F4F1DE]/80 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>{booking.place.address}</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <BookingDates booking={booking} className="text-[#F4F1DE]/80" />
                  </div>
                  <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <span>Total price: ${booking.price}</span>
                  </div>
                </div>
                {!ratedPlaces[booking.place._id] && (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsRatingModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#F4F1DE]/90"
                  >
                    Rate Your Stay
                  </button>
                )}
                {ratedPlaces[booking.place._id] && (
                  <div className="text-[#F4F1DE]/60 italic">
                    You have already rated this stay
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        placeId={selectedBooking?.place?._id}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
}