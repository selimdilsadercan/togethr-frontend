"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const [action, setAction] = useState("Login");
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle Google redirect result on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          // Ensure user doc exists
          await setDoc(
            doc(db, 'users', user.uid),
            {
              name: user.displayName || '',
              username: user.displayName ? user.displayName.replace(/\s+/g, '').toLowerCase() : '',
              email: user.email || '',
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
          router.push('/home');
        }
      } catch (err: any) {
        console.error('Google sign-in error:', err);
        // Only show error if it's not a COOP-related error
        if (!err.message?.includes('Cross-Origin-Opener-Policy')) {
          setError(err?.message || 'Google sign-in failed');
        }
      }
    };

    handleRedirectResult();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (action === 'Login') {
        await signInWithEmailAndPassword(auth, loginEmail, password);
        // Redirect to home (or dashboard)
        router.push('/home');
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          loginEmail,
          password
        );
        const user = userCredential.user;
        // Create a user doc in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name,
          username,
          email: loginEmail,
          createdAt: serverTimestamp(),
        });
        router.push('/home');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // Use redirect instead of popup to avoid COOP issues
      await signInWithRedirect(auth, provider);
      // The redirect will happen, and the result will be handled in useEffect
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#5e00c9] to-[#5e00c9] overflow-hidden px-4">
        <div className="font-['Galindo'] text-[3rem] sm:text-[4rem] text-white mb-4 sm:mb-6 text-center drop-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] flex-shrink-0">
          Welcome to Togethr
        </div>

        <div className="flex flex-col items-center justify-center bg-white rounded-[20px] p-[24px_28px] sm:p-[32px_40px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] w-full max-w-[400px] text-center flex-shrink-0 overflow-y-auto max-h-[85vh]">
          <h2 className="font-['Galindo'] text-[2rem] mt-0 mb-6 text-[#333]">
            {action}
          </h2>

          <form onSubmit={handleSubmit} className="w-full">
            {action === "Sign Up" && (
              <>
                <div className="mb-4 text-left">
                  <label htmlFor="name" className="block mb-2 text-[#555] font-['Galindo'] font-normal text-sm">
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
                    className="w-full p-[0.6rem] border border-[#ddd] rounded-[8px] text-sm font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
                  />
                </div>

                <div className="mb-4 text-left">
                  <label htmlFor="username" className="block mb-2 text-[#555] font-['Galindo'] font-normal text-sm">
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
                    className="w-full p-[0.6rem] border border-[#ddd] rounded-[8px] text-sm font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
                  />
                </div>
              </>
            )}

            <div className="mb-4 text-left">
              <label htmlFor="loginEmail" className="block mb-2 text-[#555] font-['Galindo'] font-normal text-sm">
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
                className="w-full p-[0.6rem] border border-[#ddd] rounded-[8px] text-sm font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
              />
            </div>

            <div className="mb-5 text-left">
              <label htmlFor="password" className="block mb-2 text-[#555] font-['Galindo'] font-normal text-sm">
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
                className="w-full p-[0.6rem] border border-[#ddd] rounded-[8px] text-sm font-['Galindo'] placeholder:text-[#666666] placeholder:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-[0.75rem] rounded-[8px] text-sm font-['Galindo'] font-normal transition-all active:scale-[0.98] ${loading ? 'bg-[#bfb7ff] text-[#eee] cursor-wait' : 'bg-[#4a00e0] text-white cursor-pointer hover:bg-[#3a00b0]'}`}
            >
              {loading ? 'Please wait...' : (action === 'Login' ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {error && (
            <div className="mt-3 text-left w-full">
              <div className="text-xs text-red-600">{error}</div>
            </div>
          )}

          <div className="w-full mt-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-[0.6rem] border border-[#ddd] rounded-[8px] bg-white text-[#444] text-sm hover:bg-[#f7f7f7] transition-all"
            >
              Continue with Google
            </button>
          </div>

          <div className="mt-4">
            <a
              href="#"
              onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}
              className="text-[#4a00e0] no-underline block mt-2 text-[0.85rem] font-['Galindo'] hover:underline"
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
