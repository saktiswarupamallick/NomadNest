import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  
  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        name,
        email,
        password,
      });
      alert('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (e) {
      alert('Registration failed. Please try again later');
    }
  }
  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury Airbnb Home"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-black p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl text-center mb-8 text-[#F4F1DE] font-bold">Create Account</h1>
          <form className="space-y-6" onSubmit={registerUser}>
            <div>
              <input 
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={ev => setName(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
              />
            </div>
            <div>
              <input 
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
              />
            </div>
            <div>
              <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
              />
            </div>
            <button 
              className="w-full py-3 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition duration-200 font-semibold"
            >
              Register
            </button>
            <div className="text-center py-2 text-gray-500">
              Already a member?{' '}
              <Link className="text-[#F4F1DE] hover:text-[#E5E2D1] underline" to={'/login'}>
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

