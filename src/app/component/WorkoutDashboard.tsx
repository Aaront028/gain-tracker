"use client";

import React, { useState } from "react";
import WorkoutCard from "./WorkoutCard";
import WorkoutForm from "./WorkoutForm";
import WorkoutUpdateForm from "./WorkoutUpdateForm";
import { useRouter } from "next/navigation";
import Modal from "../@modal/Modal";

interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

interface WorkoutDashboardProps {
  workouts: Workout[];
}

const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({ workouts }) => {
  const router = useRouter();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'add' | 'edit'>('add');

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

  const handleDeleteClick = async (workoutId: number) => {
    const response = await fetch(`/api/workouts/${workoutId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      router.refresh();
      alert('Workout deleted successfully!');
    } else {
      alert('Failed to delete workout.');
    }
  };

  const handleAddButtonClick = () => {
    handleOpenModal('add');
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Workout Details</h2>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout.id}>
              <WorkoutCard workout={workout} />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => handleEditClick(workout)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
                onClick={() => handleDeleteClick(workout.id)}
              >
                Delete
              </button>
            </div>
          ))}
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
    </div>
  );
};

export default WorkoutDashboard;
