'use client'

import LoadingPage from "./loading-comp/LoadingPage";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./api/firebase-config";
import { logoutUser } from "./api/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState("")

  const router = useRouter();

  // Check if already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setIsLoading(false);
      } else {
        setIsSignedIn(false);
        setIsLoading(false);
        router.push('/auth/sign-in');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Sign in button handler
  const goToSignIn = () => {
    setIsLoading(true)
    router.push('/auth/sign-in')
  };

  // Sign out button handler
  const signOutUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await logoutUser();

      if (result && result.success) {
        // Let onAuthStateChanged handle the redirect automatically
      } else {
        // Handle case when logout fails
        setError(result?.message || "Failed to sign out");
        setIsLoading(false);
      }

    } catch (error) {
      setError(error?.message || "An error occurred");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        {/* Alert to show  error */}
        {error && (
          <div className="p-2 text-center rounded-lg text-[white] bg-red-700/80">
            {error}
          </div>
        )}
        {!isSignedIn && (
          <button
            onClick={goToSignIn}
            className="text-[#F3F1F1] font-bold button-bg p-4 text-xl cursor-pointer"
            disabled={isLoading}
          >Get Started</button>
        )}
        {isSignedIn && (
          <div className="flex gap-2">
            <button
              onClick={signOutUser}
              className="text-[#F3F1F1] font-bold button-bg p-4 text-xl cursor-pointer"
              disabled={isLoading}
            >Sign out</button>
            <button
              onClick={() => {
                router.push('/dashboard');
                setIsLoading(true);
              }}
              className="text-[#F3F1F1] font-bold button-bg p-4 text-xl cursor-pointer"
              disabled={isLoading}
            >Dashboard</button>
          </div>
        )}
      </main>
    </div>
  );
}
