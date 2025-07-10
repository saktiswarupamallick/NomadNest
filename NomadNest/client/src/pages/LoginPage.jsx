import {Link, Navigate} from "react-router-dom";
import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "../UserContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {email,password});
      setUser(data);
      alert('Login successful');
      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
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

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-black p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl text-center mb-8 text-[#F4F1DE] font-bold">Welcome Back</h1>
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
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
              Login
            </button>
            <div className="text-center py-2 text-gray-500">
              Don't have an account yet?{' '}
              <Link className="text-[#F4F1DE] hover:text-[#E5E2D1] underline" to={'/register'}>
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}