'use client'
import React from 'react';
import { FaSignInAlt } from 'react-icons/fa';

const SignInPrompt: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 mt-6">

      <div className="flex items-center space-x-4">

        <div>
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FaSignInAlt className="w-6 h-6 text-yellow-400" />
            <span>Sign In Required</span>
          </h2>
          <p className="mt-2 text-lg">
            To view and manage your workouts and history, please sign in.
            <br />
            <br />
            Signing in allows you to:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Track your workout progress.</li>
            <li>View detailed workout history.</li>
            <li>Access personalized workout recommendations.</li>
            <li>Save and manage your favorite exercises.</li>
          </ul>
          <p className="mt-4 text-lg">
            If you are already signed in, please refresh the page or check your session.
          </p>
        </div>
      </div>

    </div>
  );
};

export default SignInPrompt;
