'use client';

import React, { useState, useEffect } from "react";
import HistoryCard from "./HistoryCard";
import WorkoutForm from "./WorkoutForm";
import WorkoutUpdateForm from "./WorkoutUpdateForm";
import { useRouter } from "next/navigation";
import Modal from "../app/@modal/Modal";
import ConfirmationModal from "../app/@modal/ConfirmationModal";
import { toast } from "sonner";
import WorkoutCard from "./WorkoutCard";
import { Edit, Trash2, Eye, EyeOff, History } from 'lucide-react';

interface Workout {
  id: number;
  exerciseId: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  userId: string;
  userName: string;
  userAvatar: string | null;
  show_workout: boolean;
}

interface Exercise {
  id: number;
  name: string;
  category: string;
}

interface WorkoutHistory {
  id: number;
  workoutId: number;
  date: Date;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

interface UserWorkoutProps {
  workouts: Workout[];
  currentUserId: string | undefined;
  currentUserAvatar: string | undefined;
  exercises: Exercise[];
}

const UserWorkout: React.FC<UserWorkoutProps> = ({ workouts, currentUserId, currentUserAvatar, exercises }) => {
  const router = useRouter();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'add' | 'edit'>('add');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [historyVisible, setHistoryVisible] = useState<number[]>([]);
  const [fetchedHistories, setFetchedHistories] = useState<number[]>([]);

  useEffect(() => {
    console.log("Workouts:", workouts);
    console.log("Current workout history:", workoutHistory);
  }, [workouts, workoutHistory]);

  const handleIsEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleOpenModal = (type: 'add' | 'edit' = 'add', workout?: Workout) => {
    setModalContent(type);
    if (type === 'edit' && workout) {
      setSelectedWorkout(workout);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
  };

  const handleEditClick = (workout: Workout) => {
    handleOpenModal('edit', workout);
  };

  const handleOpenConfirmation = (workout: Workout) => {
    setWorkoutToDelete(workout);
    setIsConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
    setWorkoutToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (workoutToDelete) {
      const response = await fetch(`/api/workouts/${workoutToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Workout deleted successfully');
        router.refresh();
      } else {
        toast.error('Failed to delete workout');
      }

      handleCloseConfirmation();
    }
  };

  const handleDeleteClick = (workout: Workout) => {
    handleOpenConfirmation(workout);
  };

  const handleAddButtonClick = () => {
    handleOpenModal('add');
  };

  const handleShowWorkout = async (workout: Workout) => {
    if (workout) {
      const response = await fetch(`/api/workouts/${workout.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          show_workout: !workout.show_workout,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        toast.error('Failed to update workout visibility');
      }
    }
  };

  const handleToggleHistory = async (workoutId: number) => {
    console.log(`Toggling history for workout ID: ${workoutId}`);
    if (historyVisible.includes(workoutId)) {
      setHistoryVisible(historyVisible.filter(id => id !== workoutId));
    } else {
      try {
        console.log(`Fetching history for workout ID: ${workoutId}`);
        const response = await fetch(`/api/workouts/${workoutId}/history`);
        if (!response.ok) {
          throw new Error(`Failed to fetch workout history: ${response.statusText}`);
        }
        const history: WorkoutHistory[] = await response.json();
        console.log(`Received history for workout ID ${workoutId}:`, history);

        setWorkoutHistory(prevHistory => [...prevHistory, ...history]);
        setHistoryVisible(prev => [...prev, workoutId]);
      } catch (error) {
        console.error('Error fetching workout history:', error);
        toast.error('Failed to fetch workout history');
      }
    }
  };

  // Filter workouts to show only those of the current user
  const userWorkouts = workouts.filter(workout => workout.userId === currentUserId);

  // Sort workouts by a stable criterion, such as ID
  const sortedUserWorkouts = userWorkouts.sort((a, b) => b.id - a.id);

  const scrollableStyle = {
    overflowY: 'auto' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };

  return (
    <div className="flex flex-col p-6">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Your Workouts</h2>
        <div className="space-y-4 max-h-[60vh] pr-2" style={scrollableStyle}>
          {sortedUserWorkouts.length === 0 ? (
            <p className="text-center">No workouts found.</p>
          ) : (
            sortedUserWorkouts.map((workout) => (
              <div key={workout.id} className="mb-4 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
                <WorkoutCard workout={workout} isUser={true} />
                <div className={`transition-all duration-300 ease-in-out ${isEditing ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-2 flex justify-between items-center">
                    <button
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      onClick={() => handleEditClick(workout)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      onClick={() => handleDeleteClick(workout)}
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      className={`transition-colors duration-200 ${workout.show_workout ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}`}
                      onClick={() => handleShowWorkout(workout)}
                    >
                      {workout.show_workout ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                      onClick={() => handleToggleHistory(workout.id)}
                    >
                      <History size={20} />
                    </button>
                  </div>
                </div>
                {historyVisible.includes(workout.id) && (
                  <div className="p-4 bg-gray-700 rounded-b-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Workout History</h3>
                    {(() => {
                      const history = workoutHistory.filter(h => h.workoutId === workout.id);
                      if (history.length > 0) {
                        return (
                          <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                              <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Weight</th>
                                <th scope="col" className="px-6 py-3">Sets</th>
                                <th scope="col" className="px-6 py-3">Reps</th>
                              </tr>
                            </thead>
                            <tbody>
                              {history
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map(historyItem => (
                                  <tr key={historyItem.id} className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">{new Date(historyItem.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{historyItem.weight} kgs</td>
                                    <td className="px-6 py-4">{historyItem.sets}</td>
                                    <td className="px-6 py-4">{historyItem.reps}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        );
                      } else {
                        return <p className="text-gray-400">No history available for this workout.</p>;
                      }
                    })()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center mb-4 space-x-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors duration-200 flex items-center"
          onClick={handleAddButtonClick}
        >
          <span className="mr-2">+</span> Add Workout
        </button>
        <button
          className={`px-6 py-2 rounded-full transition-colors duration-200 flex items-center ${isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          onClick={handleIsEdit}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalContent === 'add' ? <WorkoutForm onClose={handleCloseModal} exercises={exercises} /> : selectedWorkout && <WorkoutUpdateForm workout={selectedWorkout} onClose={handleCloseModal} exercises={exercises} />}
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this workout?`}
      />
    </div>
  );
};

export default UserWorkout;