import { useState, useRef } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const categories = {
    'Property Information': {
      'How to List a Property': 'To list your property:\n1. Create an account\n2. Go to "Account" → "My Places"\n3. Click "Add New Place"\n4. Fill in property details\n5. Add photos and amenities\n6. Set your price and availability',
      'Property Requirements': 'Your property should have:\n- Clear, high-quality photos\n- Detailed description\n- Accurate location\n- House rules\n- Available amenities\n- Valid pricing',
      'Property Management': 'Manage your listings by:\n- Updating availability\n- Responding to bookings\n- Managing reviews\n- Adjusting prices\n- Adding new photos'
    },
    'Booking Process': {
      'How to Book': 'To book a property:\n1. Browse available properties\n2. Select your dates\n3. Enter guest details\n4. Review house rules\n5. Complete payment',
      'Payment Methods': 'We accept:\n- Credit/Debit Cards\n- PayPal\n- Bank Transfer\nAll payments are secure and encrypted',
      'Cancellation Policy': 'Cancellation policies vary by property:\n- Full refund up to 24h before check-in\n- 50% refund up to 48h before\n- No refund within 24h\nCheck specific property for details'
    },
    'User Account': {
      'Account Creation': 'Create an account by:\n1. Click "Register"\n2. Enter your details\n3. Verify your email\n4. Complete your profile',
      'Profile Management': 'Manage your profile:\n- Update personal info\n- Add profile picture\n- Set preferences\n- View booking history',
      'Security': 'Your account is protected by:\n- Secure password\n- Email verification\n- Two-factor authentication\n- Encrypted data'
    },
    'Support': {
      'Contact Us': 'Reach us at:\n- Email: support@nomadnest.com\n- Phone: +1-800-NOMAD\n- Live chat: Available 24/7',
      'FAQ': 'Common questions:\n- How to modify booking?\n- Payment issues\n- Property disputes\n- Account problems',
      'Emergency': 'For emergencies:\n- Call: +1-800-EMERGENCY\n- Email: emergency@nomadnest.com\n- Available 24/7'
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedOption(null);
    setTimeout(scrollToBottom, 100);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#F4F1DE] hover:bg-[#E5E2D1] text-black rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-black/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#F4F1DE]/20">
          {/* Chat Header */}
          <div className="bg-[#F4F1DE] border-b border-[#F4F1DE]/20 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-black ">NomadNest Assistant</h3>
            <button onClick={() => setIsOpen(false)} className=" ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="h-[500px] overflow-y-auto p-4">
            <div className="flex flex-col space-y-4">
              {/* Welcome Message */}
              <div className="bg-black/50 border border-[#F4F1DE]/20 rounded-lg p-3">
                <p className="text-sm text-[#F4F1DE]">Welcome to NomadNest! How can I help you today?</p>
              </div>

              {/* Categories */}
              {!selectedCategory && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(categories).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className="bg-black/50 border border-[#F4F1DE]/20 rounded-lg p-3 text-sm text-[#F4F1DE] hover:bg-[#F4F1DE]/10 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {/* Options */}
              {selectedCategory && !selectedOption && (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-[#F4F1DE] bg-black/50 border border-[#F4F1DE]/20 rounded-lg p-3 text-sm hover:underline mb-2"
                  >
                    ← Back to Categories
                  </button>
                  {Object.keys(categories[selectedCategory]).map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className="w-full bg-black/50 border border-[#F4F1DE]/20 rounded-lg p-3 text-sm text-[#F4F1DE] hover:bg-[#F4F1DE]/10 transition-colors text-left"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Information */}
              {selectedCategory && selectedOption && (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedOption(null)}
                    className="text-[#F4F1DE] bg-black/50 border border-[#F4F1DE]/20 rounded-lg p-3 text-sm hover:underline mb-2"
                  >
                    ← Back to Options
                  </button>
                  <div className="bg-black/50 border border-[#F4F1DE]/20 rounded-lg p-3">
                    <p className="text-sm text-[#F4F1DE] whitespace-pre-line">
                      {categories[selectedCategory][selectedOption]}
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 