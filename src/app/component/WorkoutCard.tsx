import React from 'react';

// Define the TypeScript interface for the workout prop
interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between">
        <span className="flex-1 text-center font-medium">{workout.exerciseName}</span>
        <span className="flex-1 text-center">{workout.weight} kgs</span>
        <span className="flex-1 text-center">{workout.sets} sets</span>
        <span className="flex-1 text-center">{workout.reps} reps</span>
      </div>
    </div>
  );
};

export default WorkoutCard;
