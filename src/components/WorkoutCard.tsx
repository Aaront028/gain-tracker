import React from 'react';
import Tooltip from '~/app/utils/Tooltip';

interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  show_workout: boolean;
}
interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between">
        <span className="flex-1 text-center font-medium">{workout.exerciseName}</span>
        <span className={`flex-1 text-center ${!workout.show_workout ? 'filter blur-sm' : ''}`}>{workout.weight} kgs</span>
        <span className={`flex-1 text-center ${!workout.show_workout ? 'filter blur-sm' : ''}`}>{workout.sets} sets</span>
        <span className={`flex-1 text-center ${!workout.show_workout ? 'filter blur-sm' : ''}`}>{workout.reps} reps</span>
        {!workout.show_workout && (
          <Tooltip content="This workout is currently hidden.">
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;
