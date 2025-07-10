import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
  const {id} = useParams();
  const [place,setPlace] = useState(null);
  const [ratings, setRatings] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/places/${id}`).then(response => {
      setPlace(response.data);
    });
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/places/${id}/ratings`).then(response => {
      setRatings(response.data);
    });
  }, [id]);

  if (!place) return '';

  return (
    <div className="min-h-screen bg-black text-[#F4F1DE]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="py-8">
          <h1 className="text-4xl font-bold mb-2">{place.title}</h1>
          <AddressLink>{place.address}</AddressLink>
          
          {ratings && ratings.averageRatings && (
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <span className="text-xl font-semibold">{ratings.averageRatings.overall.toFixed(1)}</span>
              </div>
              <div className="flex gap-4 text-sm text-[#F4F1DE]/80">
                <span>Ambience: {ratings.averageRatings.ambience.toFixed(1)}</span>
                <span>Service: {ratings.averageRatings.service.toFixed(1)}</span>
                <span>Food: {ratings.averageRatings.food.toFixed(1)}</span>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <PlaceGallery place={place} />
          </div>

          <div className="mt-12 grid gap-12 grid-cols-1 md:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-[#F4F1DE]/80 leading-relaxed">{place.description}</p>
              </div>

              <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
                <h2 className="text-2xl font-semibold mb-4">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#F4F1DE]/60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm text-[#F4F1DE]/60">Check-in</div>
                      <div>{place.checkIn}:00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#F4F1DE]/60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm text-[#F4F1DE]/60">Check-out</div>
                      <div>{place.checkOut}:00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#F4F1DE]/60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <div>
                      <div className="text-sm text-[#F4F1DE]/60">Max guests</div>
                      <div>{place.maxGuests} people</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#F4F1DE]/60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <div>
                      <div className="text-sm text-[#F4F1DE]/60">Price</div>
                      <div>${place.price} per night</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20">
                <h2 className="text-2xl font-semibold mb-4">Extra info</h2>
                <p className="text-[#F4F1DE]/80 leading-relaxed">{place.extraInfo}</p>
              </div>
            </div>

            <div className="md:top-8">
              <BookingWidget place={place} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
