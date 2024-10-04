// WorkoutCard.tsx
import React from 'react';
import Tooltip from '~/app/utils/Tooltip';
import { Dumbbell, Layers, Repeat } from 'lucide-react';

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
  isUser: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, isUser }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md relative transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="flex flex-col space-y-2">
        <span className="text-lg font-semibold text-white">{workout.exerciseName}</span>
        <div className="flex justify-between text-sm">
          {isUser ? (
            <>
              <IconWrapper icon={Dumbbell} label="Weight" value={`${workout.weight} kgs`} color="text-cyan-300" />
              <IconWrapper icon={Layers} label="Sets" value={workout.sets.toString()} color="text-emerald-300" />
              <IconWrapper icon={Repeat} label="Reps" value={workout.reps.toString()} color="text-amber-300" />
            </>
          ) : (
            <>
              <IconWrapper icon={Dumbbell} label="Weight" value={`${workout.weight} kgs`} color="text-cyan-300" hidden={!workout.show_workout} />
              <IconWrapper icon={Layers} label="Sets" value={workout.sets.toString()} color="text-emerald-300" hidden={!workout.show_workout} />
              <IconWrapper icon={Repeat} label="Reps" value={workout.reps.toString()} color="text-amber-300" hidden={!workout.show_workout} />
            </>
          )}
        </div>
      </div>
      {!workout.show_workout && (
        <Tooltip content="This workout is currently hidden.">
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium"></span>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

interface IconWrapperProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  hidden?: boolean;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, label, value, color, hidden = false }) => (
  <span className={`text-gray-300 flex items-center group ${hidden ? 'filter blur-sm' : ''}`}>
    <Icon className={`w-5 h-5 mr-1 ${color} transition-transform duration-300 ease-in-out group-hover:scale-110`} />
    <span>
      {label}: <span className="font-medium text-white">{value}</span>
    </span>
  </span>
);

export default WorkoutCard;
