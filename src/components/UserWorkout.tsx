'use client';

import React, { useState } from "react";
import HistoryCard from "./HistoryCard"; // Import the new HistoryCard component
import WorkoutForm from "./WorkoutForm";
import WorkoutUpdateForm from "./WorkoutUpdateForm";
import { useRouter } from "next/navigation";
import Modal from "../app/@modal/Modal";
import ConfirmationModal from "../app/@modal/ConfirmationModal";
import { toast } from "sonner";
import WorkoutCard from "./WorkoutCard";

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
  date: Date;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

interface Exercise {
  id: number;
  name: string;
  category: string;
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
    if (historyVisible.includes(workoutId)) {
      // If history is currently visible, hide it
      setHistoryVisible(historyVisible.filter(id => id !== workoutId));
    } else {
      // If history is not currently visible, show it
      if (!fetchedHistories.includes(workoutId)) {
        // Fetch history only if it hasn't been fetched before
        const response = await fetch(`/api/workouts/${workoutId}/history`);
        const history: WorkoutHistory[] = await response.json() as WorkoutHistory[];

        // Ensure no duplicate histories are added
        const existingHistoryIds = new Set(workoutHistory.map(h => h.id));
        const newHistory = history.filter(h => !existingHistoryIds.has(h.id));

        setWorkoutHistory(prevHistory => [...prevHistory, ...newHistory]);
        setFetchedHistories(prevFetched => [...prevFetched, workoutId]);
      }
      setHistoryVisible([...historyVisible, workoutId]);
    }
  };

  // Filter workouts to show only those of the current user
  const userWorkouts = workouts.filter(workout => workout.userId === currentUserId);

  // Sort workouts by a stable criterion, such as ID
  const sortedUserWorkouts = userWorkouts.sort((a, b) => a.id - b.id);

  // Group workout history by date
  const groupedHistory = workoutHistory.reduce((acc, history) => {
    const date = new Date(history.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(history);
    return acc;
  }, {} as Record<string, WorkoutHistory[]>);

  return (
    <div className="flex flex-col p-6">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Your Workouts</h2>
        <div className="space-y-4">
          {sortedUserWorkouts.length === 0 ? (
            <p className="text-center">No workouts found.</p>
          ) : (
            sortedUserWorkouts.map((workout) => (
              <div key={workout.id} className="mb-4">
                <WorkoutCard workout={workout} isUser={true} />
                {isEditing && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                      onClick={() => handleEditClick(workout)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
                      onClick={() => handleDeleteClick(workout)}
                    >
                      Delete
                    </button>
                    <button
                      className={`px-4 py-2 rounded mt-2 ml-2 text-white ${workout.show_workout ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      onClick={() => handleShowWorkout(workout)}
                    >
                      {workout.show_workout ? "Hide Workout" : "Show Workout"}
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2"
                      onClick={() => handleToggleHistory(workout.id)}
                    >
                      {historyVisible.includes(workout.id) ? "Hide History" : "Show History"}
                    </button>
                    {historyVisible.includes(workout.id) && groupedHistory && (
                      <div className="mt-2 bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-white">Workout History</h3>
                        {Object.entries(groupedHistory).map(([date, histories]) => (
                          <div key={date} className="mb-4">
                            <h4 className="text-md font-medium text-white">{date}</h4>
                            {histories.filter(history => history.exerciseName === workout.exerciseName).map(history => (
                              <HistoryCard key={history.id} history={history} />
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 mr-4"
          onClick={handleAddButtonClick}
        >
          Add Workout
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleIsEdit}
        >
          {isEditing ? "Hide" : "Edit"}
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
