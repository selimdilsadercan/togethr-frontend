"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [action, setAction] = useState("Login");
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (action === "Login") {
      console.log('--- Login Attempt ---');
      console.log('Email:', loginEmail);
      console.log('Password:', password);
    } else {
      console.log('--- Sign Up Attempt ---');
      console.log('Name:', name);
      console.log('Username:', username);
      console.log('Email:', loginEmail);
      console.log('Password:', password);
    }
    console.log(`${action} attempt submitted.`);
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#5e00c9] to-[#5e00c9] pt-[60px]">
        <div className="font-['Galindo'] text-[5.5rem] text-white mb-10 text-center drop-shadow-[2px_2px_5px_rgba(0,0,0,0.3)]">
          Welcome to Togethr
        </div>

        <div className="flex flex-col items-center justify-center bg-white rounded-[20px] p-[40px_50px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] w-[400px] min-h-[450px] text-center">
          <h2 className="font-['Galindo'] text-[2.5rem] mt-0 mb-8 text-[#333]">
            {action}
          </h2>

          <form onSubmit={handleSubmit} className="w-full">
            {action === "Sign Up" && (
              <>
                <div className="mb-6 text-left">
                  <label htmlFor="name" className="block mb-2 text-[#555] font-['Galindo'] font-normal">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full p-[0.8rem] border border-[#ddd] rounded-[8px] text-base font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
                  />
                </div>

                <div className="mb-6 text-left">
                  <label htmlFor="username" className="block mb-2 text-[#555] font-['Galindo'] font-normal">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="w-full p-[0.8rem] border border-[#ddd] rounded-[8px] text-base font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
                  />
                </div>
              </>
            )}

            <div className="mb-6 text-left">
              <label htmlFor="loginEmail" className="block mb-2 text-[#555] font-['Galindo'] font-normal">
                Email:
              </label>
              <input
                type="email"
                id="loginEmail"
                name="loginEmail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[8px] text-base font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
              />
            </div>

            <div className="mb-6 text-left">
              <label htmlFor="password" className="block mb-2 text-[#555] font-['Galindo'] font-normal">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[8px] text-base font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-[0.9rem] bg-[#4a00e0] text-white rounded-[8px] text-base font-['Galindo'] font-normal cursor-pointer transition-all hover:bg-[#3a00b0] active:scale-[0.98]"
            >
              {action === "Login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <a
              href="#"
              onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}
              className="text-[#4a00e0] no-underline block mt-3 text-[0.9rem] font-['Galindo'] hover:underline"
            >
              {action === "Login"
                ? "Don't you have an account? Sign Up"
                : "Already have an account? Login"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
