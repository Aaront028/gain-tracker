import React from 'react';
import WorkoutCard from './WorkoutCard';

interface UserWorkoutsProps {
  username: string;
  profilePicture: string;
  workouts: any[]; // We'll use 'any[]' for now to avoid type errors
}

const UserWorkouts: React.FC<UserWorkoutsProps> = ({ username, profilePicture, workouts }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white mr-3">
          <img src={profilePicture} alt={username} className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-semibold text-white">{username}'s Workouts</span>
      </div>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} isUser={true} />
        ))}
      </div>
    </div>
  );
};

export default UserWorkouts;