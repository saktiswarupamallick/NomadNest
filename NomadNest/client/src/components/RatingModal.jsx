import { useState } from 'react';
import axios from 'axios';

export default function RatingModal({ isOpen, onClose, placeId, onRatingSubmitted }) {
  const [ratings, setRatings] = useState({
    ambience: 0,
    service: 0,
    food: 0
  });

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/ratings', {
        place: placeId,
        ...ratings
      });
      onRatingSubmitted();
      onClose();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black border border-[#F4F1DE]/20 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl text-[#F4F1DE] font-semibold mb-6">Rate Your Experience</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {['ambience', 'service', 'food'].map((category) => (
            <div key={category} className="space-y-2">
              <label className="block text-[#F4F1DE] capitalize">{category}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(category, rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${ratings[category] >= rating 
                        ? 'bg-[#F4F1DE] text-black' 
                        : 'bg-[#F4F1DE]/20 text-[#F4F1DE]'}`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#F4F1DE] hover:bg-[#F4F1DE]/10 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#F4F1DE]/90"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 