"use client";

import React, { useState } from "react";
import WorkoutCard from "./WorkoutCard";
import WorkoutForm from "./WorkoutForm";
import WorkoutUpdateForm from "./WorkoutUpdateForm";
import { useRouter } from "next/navigation";
import Modal from "../@modal/Modal";
import ConfirmationModal from "../@modal/ConfirmationModal";
import Image from 'next/image';


interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  userId: string;
  userName: string;
  userAvatar: string | null; // Add userAvatar to the Workout interface
}

interface WorkoutDashboardProps {
  workouts: Workout[];
  currentUserId: string | undefined;
  currentUserAvatar: string | undefined;
}

const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({ workouts, currentUserId, currentUserAvatar }) => {
  const router = useRouter();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'add' | 'edit'>('add');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

  const handleOpenModal = (type: 'add' | 'edit' = 'add', workout?: Workout) => {
    setModalContent(type);
    if (type === 'edit' && workout) {
      setSelectedWorkout(workout);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);  // Reset selected workout when modal closes
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
        router.refresh();
        // alert('Workout deleted successfully!');
      } else {
        alert('Failed to delete workout.');
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

  // Group workouts by userId using Map
  const groupedWorkouts = workouts.reduce((map, workout) => {
    const userWorkouts = map.get(workout.userId) ?? [];
    userWorkouts.push(workout);
    map.set(workout.userId, userWorkouts);
    return map;
  }, new Map<string, Workout[]>());

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Workout Details</h2>
        <div className="space-y-4">
          {groupedWorkouts.size === 0 ? (
            <p className="text-center">No workouts found.</p>
          ) : (
            Array.from(groupedWorkouts.entries()).map(([userId, userWorkouts]: [string, Workout[]]) => {
              const userName = userWorkouts[0]?.userName; // Get userName from the first workout
              const userAvatar = userWorkouts[0]?.userAvatar; // Get userAvatar from the first workout
              return (
                <div key={userId} className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">

                    <Image
                      src={userAvatar ?? '/default-avatar.png'} // Provide a default value for the src attribute
                      alt={`${userName}'s Avatar`}
                      width={40} // Adjust width as needed
                      height={40} // Adjust height as needed
                      className="rounded-full mr-4"
                    />

                    User {userName}&apos;s Workouts
                  </h3>
                  {userWorkouts.map((workout) => (
                    <div key={workout.id} className="mb-4">
                      <WorkoutCard workout={workout} />
                      {workout.userId === currentUserId && (
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
                        </>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleAddButtonClick}
        >
          Add Workout
        </button>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent === 'add' ? <WorkoutForm /> : selectedWorkout && <WorkoutUpdateForm workout={selectedWorkout} />}
        </Modal>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this workout?`}
      />
    </div>
  );
};

export default WorkoutDashboard;
