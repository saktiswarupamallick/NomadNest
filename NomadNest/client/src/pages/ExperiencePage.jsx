import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Image from "../Image.jsx";
import {useContext} from "react";
import {UserContext} from "../UserContext.jsx";
import ExperienceBookingWidget from "../ExperienceBookingWidget.jsx";

export default function ExperiencePage() {
  const {id} = useParams();
  const [experience, setExperience] = useState(null);
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (!id) return;
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/experiences/${id}`).then(response => {
      console.log('Experience data loaded:', response.data);
      console.log('Availability data:', response.data.availability);
      setExperience(response.data);
    });
  }, [id]);

  if (!experience) return '';

  return (
    <div className="min-h-screen bg-black text-[#F4F1DE]">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Experience Header */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {/* Photos */}
          <div className="grid gap-2 grid-cols-2">
            {experience.photos?.map((photo, index) => (
              <div key={index} className="aspect-square">
                <Image
                  className="object-cover w-full h-full rounded-lg"
                  src={photo}
                  alt=""
                />
              </div>
            ))}
          </div>

          {/* Experience Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm bg-[#F4F1DE]/10">
                {experience.type}
              </span>
              <span className="text-sm text-[#F4F1DE]/60">
                {experience.duration} mins
              </span>
            </div>

            <h1 className="text-3xl font-bold">{experience.title}</h1>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < experience.rating ? "currentColor" : "none"}
                    className="w-5 h-5 text-[#F4F1DE]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-[#F4F1DE]/60">
                {experience.reviews?.length} reviews
              </span>
            </div>

            <div className="border-t border-[#F4F1DE]/20 pt-4">
              <h2 className="text-xl font-semibold mb-2">About this experience</h2>
              <p className="text-[#F4F1DE]/80">{experience.description}</p>
            </div>

            <div className="border-t border-[#F4F1DE]/20 pt-4">
              <h2 className="text-xl font-semibold mb-2">What's included</h2>
              <ul className="list-disc list-inside text-[#F4F1DE]/80">
                {experience.includedItems?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#F4F1DE]/20 pt-4">
              <h2 className="text-xl font-semibold mb-2">Requirements</h2>
              <ul className="list-disc list-inside text-[#F4F1DE]/80">
                {experience.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="mt-8 border-t border-[#F4F1DE]/20 pt-8">
          <div className="max-w-md mx-auto">
            <ExperienceBookingWidget experience={experience} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 border-t border-[#F4F1DE]/20 pt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {experience.reviews?.map((review, index) => (
              <div key={index} className="bg-black/50 rounded-xl border border-[#F4F1DE]/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{review.user.name}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={i < review.rating ? "currentColor" : "none"}
                        className="w-4 h-4 text-[#F4F1DE]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-[#F4F1DE]/80">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 