'use client';
import React from 'react';

interface WorkoutHistory {
  id: number;
  date: Date;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

const HistoryCard: React.FC<{ history: WorkoutHistory }> = ({ history }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
    <div className="flex justify-between">
      <span className="flex-1 text-center font-medium">{history.exerciseName}</span>
      <span className="flex-1 text-center">{history.weight} kgs</span>
      <span className="flex-1 text-center">{history.sets} sets</span>
      <span className="flex-1 text-center">{history.reps} reps</span>
    </div>
    <div className="text-gray-400 text-sm text-center mt-2">{new Date(history.date).toLocaleString()}</div>
  </div>
);

export default HistoryCard;
