import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";
import AccountNav from "../AccountNav.jsx";

export default function ExperienceBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/experience-bookings`).then(response => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#F4F1DE]">
      <AccountNav />
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="py-8">
          <h1 className="text-4xl font-bold mb-8">My Experience Bookings</h1>
          
          <div className="flex flex-col gap-6">
            {bookings.length > 0 && bookings.map(booking => (
              <Link to={`/experience/${booking.experience?._id}`} key={booking._id} className="flex flex-col md:flex-row gap-6 bg-black/50 p-4 rounded-2xl overflow-hidden border border-[#F4F1DE]/20 hover:border-[#F4F1DE]/40 transition-colors">
                <div className="md:w-48 md:h-auto w-full h-48 flex-shrink-0">
                  {booking.experience?.photos?.[0] ? (
                    <Image
                      className="object-cover w-full h-full rounded-lg"
                      src={booking.experience.photos[0]}
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F4F1DE]/10 flex items-center justify-center rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#F4F1DE]/40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col grow gap-2">
                  <h2 className="font-bold text-xl text-[#F4F1DE]">
                    {booking.experience?.title}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-sm text-[#F4F1DE]/60 border-b border-t border-[#F4F1DE]/10 py-2">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[#F4F1DE]/20">•</div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{booking.experience?.duration} mins</span>
                    </div>
                    <div className="text-[#F4F1DE]/20">•</div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      <span>{booking.numberOfPeople} people</span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="text-sm">
                      <h3 className="font-semibold text-[#F4F1DE]/80">Special Requests:</h3>
                      <p className="text-[#F4F1DE] leading-relaxed">{booking.specialRequests}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <span className="text-lg font-semibold">Total price: ${booking.totalPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {bookings.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-black/50 p-8 rounded-2xl border border-[#F4F1DE]/20 max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-[#F4F1DE]/40 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-[#F4F1DE] mb-2">No Experience Bookings Yet</h2>
                <p className="text-[#F4F1DE]/60 mb-6">Start exploring amazing experiences and book your first adventure!</p>
                <Link 
                  to="/experiences"
                  className="inline-block px-6 py-3 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors font-semibold"
                >
                  Browse Experiences
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 