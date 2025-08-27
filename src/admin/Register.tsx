import React, { useState } from 'react';
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      const response = await axios.post('https://mrbeastbknd-production.up.railway.app/secure/admin/register', { email, password });
      alert("registration successful")
      console.log(response.data);
    } catch (err) {
      setError('Register failed. Please check your credentials.');
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className='flex justify-between items-center bg-blue-700 p-5 shadow-md'>
        <h1 className='font-semibold text-white text-3xl'>Admin Signup Page</h1>
        <a href="Login">
          <button className='bg-red-600 text-white hover:bg-red-500 shadow-md rounded-lg px-4 py-2 font-medium'>
            Login
          </button>
        </a>
      </div>

      <div className='flex-grow flex items-center justify-center'>
        <form 
          id='registerForm' 
          className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg space-y-6" 
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Signup to access admin dashboard</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your credentials to continue</p>
          </div>
          
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name='email'
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name='password'
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          
          <button 
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;