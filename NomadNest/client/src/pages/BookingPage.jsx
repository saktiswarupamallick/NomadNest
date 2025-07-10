import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import AccountNav from "../AccountNav";
import {differenceInCalendarDays} from "date-fns";

export default function BookingPage() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`).then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return '';
  }

  return (
    <div className="min-h-screen bg-black">
      <AccountNav />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="text-4xl text-[#F4F1DE] font-bold mb-4">{booking.place.title}</h1>
        <AddressLink className="text-[#F4F1DE]/80 mb-8 block">{booking.place.address}</AddressLink>
        
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
              <h2 className="text-2xl text-[#F4F1DE] font-semibold mb-4">Booking Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <BookingDates booking={booking} className="text-[#F4F1DE]/80" />
                </div>
                <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <span>Booked by: {booking.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span>Phone: {booking.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
              <h2 className="text-2xl text-[#F4F1DE] font-semibold mb-4">Place Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-[#F4F1DE]/60">Check-in</div>
                    <div>{booking.place.checkIn}:00</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-[#F4F1DE]/60">Check-out</div>
                    <div>{booking.place.checkOut}:00</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#F4F1DE]/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-[#F4F1DE]/60">Max guests</div>
                    <div>{booking.place.maxGuests} people</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
              <h2 className="text-2xl text-[#F4F1DE] font-semibold mb-4">Description</h2>
              <p className="text-[#F4F1DE]/80 leading-relaxed">{booking.place.description}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
              <h2 className="text-2xl text-[#F4F1DE] font-semibold mb-4">Price Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[#F4F1DE]/80">
                  <span>${booking.place.price} x {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights</span>
                  <span>${booking.price}</span>
                </div>
                <div className="border-t border-[#F4F1DE]/20 pt-4 flex justify-between items-center">
                  <span className="text-[#F4F1DE] font-semibold">Total</span>
                  <span className="text-[#F4F1DE] font-semibold">${booking.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <PlaceGallery place={booking.place} />
        </div>
      </div>
    </div>
  );
}